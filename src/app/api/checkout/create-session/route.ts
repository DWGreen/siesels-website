import { NextResponse } from "next/server";

import { validateCheckoutRequest } from "@/services/checkout/checkoutValidationService";
import { createStripeCheckoutSession } from "@/services/checkout/stripeCheckoutService";

export async function POST(request: Request) {
  try {
    const body =
      await request.json();

    const validatedCheckout =
      await validateCheckoutRequest(body);

    if (!validatedCheckout.isValid) {
      return NextResponse.json(
        validatedCheckout,
        {
          status: 400,
        }
      );
    }

    const session =
      await createStripeCheckoutSession(
        validatedCheckout
      );

    if (!session.url) {
      return NextResponse.json(
        {
          message:
            "Stripe checkout session was created, but no checkout URL was returned.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "Failed to create Stripe checkout session:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session.",
      },
      {
        status: 500,
      }
    );
  }
}