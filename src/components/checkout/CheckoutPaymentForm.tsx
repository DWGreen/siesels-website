"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function CheckoutPaymentForm() {
  return (
    <section className="border-t border-neutral-950 pt-8">
      <h2 className="mb-6 text-xl font-black uppercase tracking-[0.25em]">
        Payment
      </h2>

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
        />
      </div>
    </section>
  );
}

export function useCheckoutPaymentMethod() {
  const stripe = useStripe();
  const elements = useElements();

  return async (billingDetails: {
    name: string;
    email: string;
    phone: string;
  }) => {
    if (!stripe || !elements) {
      throw new Error("Payment form is still loading.");
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      throw new Error("Payment form is unavailable.");
    }

    const result = await stripe.createPaymentMethod({
      type: "card",
      card,
      billing_details: billingDetails,
    });

    if (result.error || !result.paymentMethod) {
      throw new Error(result.error?.message ?? "Unable to create payment method.");
    }

    return result.paymentMethod.id;
  };
}
