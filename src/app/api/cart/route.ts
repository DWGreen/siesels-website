import { NextResponse } from "next/server";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError } from "@/lib/wooCommerceStoreApi";
import { getCart } from "@/services/cart/storeCartService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await readStoreApiSession();
    const result = await getCart(session);

    return writeStoreApiSession(NextResponse.json(result.data), result.session);
  } catch (error) {
    if (error instanceof StoreApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error("Failed to fetch WooCommerce cart:", error);

    return NextResponse.json(
      { message: "Unable to fetch cart." },
      { status: 500 }
    );
  }
}
