// These unfinished features are intentionally unavailable, including their APIs.
// Keep their implementation so they can be restored when ready to launch.
// Temporarily expose the sandwich pages for client review; ordering APIs stay disabled.
export const sandwichOrderingEnabled = false;

export const disabledRoutePrefixes = [
  "/gift-cards",
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
