import { NextResponse } from "next/server";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError } from "@/lib/wooCommerceStoreApi";
import { clearCart } from "@/services/cart/storeCartService";

export const dynamic = "force-dynamic";

export async function DELETE() {
  try {
    const result = await clearCart(await readStoreApiSession());
    return writeStoreApiSession(NextResponse.json(result.data), result.session);
  } catch (error) {
    if (error instanceof StoreApiError) {
      return NextResponse.json(error.body ?? { message: error.message }, {
        status: error.status,
      });
    }

    console.error("Failed to clear WooCommerce cart:", error);
    return NextResponse.json(
      { message: "Unable to clear cart." },
      { status: 500 }
    );
  }
}