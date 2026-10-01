"use client";

import { useEffect, useState } from "react";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type CheckState = "checking" | "pass" | "fail" | "missing";

function CheckRow({ label, state, detail }: { label: string; state: CheckState; detail: string }) {
  const stateLabel = {
    checking: "Checking",
    pass: "Ready",
    fail: "Failed",
    missing: "Missing",
  }[state];

  return (
    <li className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#d8cec0] py-3 last:border-0">
      <span className="font-heading text-sm font-bold uppercase tracking-[0.08em]">{label}</span>
      <span className={`font-heading text-xs font-bold uppercase tracking-[0.12em] ${state === "pass" ? "text-green-800" : state === "fail" || state === "missing" ? "text-red-800" : "text-neutral-600"}`}>
        {stateLabel}: {detail}
      </span>
    </li>
  );
}

function StripeCardProbe({ onReady, onError }: { onReady: () => void; onError: (message: string | null) => void }) {
  return (
    <div className="border border-neutral-950 bg-white p-4">
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              color: "#171717",
              fontSize: "16px",
              fontFamily: "inherit",
              "::placeholder": { color: "#737373" },
            },
          },
        }}
        onReady={onReady}
        onChange={event => onError(event.error?.message ?? null)}
      />
    </div>
  );
}

export default function StripeDebugPage() {
  const [stripeState, setStripeState] = useState<CheckState>(publishableKey ? "checking" : "missing");
  const [elementState, setElementState] = useState<CheckState>(publishableKey ? "checking" : "missing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripePromise) return;

    let active = true;
    stripePromise.then(stripe => {
      if (active) setStripeState(stripe ? "pass" : "fail");
    }).catch(loadError => {
      if (!active) return;
      setStripeState("fail");
      setError(loadError instanceof Error ? loadError.message : "Stripe.js could not initialize.");
    });

    return () => {
      active = false;
    };
  }, []);

  const keyMode = publishableKey.startsWith("pk_test_")
    ? "Test mode"
    : publishableKey.startsWith("pk_live_")
      ? "Live mode"
      : publishableKey
        ? "Unrecognized key format"
        : "No key in this frontend build";

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-neutral-950 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[#9d321e]">Troubleshooting</p>
        <h1 className="mt-2 font-heading text-3xl font-bold uppercase">Stripe Form Check</h1>
        <p className="mt-3 font-serif text-sm leading-6 text-neutral-700">
          This checks the publishable key compiled into this frontend and whether Stripe can render its card field. It does not submit a payment or expose the key value.
        </p>

        <section className="mt-7 border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-6">
          <ul aria-live="polite">
            <CheckRow label="Publishable key" state={publishableKey.startsWith("pk_") ? "pass" : publishableKey ? "fail" : "missing"} detail={keyMode} />
            <CheckRow label="Stripe.js connection" state={stripeState} detail={stripeState === "pass" ? "Initialized" : stripeState === "checking" ? "Loading Stripe" : stripeState === "missing" ? "Key unavailable at build time" : "Could not initialize"} />
            <CheckRow label="Card field iframe" state={elementState} detail={elementState === "pass" ? "Mounted and ready" : elementState === "checking" ? "Waiting for Stripe" : elementState === "missing" ? "Not attempted" : "Could not mount"} />
          </ul>

          {stripePromise && stripeState === "pass" && (
            <div className="mt-6">
              <p className="mb-2 font-heading text-xs font-bold uppercase tracking-[0.14em]">Non-payment card field probe</p>
              <Elements stripe={stripePromise}>
                <StripeCardProbe
                  onReady={() => setElementState("pass")}
                  onError={message => {
                    setError(message);
                    if (message) setElementState("fail");
                  }}
                />
              </Elements>
            </div>
          )}

          {error && <p role="alert" className="mt-4 border border-red-700 bg-red-50 p-3 font-serif text-sm text-red-900">{error}</p>}
        </section>

        <p className="mt-5 font-serif text-xs leading-5 text-neutral-600">
          A ready card field confirms the frontend key can initialize Stripe Elements. WooCommerce gateway credentials and payment submission are separate checks.
        </p>
      </div>
    </main>
  );
}