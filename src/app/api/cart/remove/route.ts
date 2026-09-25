import { NextResponse } from "next/server";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError } from "@/lib/wooCommerceStoreApi";
import { removeCartItem } from "@/services/cart/storeCartService";
import { RemoveCartItemRequest } from "@/types/checkout";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RemoveCartItemRequest;

    if (!body?.key) {
      return NextResponse.json(
        { message: "A cart item key is required." },
        { status: 400 }
      );
    }

    const session = await readStoreApiSession();
    const result = await removeCartItem(session, body);

    return writeStoreApiSession(NextResponse.json(result.data), result.session);
  } catch (error) {
    if (error instanceof StoreApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("Failed to remove WooCommerce cart item:", error);

    return NextResponse.json(
      { message: "Unable to remove cart item." },
      { status: 500 }
    );
  }
}
