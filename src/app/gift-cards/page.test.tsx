import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GiftCardsPage from "./page";

const { getProductsByCategoryId } = vi.hoisted(() => ({ getProductsByCategoryId: vi.fn() }));

vi.mock("@/services/products", () => ({ getProductsByCategoryId }));
vi.mock("@/components/gift-cards/GiftCardOrderClient", () => ({
  default: ({ products }: { products: Array<{ id: number; price: string }> }) => (
    <ul>{products.map(product => <li key={product.id}>{product.price}</li>)}</ul>
  ),
}));

describe("gift card page", () => {
  it("displays gift cards from lowest to highest numeric price without mutating the source", async () => {
    const products = [
      { id: 1, price: "100.00" },
      { id: 2, price: "25.00" },
      { id: 3, price: "50.00" },
    ];
    getProductsByCategoryId.mockResolvedValue(products);

    render(await GiftCardsPage());

    expect(getProductsByCategoryId).toHaveBeenCalledWith("37");
    expect(screen.getAllByRole("listitem").map(item => item.textContent))
      .toEqual(["25.00", "50.00", "100.00"]);
    expect(products.map(product => product.id)).toEqual([1, 2, 3]);
  });
});