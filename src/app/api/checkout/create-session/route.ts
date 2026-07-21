import { NextResponse } from "next/server";

import { validateCheckoutRequest } from "@/services/checkout/checkoutValidationService";
import { createStripeCheckoutSession } from "@/services/checkout/stripeCheckoutService";

export const dynamic = "force-dynamic";

function resolveRequestOrigin(request: Request): string | undefined {
  const forwardedHost =
    request.headers.get("x-forwarded-host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") ??
    "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return undefined;
  }
}

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
        validatedCheckout,
        {
          requestOrigin:
            resolveRequestOrigin(request),
        }
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