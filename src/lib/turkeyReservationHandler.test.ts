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
describe.each(["turkey", "turkey-breast"] as const)("%s customer names", type => {
  const submit = (customer: Record<string, unknown>) => createTurkeyReservationHandler(type)(new Request("http://localhost/api/reservations", {
    method: "POST", body: JSON.stringify({
      pickupDate: "2026-11-20", storeLocationId: "siesels-meats",
      customer: { email: "customer@example.test", ...customer },
      items: [{ productId: 430, quantity: 1 }],
    }),
  }));
  it.each([
    { firstName: "Test" }, { lastName: "Customer" },
    { firstName: " ", lastName: "Customer" }, { firstName: "Test", lastName: " " },
    { firstName: 123, lastName: "Customer" }, { name: "Test Customer" },
  ])("rejects missing or invalid separate names: %j", async customer => {
    const response = await submit(customer);
    expect(response.status).toBe(400);
    expect((await response.json()).message).toContain("first and last name");
    expect(mocks.call).not.toHaveBeenCalled();
  });
  it("preserves multiword first and last names in billing", async () => {
    expect((await submit({ firstName: " Mary Jane ", lastName: " de la Cruz " })).status).toBe(200);
    const checkout = mocks.call.mock.calls.find(([path]) => path === "/checkout");
    expect(JSON.parse(checkout![1].body).billing_address).toMatchObject({ first_name: "Mary Jane", last_name: "de la Cruz" });
  });
});

describe("turkey breast checkout", () => {
  it("uses its own session, validates the breast category, and preserves pickup details and notes", async () => {
    const response = await createTurkeyReservationHandler("turkey-breast")(new Request("http://localhost/api/turkey-breast-reservations", {
      method: "POST",
      body: JSON.stringify({
        pickupDate: "2026-11-20", storeLocationId: "iowa-meat-farms", notes: "Please call at pickup.",
        customer: { firstName: "Test", lastName: "Customer", email: "customer@example.test", phone: "(619) 555-1234" },
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
    expect(payload.billing_address.phone).toBe("+16195551234");
    expect(payload.customer_note).toContain("Turkey breast reservation.");
    expect(payload.customer_note).toContain("Iowa Meat Farms (iowa-meat-farms)");
    expect(payload.customer_note).toContain("Reservation notes:\nPlease call at pickup.");
  });
});
it.each(["turkey", "turkey-breast"] as const)("rejects invalid %s phones before touching the cart", async type => {
  const response = await createTurkeyReservationHandler(type)(new Request("http://localhost/api/reservations", {
    method: "POST", body: JSON.stringify({
      pickupDate: "2026-11-20", storeLocationId: "iowa-meat-farms",
      customer: { firstName: "Test", lastName: "Customer", email: "customer@example.test", phone: "123" },
      items: [{ productId: 430, quantity: 1 }],
    }),
  }));
  expect(response.status).toBe(400);
  expect(mocks.call).not.toHaveBeenCalled();
});
