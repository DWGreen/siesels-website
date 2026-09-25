import { NextResponse } from "next/server";

import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError, callStoreApi } from "@/lib/wooCommerceStoreApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await readStoreApiSession();
    const result = await callStoreApi("/checkout", {
      session,
      method: "POST",
      body: JSON.stringify(body),
    });

    return writeStoreApiSession(NextResponse.json(result.data), result.session);
  } catch (error) {
    if (error instanceof StoreApiError) {
      return NextResponse.json(error.body ?? { message: error.message }, {
        status: error.status,
      });
    }

    console.error("WooCommerce checkout failed:", error);

    return NextResponse.json(
      { message: "Unable to start WooCommerce checkout." },
      { status: 500 }
    );
  }
}