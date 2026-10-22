import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTurkeyReservationHandler } from "./turkeyReservationHandler";

const mocks = vi.hoisted(() => ({ read: vi.fn(), write: vi.fn(), call: vi.fn(), validate: vi.fn() }));
vi.mock("@/lib/storeApiSession", () => ({ readStoreApiSession: mocks.read, writeStoreApiSession: mocks.write }));
vi.mock("@/lib/wooCommerceStoreApi", () => ({ callStoreApi: mocks.call, StoreApiError: class extends Error {} }));
vi.mock("@/services/turkeyReservations", () => ({ validateTurkeyReservationLines: mocks.validate }));
vi.mock("@/utils/reservationOrdering", () => ({
  getReservationOrderingStatus: () => ({ isOpen: true }),
  isReservationPickupDateAllowed: () => true,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.read.mockResolvedValue({});
  mocks.write.mockImplementation(response => response);
  mocks.validate.mockResolvedValue(null);
  mocks.call.mockResolvedValue({ session: {}, data: { order_id: 123, order_key: "test-key" } });
});

describe("turkey breast checkout", () => {
  it("uses its own session, validates the breast category, and preserves pickup details and notes", async () => {
    const response = await createTurkeyReservationHandler("turkey-breast")(new Request("http://localhost/api/turkey-breast-reservations", {
      method: "POST",
      body: JSON.stringify({
        pickupDate: "2026-11-20", storeLocationId: "iowa-meat-farms", notes: "Please call at pickup.",
        customer: { name: "Test Customer", email: "customer@example.test", phone: "5551234567" },
        items: [{ productId: 430, variationId: 431, quantity: 2 }],
      }),
    }));
    expect(response.status).toBe(200);
    expect(mocks.read).toHaveBeenCalledWith("wc_turkey_breast_reservation");
    expect(mocks.validate).toHaveBeenCalledWith([{ productId: 430, variationId: 431, quantity: 2 }], "turkey-breast");
    const added = mocks.call.mock.calls.find(([path]) => path === "/cart/add-item");
    expect(JSON.parse(added![1].body)).toMatchObject({ id: 431, quantity: 2 });
    const checkout = mocks.call.mock.calls.find(([path]) => path === "/checkout");
    const payload = JSON.parse(checkout![1].body);
    expect(payload.customer_note).toContain("Turkey breast reservation.");
    expect(payload.customer_note).toContain("Iowa Meat Farms (iowa-meat-farms)");
    expect(payload.customer_note).toContain("Reservation notes:\nPlease call at pickup.");
  });
});