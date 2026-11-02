// These unfinished features are intentionally unavailable, including their APIs.
// Keep their implementation so they can be restored when ready to launch.
export const sandwichOrderingEnabled = false;

export const disabledRoutePrefixes = [
  "/gift-cards",
  "/sandwiches",
  "/cooking",
  "/recipes",
  "/api/gift-cards",
  "/api/recipes",
  "/api/cart",
  "/api/checkout",
  "/api/stripe",
  "/debug/stripe",
] as const;

export function isDisabledRoute(pathname: string) {
  return disabledRoutePrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
