import { NextResponse } from "next/server";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError } from "@/lib/wooCommerceStoreApi";
import { addCartItem } from "@/services/cart/storeCartService";
import { AddCartItemRequest } from "@/types/checkout";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AddCartItemRequest;

    if (!body?.id || !body.quantity || body.quantity < 1) {
      return NextResponse.json(
        { message: "A product id and quantity of at least 1 are required." },
        { status: 400 }
      );
    }

    const session = await readStoreApiSession();
    const result = await addCartItem(session, body);

    return writeStoreApiSession(NextResponse.json(result.data), result.session);
  } catch (error) {
    if (error instanceof StoreApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("Failed to add WooCommerce cart item:", error);

    return NextResponse.json(
      { message: "Unable to add item to cart." },
      { status: 500 }
    );
  }
}
