import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { proxy, config } from "./proxy";

describe("disabled public features", () => {
  it.each([
    "/gift-cards", "/sandwiches", "/sandwiches/build", "/sandwiches/customize", "/sandwiches/checkout", "/sandwiches/checkout/success",
    "/cooking", "/cooking/collections/dinner", "/cooking/my-menu", "/recipes",
    "/api/gift-cards/checkout", "/api/recipes", "/api/recipes/123/ratings",
    "/api/cart", "/api/cart/add", "/api/checkout/create-session",
    "/api/checkout/woocommerce", "/api/stripe/config", "/debug/stripe",
  ])("blocks %s for reads and writes", async path => {
    expect(unstable_doesMiddlewareMatch({ config, url: `https://example.test${path}` })).toBe(true);
    for (const method of ["GET", "POST"]) {
      const response = proxy(new NextRequest(`https://example.test${path}`, { method }));
      expect(response.status).toBe(404);
      expect(response.headers.get("cache-control")).toBe("no-store");
      if (path.startsWith("/api/")) expect(await response.json()).toEqual({ message: "Not found." });
    }
  });
  it.each([
    "/", "/specials", "/holiday-meats", "/contact", "/api/contact",
    "/turkey-reservations", "/ham-reservations", "/roast-reservations", "/turkey-breast-reservations",
    "/api/turkey-reservations", "/api/ham-reservations", "/api/roast-reservations", "/api/turkey-breast-reservations",
    "/order-confirmation?orderType=turkey", "/sandwiches-other", "/images/recipes/pasta.jpg",
  ])("preserves %s", path => {
    expect(unstable_doesMiddlewareMatch({ config, url: `https://example.test${path}` })).toBe(false);
    expect(proxy(new NextRequest(`https://example.test${path}`)).headers.get("x-middleware-next")).toBe("1");
  });
});
