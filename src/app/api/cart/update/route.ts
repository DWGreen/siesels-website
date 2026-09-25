import { NextResponse } from "next/server";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError } from "@/lib/wooCommerceStoreApi";
import { updateCartItem } from "@/services/cart/storeCartService";
import { UpdateCartItemRequest } from "@/types/checkout";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as UpdateCartItemRequest;

    if (!body?.key || body.quantity < 0) {
      return NextResponse.json(
        { message: "A cart item key and non-negative quantity are required." },
        { status: 400 }
      );
    }

    const session = await readStoreApiSession();
    const result = await updateCartItem(session, body);

    return writeStoreApiSession(NextResponse.json(result.data), result.session);
  } catch (error) {
    if (error instanceof StoreApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("Failed to update WooCommerce cart item:", error);

    return NextResponse.json(
      { message: "Unable to update cart item." },
      { status: 500 }
    );
  }
}
