import { afterEach, describe, expect, it, vi } from "vitest";
import { getTurkeyReservationProducts, validateTurkeyReservationLines } from "./turkeyReservations";
import { getRoastReservationProducts, validateRoastReservationLines } from "./roastReservations";
import { getHamReservationProducts, validateHamReservationLines } from "./hamReservations";
import { reservationDisplayName, reservationProductMatchesStore } from "@/config/reservationProducts";

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/lib/woocommerce", () => ({ getWooCommerceApi: () => api }));
afterEach(() => vi.unstubAllEnvs());

const variation = { id: 900, status: "publish", manage_stock: true, stock_quantity: 5, stock_status: "instock", attributes: [{ name: "Grade", option: "Prime" }] };
function parents(category: number) {
  return ["Original", "Cut - Siesel's", "Cut - Iowa Meat Farms"].map((name, index) => ({
    id: 700 + index, name, type: "variable", status: "publish", categories: [{ id: category }], manage_stock: true, stock_quantity: 10, stock_status: "instock",
  }));
}

describe("store inventory", () => {
  it.each([
    ["turkey", 40, (store: string) => getTurkeyReservationProducts("turkey", store)],
    ["turkey-breast", 43, (store: string) => getTurkeyReservationProducts("turkey-breast", store)],
    ["roast", 41, getRoastReservationProducts],
    ["ham", 42, getHamReservationProducts],
  ] as const)("loads only selected store's %s parents and strips suffixes", async (_type, category, load) => {
    api.get.mockImplementation(async (path: string) => ({ data: path.startsWith("products?") ? parents(category) : [variation] }));
    expect((await load("siesels-meats")).map(p => [p.id, p.name])).toEqual([[701, "Cut"]]);
    expect((await load("iowa-meat-farms")).map(p => [p.id, p.name])).toEqual([[702, "Cut"]]);
    expect((await load(undefined as unknown as string))).toEqual([]);
    expect(api.get.mock.calls.filter(([path]) => path.startsWith("products?")).every(([path]) => !path.includes("include="))).toBe(true);
  });

  it("validates store ownership and selected store stock on submission", async () => {
    const turkey = { ...parents(40)[1], type: "simple" };
    api.get.mockResolvedValue({ data: turkey });
    expect(await validateTurkeyReservationLines([{ productId: 701, quantity: 2 }], "turkey", "siesels-meats")).toBeNull();
    expect(await validateTurkeyReservationLines([{ productId: 701, quantity: 11 }], "turkey", "siesels-meats")).not.toBeNull();
    expect(await validateTurkeyReservationLines([{ productId: 701, quantity: 1 }], "turkey", "iowa-meat-farms")).not.toBeNull();
    api.get.mockImplementation(async (path: string) => ({ data: path.includes("variations") ? variation : parents(41)[1] }));
    expect(await validateRoastReservationLines([{ productId: 701, variationId: 900, quantity: 1 }], "iowa-meat-farms")).not.toBeNull();
    api.get.mockImplementation(async (path: string) => ({ data: path.startsWith("products?") ? parents(42) : [variation] }));
    const hams = await getHamReservationProducts("iowa-meat-farms");
    expect(validateHamReservationLines(hams, [{ productId: 701, variationId: 900, quantity: 1 }])).not.toBeNull();
  });

  it("recognizes the local ham suffix and preserves internal hyphens", () => {
    expect(reservationProductMatchesStore({ id: 455, name: "Bone In Half Ham - Butt End - Iowa Meat Farm's" }, "iowa-meat-farms")).toBe(true);
    expect(reservationDisplayName("Bone In Half Ham - Butt End - Iowa Meat Farm's")).toBe("Bone In Half Ham - Butt End");
    expect(reservationDisplayName("5 Bone  - Siesel's")).toBe("5 Bone");
  });
});
