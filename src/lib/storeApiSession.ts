// Reads/writes the WooCommerce Store API session (Cart-Token + Nonce) via httpOnly cookies
// so the browser never sees or manipulates the raw cart token directly.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { StoreApiSession } from "./wooCommerceStoreApi";

const CART_TOKEN_COOKIE = "wc_cart_token";
const CART_NONCE_COOKIE = "wc_cart_nonce";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function readStoreApiSession(): Promise<StoreApiSession> {
  const cookieStore = await cookies();

  return {
    cartToken: cookieStore.get(CART_TOKEN_COOKIE)?.value,
    nonce: cookieStore.get(CART_NONCE_COOKIE)?.value,
  };
}

export function writeStoreApiSession<T extends NextResponse>(
  response: T,
  session: StoreApiSession
): T {
  if (session.cartToken) {
    response.cookies.set(CART_TOKEN_COOKIE, session.cartToken, COOKIE_OPTIONS);
  }

  if (session.nonce) {
    response.cookies.set(CART_NONCE_COOKIE, session.nonce, COOKIE_OPTIONS);
  }

  return response;
}
