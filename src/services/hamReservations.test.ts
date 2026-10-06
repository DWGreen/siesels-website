import { describe, expect, it, vi } from "vitest";
import { getHamReservationProducts, mapHamVariation, validateHamReservationLines } from "./hamReservations";

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/lib/woocommerce", () => ({ getWooCommerceApi: () => api }));
const parent = { id: 210, name: "Whole Ham", type: "variable", status: "publish", manage_stock: true, stock_quantity: 10, categories: [{ id: 42 }] };
const plain = { id: 211, status: "publish", attributes: [{ name: "Preparation", option: "Plain" }] };
const product = { id: parent.id, name: parent.name, variations: [mapHamVariation(parent, plain)!, mapHamVariation(parent, { ...plain, id: 212, attributes: [{ name: "Preparation", option: "Smoked" }] })!] };
const line = { productId: 210, variationId: 211, quantity: 1 };

describe("dynamic ham reservations", () => {
  it("maps arbitrary attribute names and values without a size enum", () => {
    expect(mapHamVariation(parent, { ...plain, attributes: [{ name: "Glaze", option: "Honey" }] })?.attributes)
      .toEqual([{ attribute: "Glaze", value: "Honey" }]);
  });
  it("preserves global attribute identifiers", () => {
    expect(mapHamVariation(parent, { ...plain, attributes: [{ name: "Preparation", slug: "pa_preparation", option: "Plain" }] })?.attributes[0].attribute).toBe("pa_preparation");
  });
  it("rejects unpublished and ambiguous wildcard variations", () => {
    expect(mapHamVariation(parent, { ...plain, status: "draft" })).toBeNull();
    expect(mapHamVariation(parent, { ...plain, attributes: [{ name: "Preparation", option: "" }] })).toBeNull();
  });
  it("shares parent stock between preparations, not between products", () => {
    expect(validateHamReservationLines([product], [{ ...line, quantity: 6 }, { ...line, variationId: 212, quantity: 6 }])).not.toBeNull();
    const half = { ...product, id: 220, name: "Half Ham", variations: [mapHamVariation({ ...parent, id: 220 }, { ...plain, id: 221 })!] };
    expect(validateHamReservationLines([product, half], [{ ...line, quantity: 10 }, { productId: 220, variationId: 221, quantity: 10 }])).toBeNull();
  });
  it("enforces variation stock and rejects mismatched or duplicate lines", () => {
    const limited = { ...product, variations: [mapHamVariation(parent, { ...plain, manage_stock: true, stock_quantity: 2 })!] };
    expect(validateHamReservationLines([limited], [{ ...line, quantity: 2 }])).toBeNull();
    expect(validateHamReservationLines([limited], [{ ...line, quantity: 3 }])).not.toBeNull();
    expect(validateHamReservationLines([product], [{ ...line, productId: 999 }])).not.toBeNull();
    expect(validateHamReservationLines([product], [line, line])).not.toBeNull();
  });
  it("loads category products with only their actual variation options", async () => {
    api.get.mockImplementation(async (path: string) => ({ data: path.startsWith("products?") ? [parent, { ...parent, id: 220, name: "Half Ham" }] : path.includes("/220/") ? [{ ...plain, id: 221 }] : [plain] }));
    const products = await getHamReservationProducts();
    expect(products.map(entry => entry.name)).toEqual(["Whole Ham", "Half Ham"]);
    expect(products[1].variations.map(entry => entry.attributes[0].value)).toEqual(["Plain"]);
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("products?category=42"));
  });
});