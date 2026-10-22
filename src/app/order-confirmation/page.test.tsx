import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OrderConfirmationPage from "./page";
import { orderConfirmationConfig } from "@/data/orderConfirmation";

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("@/lib/woocommerce", () => ({ getWooCommerceApi: () => api }));
vi.mock("@/components/layout/Header", () => ({ default: () => <header /> }));
vi.mock("@/components/layout/Footer", () => ({ default: () => <footer /> }));
vi.mock("@/components/sections/InteriorHero", () => ({ default: ({ title, backgroundImage }: { title: string; backgroundImage: string }) => <h1 data-image={backgroundImage}>{title}</h1> }));

const order = {
  id: 123, number: "123", order_key: "valid-key", status: "processing", currency: "USD", total_tax: "1.00", total: "21.00",
  customer_note: "Turkey breast reservation. Pickup location: Iowa Meat Farms (iowa-meat-farms). Pickup date: 2026-11-20. No payment collected online.",
  line_items: [{ name: "Boneless Turkey Breast", quantity: 2, subtotal: "20.00", total: "20.00", meta_data: [
    { key: "Weight", value: "3-4 lb" }, { key: "_internal", value: "Hidden value" },
  ] }],
};
beforeEach(() => { vi.clearAllMocks(); api.get.mockResolvedValue({ data: order }); });
afterEach(cleanup);

async function show(orderType: string, orderKey = "valid-key") {
  render(await OrderConfirmationPage({ searchParams: Promise.resolve({ orderType, order_id: "123", order_key: orderKey }) }));
}

describe("shared order confirmation", () => {
  it.each(["turkey", "turkey-breast", "roast", "ham"] as const)("uses %s presentation and reservation details", async type => {
    await show(type);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("data-image", orderConfirmationConfig[type].heroImage);
    expect(screen.getByRole("heading", { name: orderConfirmationConfig[type].heading })).toBeInTheDocument();
    expect(screen.getByText("Pickup date: 2026-11-20")).toBeInTheDocument();
    expect(screen.getByText("Pickup location: Iowa Meat Farms")).toBeInTheDocument();
    expect(screen.getByText("Weight: 3-4 lb")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText(/Payment is handled at pickup/)).toBeInTheDocument();
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
    expect(screen.queryByText("Hidden value")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: orderConfirmationConfig[type].returnLabel })).toHaveAttribute("href", orderConfirmationConfig[type].returnHref);
  });

  it.each(["sandwich", "gift-card"] as const)("preserves the %s receipt and return link", async type => {
    await show(type);
    expect(screen.getByText("Receipt")).toBeInTheDocument();
    expect(screen.getByText("USD 21.00")).toBeInTheDocument();
    expect(screen.getByText("USD 20.00")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: orderConfirmationConfig[type].returnLabel })).toHaveAttribute("href", orderConfirmationConfig[type].returnHref);
    expect(screen.queryByText(/Payment is handled at pickup/)).not.toBeInTheDocument();
  });

  it("does not expose order details or claim success with an invalid key", async () => {
    await show("turkey-breast", "wrong-key");
    expect(screen.getByText(/couldn’t load your order details/)).toBeInTheDocument();
    expect(screen.queryByText("Boneless Turkey Breast")).not.toBeInTheDocument();
    expect(screen.queryByText(/Pickup date:/)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Reservation Received/ })).not.toBeInTheDocument();
  });

  it("handles unknown order types with the default presentation", async () => {
    await show("__proto__");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Sandwiches");
  });

  it("does not fetch an order without credentials", async () => {
    render(await OrderConfirmationPage({ searchParams: Promise.resolve({ orderType: "ham" }) }));
    expect(api.get).not.toHaveBeenCalled();
    expect(screen.getByText(/couldn’t load your order details/)).toBeInTheDocument();
  });
});
