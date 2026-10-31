import { beforeEach, expect, it, vi } from "vitest";
import { POST as ham } from "@/app/api/ham-reservations/route";
import { POST as roast } from "@/app/api/roast-reservations/route";
const mocks = vi.hoisted(() => ({ call: vi.fn(), get: vi.fn() }));
vi.mock("@/lib/storeApiSession", () => ({ readStoreApiSession: async () => ({}), writeStoreApiSession: (r: unknown) => r }));
vi.mock("@/lib/wooCommerceStoreApi", () => ({ callStoreApi: mocks.call, StoreApiError: class extends Error {} }));
vi.mock("@/lib/woocommerce", () => ({ getWooCommerceApi: () => ({ get: mocks.get }) }));
vi.mock("@/services/hamReservations", () => ({ getHamReservationProducts: async () => [], validateHamReservationLines: () => null }));
vi.mock("@/services/roastReservations", () => ({ getGrade: () => "USDA Prime", getRoastSeasoning: () => null }));
vi.mock("@/utils/reservationOrdering", () => ({ getReservationOrderingStatus: () => ({ isOpen: true }), isReservationPickupDateAllowed: () => true }));
beforeEach(() => {
 vi.clearAllMocks();
 mocks.call.mockResolvedValue({ session: {}, data: { order_id: 123 } });
 mocks.get.mockResolvedValue({ data: { status: "publish", type: "variable", categories: [{ id: 41 }], manage_stock: true, stock_quantity: 20, stock_status: "instock" } });
});
function request(phone: string) {
 return new Request("http://localhost/api/reservations", { method: "POST", body: JSON.stringify({
  pickupDate: "2026-11-20", storeLocationId: "siesels-meats", customer: { name: "Test Customer", email: "test@example.test", phone },
  items: [{ productId: 1, variationId: 2, quantity: 1, grade: "USDA Prime" }],
 }) });
}
it.each([["ham", ham], ["roast", roast]] as const)("normalizes %s checkout phones", async (_name, handler) => {
 expect((await handler(request("(619) 555-1234"))).status).toBe(200);
 const checkout = mocks.call.mock.calls.find(([path]) => path === "/checkout");
 expect(JSON.parse(checkout![1].body).billing_address.phone).toBe("+16195551234");
});
it.each([["ham", ham], ["roast", roast]] as const)("rejects invalid %s phones before cart changes", async (_name, handler) => {
 expect((await handler(request("123"))).status).toBe(400);
 expect(mocks.call).not.toHaveBeenCalled();
 expect(mocks.get).not.toHaveBeenCalled();
});
