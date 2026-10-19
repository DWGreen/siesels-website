import { describe, expect, it, vi } from "vitest";
import { getGrade, getRoastSeasoning, getRoastReservationProducts } from "./roastReservations";

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/lib/woocommerce", () => ({ getWooCommerceApi: () => api }));

describe("roast reservation options", () => {
  it("recognizes seasoning and legacy or USDA grade values", () => {
    expect(getGrade({ id: 1, attributes: [{ name: "Grade", option: "Prime" }] })).toBe("USDA Prime");
    expect(getGrade({ id: 1, attributes: [{ name: "Grade", option: "USDA Choice" }] })).toBe("USDA Choice");
    expect(getRoastSeasoning({ id: 1, attributes: [{ name: "Seasoning", option: "Seasoned" }] })).toBe("Seasoned");
    expect(getRoastSeasoning({ id: 1, attributes: [{ name: "Seasoning", option: "Plain" }] })).toBe("Plain");
    expect(getRoastSeasoning({ id: 1 })).toBeNull();
  });

  it("loads both seasonings and sorts Prime before Choice with Plain first", async () => {
    const parent = { id: 10, name: "Rib Roast", categories: [{ id: 41 }], manage_stock: true, stock_quantity: 20 };
    const variations = [
      { id: 11, grade: "USDA Choice", seasoning: "Seasoned" },
      { id: 12, grade: "USDA Prime", seasoning: "Seasoned" },
      { id: 13, grade: "USDA Prime", seasoning: "Plain" },
      { id: 14, grade: "USDA Choice", seasoning: "Plain" },
    ].map(variation => ({
      id: variation.id,
      status: "publish",
      attributes: [{ name: "Grade", option: variation.grade }, { name: "Seasoning", option: variation.seasoning }],
    }));
    api.get.mockImplementation(async (path: string) => ({ data: path.startsWith("products?") ? [parent] : variations }));
    const products = await getRoastReservationProducts();
    expect(products[0].variations.map(variation => [variation.id, variation.grade, variation.seasoning]))
      .toEqual([[13, "USDA Prime", "Plain"], [12, "USDA Prime", "Seasoned"], [14, "USDA Choice", "Plain"], [11, "USDA Choice", "Seasoned"]]);
  });
});