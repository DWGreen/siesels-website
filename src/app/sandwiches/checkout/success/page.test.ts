import { describe, expect, it, vi } from "vitest";
import LegacyCheckoutSuccessPage from "./page";

const redirect = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ redirect }));

describe("legacy confirmation links", () => {
  it("preserves credentials and converts the reservation parameter", async () => {
    await LegacyCheckoutSuccessPage({ searchParams: Promise.resolve({ reservation: "turkey-breast", order_id: "123", order_key: "key&value" }) });
    const url = new URL(redirect.mock.lastCall![0], "http://localhost");
    expect(url.pathname).toBe("/order-confirmation");
    expect(url.searchParams.get("orderType")).toBe("turkey-breast");
    expect(url.searchParams.get("order_key")).toBe("key&value");
    expect(url.searchParams.get("order_id")).toBe("123");
  });

  it("preserves legacy sandwich Stripe links", async () => {
    await LegacyCheckoutSuccessPage({ searchParams: Promise.resolve({ session_id: "cs_test" }) });
    expect(redirect).toHaveBeenLastCalledWith("/order-confirmation?session_id=cs_test&orderType=sandwich");
  });
});
