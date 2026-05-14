import { NextResponse } from "next/server";
import { validateCheckoutRequest } from "@/services/checkout/checkoutValidationService";
import { CheckoutValidationRequest } from "@/types/cart";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutValidationRequest;

    const result = await validateCheckoutRequest(body);

    if (!result.isValid) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout validation failed:", error);

    return NextResponse.json(
      {
        isValid: false,
        items: [],
        subtotal: 0,
        total: 0,
        errors: [
          {
            message: "Unable to validate checkout request.",
          },
        ],
      },
      { status: 500 }
    );
  }
}