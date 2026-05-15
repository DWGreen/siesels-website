export function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}

export function formatCurrencyFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}