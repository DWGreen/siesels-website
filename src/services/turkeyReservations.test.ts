import { describe, expect, it, vi } from "vitest";
import { getTurkeyReservationProducts, validateTurkeyReservationLines } from "./turkeyReservations";

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/lib/woocommerce", () => ({ getWooCommerceApi: () => api }));

const breast = {
  id: 430,
  name: "Turkey Breast 6-8 lb",
  status: "publish",
  manage_stock: true,
  stock_quantity: 10,
  stock_status: "instock",
  categories: [{ id: 43, slug: "turkey-breast-reservations" }],
};

describe("turkey reservation categories", () => {
  it("loads breast products from category 43 and excludes whole turkey products", async () => {
    api.get.mockResolvedValue({ data: [breast, { ...breast, id: 400, categories: [{ id: 40, slug: "turkey-reservations" }] }] });
    expect((await getTurkeyReservationProducts("turkey-breast")).map(product => product.id)).toEqual([430]);
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("category=43&"));
  });

  it("validates category and stock separately for each reservation type", async () => {
    api.get.mockResolvedValue({ data: breast });
    const lines = [{ productId: 430, quantity: 2 }];
    expect(await validateTurkeyReservationLines(lines, "turkey-breast")).toBeNull();
    expect(await validateTurkeyReservationLines(lines, "turkey")).not.toBeNull();
    expect(await validateTurkeyReservationLines([{ ...lines[0], quantity: 11 }], "turkey-breast")).not.toBeNull();
  });

  it("keeps whole turkey loading on category 40 by default", async () => {
    api.get.mockResolvedValue({ data: [] });
    await getTurkeyReservationProducts();
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining("category=40&"));
  });
});
const variableBreast = { ...breast, type: "variable", attributes: [{ name: "Weight", variation: true, options: ["3-4 lb", "4-6 lb"] }] };
const weight = { id: 431, status: "publish", manage_stock: true, stock_quantity: 3, stock_status: "instock", attributes: [{ name: "Weight", option: "3-4 lb" }] };

describe("turkey breast weight variations", () => {
  it("loads published weight variations with their own inventory", async () => {
    api.get.mockImplementation(async (path: string) => ({ data: path.includes("/variations") ? [weight, { ...weight, id: 432, status: "private" }] : [variableBreast] }));
    const products = await getTurkeyReservationProducts("turkey-breast");
    expect(products[0].variations).toEqual([expect.objectContaining({ id: 431, stockQuantity: 3 })]);
  });

  it("requires a valid published weight and enforces its stock limit", async () => {
    api.get.mockImplementation(async (path: string) => ({ data: path.includes("/variations/") ? weight : variableBreast }));
    expect(await validateTurkeyReservationLines([{ productId: 430, quantity: 1 }], "turkey-breast")).not.toBeNull();
    expect(await validateTurkeyReservationLines([{ productId: 430, variationId: 431, quantity: 3 }], "turkey-breast")).toBeNull();
    expect(await validateTurkeyReservationLines([{ productId: 430, variationId: 431, quantity: 4 }], "turkey-breast")).not.toBeNull();
  });

  it("enforces combined parent stock across weights", async () => {
    api.get.mockImplementation(async (path: string) => ({ data: path.includes("/variations/") ? { ...weight, manage_stock: false } : variableBreast }));
    expect(await validateTurkeyReservationLines([{ productId: 430, variationId: 431, quantity: 6 }, { productId: 430, variationId: 432, quantity: 5 }], "turkey-breast")).toContain("combined quantity");
  });
});
