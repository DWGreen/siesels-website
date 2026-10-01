import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export function getRuntimeStripePromise(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = fetch("/api/stripe/config", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) {
          throw new Error("Could not load Stripe configuration.");
        }

        return response.json() as Promise<{ publishableKey?: string }>;
      })
      .then(({ publishableKey }) => {
        if (!publishableKey?.startsWith("pk_")) {
          throw new Error("Stripe publishable key is missing or invalid.");
        }

        return loadStripe(publishableKey);
      });
  }

  return stripePromise;
}