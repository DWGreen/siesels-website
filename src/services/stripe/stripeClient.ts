import Stripe from "stripe";

let stripe: Stripe | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing.`);
  }

  return value;
}

export function getStripeClient(): Stripe {
  if (stripe) {
    return stripe;
  }

  stripe = new Stripe(getRequiredEnv("STRIPE_SECRET_KEY"));

  return stripe;
}