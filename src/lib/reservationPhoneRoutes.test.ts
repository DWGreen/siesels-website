import { beforeEach, expect, it, vi } from "vitest";
import { POST as ham } from "@/app/api/ham-reservations/route";
import { POST as roast } from "@/app/api/roast-reservations/route";
const mocks = vi.hoisted(() => ({ call: vi.fn(), get: vi.fn() }));
vi.mock("@/lib/storeApiSession", () => ({ readStoreApiSession: async () => ({}), writeStoreApiSession: (r: unknown) => r }));
vi.mock("@/lib/wooCommerceStoreApi", () => ({ callStoreApi: mocks.call, StoreApiError: class extends Error {} }));
vi.mock("@/lib/woocommerce", () => ({ getWooCommerceApi: () => ({ get: mocks.get }) }));
vi.mock("@/services/hamReservations", () => ({ getHamReservationProducts: async () => [], validateHamReservationLines: () => null }));
vi.mock("@/services/roastReservations", () => ({ getGrade: () => "USDA Prime", getRoastSeasoning: () => null, getRoastEasyCarve: () => null }));
vi.mock("@/utils/reservationOrdering", () => ({ getReservationOrderingStatus: () => ({ isOpen: true }), isReservationPickupDateAllowed: () => true }));
beforeEach(() => {
 vi.clearAllMocks();
 mocks.call.mockResolvedValue({ session: {}, data: { order_id: 123 } });
 mocks.get.mockResolvedValue({ data: { status: "publish", type: "variable", categories: [{ id: 41 }], manage_stock: true, stock_quantity: 20, stock_status: "instock" } });
});
function request(phone: string) {
 return new Request("http://localhost/api/reservations", { method: "POST", body: JSON.stringify({
  pickupDate: "2026-11-20", storeLocationId: "siesels-meats", customer: { firstName: "Test", lastName: "Customer", email: "test@example.test", phone },
  items: [{ productId: 1, variationId: 2, quantity: 1, grade: "USDA Prime" }],
 }) });
}
it.each([["ham", ham], ["roast", roast]] as const)("requires separate %s customer names and preserves multiword names", async (_name, handler) => {
 for (const customer of [
  { firstName: "Test" }, { lastName: "Customer" },
  { firstName: " ", lastName: "Customer" }, { firstName: "Test", lastName: " " },
  { firstName: 123, lastName: "Customer" }, { name: "Test Customer" },
 ]) {
  const body = await request("").json();
  body.customer = { ...customer, email: "test@example.test" };
  const response = await handler(new Request("http://localhost/api/reservations", { method: "POST", body: JSON.stringify(body) }));
  expect(response.status).toBe(400);
  expect((await response.json()).message).toContain("first and last name");
  expect(mocks.call).not.toHaveBeenCalled();
 }
 const body = await request("").json();
 body.customer.firstName = " Mary Jane ";
 body.customer.lastName = " de la Cruz ";
 expect((await handler(new Request("http://localhost/api/reservations", { method: "POST", body: JSON.stringify(body) }))).status).toBe(200);
 const checkout = mocks.call.mock.calls.find(([path]) => path === "/checkout");
 expect(JSON.parse(checkout![1].body).billing_address).toMatchObject({ first_name: "Mary Jane", last_name: "de la Cruz" });
});
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

it.each([true, false])("saves the Easy Carve %s selection on the roast order line", async easyCarve => {
 const body = await request("6195551234").json();
 body.items[0].easyCarve = easyCarve;
 const response = await roast(new Request("http://localhost/api/roast-reservations", { method: "POST", body: JSON.stringify(body) }));
 expect(response.status).toBe(200);
 const added = mocks.call.mock.calls.find(([path]) => path === "/cart/add-item");
 expect(JSON.parse(added![1].body).siesels_selection_metadata).toContain(`Easy Carve: ${easyCarve ? "Yes" : "No"}`);
});
