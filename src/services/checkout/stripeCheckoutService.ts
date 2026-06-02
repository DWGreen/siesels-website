import { getStripeClient } from "@/services/stripe/stripeClient";

import {
  CheckoutValidationResponse,
  ValidatedCheckoutItem,
} from "@/types/cart";

function buildItemDescription(
  item: ValidatedCheckoutItem
): string {
  const modifierNames =
    item.modifiers.map(
      modifier => modifier.name
    );

  const ingredientNames =
    item.ingredients.map(
      ingredient => ingredient.name
    );

  const parts = [
    ...modifierNames,
    ...ingredientNames,
  ];

  if (parts.length === 0) {
    return "";
  }

  return parts.join(", ");
}

export async function createStripeCheckoutSession(
  checkout: CheckoutValidationResponse
) {
  const stripe = getStripeClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const itemLineItems =
    checkout.items.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitPriceCents,
        product_data: {
          name: item.name,
          description:
            buildItemDescription(item) ||
            undefined,
        },
      },
    }));

  const taxLineItem =
    checkout.taxCents > 0
      ? [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: checkout.taxCents,
              product_data: {
                name: "Sales Tax",
              },
            },
          },
        ]
      : [];

  return stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      ...itemLineItems,
      ...taxLineItem,
    ],

    success_url:
      `${siteUrl}/sandwiches/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url:
      `${siteUrl}/sandwiches/checkout`,

    metadata: {
      subtotalCents:
        String(checkout.subtotalCents),
      taxCents:
        String(checkout.taxCents),
      totalCents:
        String(checkout.totalCents),
    },
  });
}