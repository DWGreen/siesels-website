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

export async function readStoreApiSession(
  cookiePrefix = "wc_cart"
): Promise<StoreApiSession> {
  const cookieStore = await cookies();

  return {
    cartToken: cookieStore.get(
      cookiePrefix === "wc_cart" ? CART_TOKEN_COOKIE : `${cookiePrefix}_token`
    )?.value,
    nonce: cookieStore.get(
      cookiePrefix === "wc_cart" ? CART_NONCE_COOKIE : `${cookiePrefix}_nonce`
    )?.value,
  };
}

export function writeStoreApiSession<T extends NextResponse>(
  response: T,
  session: StoreApiSession,
  cookiePrefix = "wc_cart"
): T {
  const tokenCookie =
    cookiePrefix === "wc_cart" ? CART_TOKEN_COOKIE : `${cookiePrefix}_token`;
  const nonceCookie =
    cookiePrefix === "wc_cart" ? CART_NONCE_COOKIE : `${cookiePrefix}_nonce`;

  if (session.cartToken) {
    response.cookies.set(tokenCookie, session.cartToken, COOKIE_OPTIONS);
  }

  if (session.nonce) {
    response.cookies.set(nonceCookie, session.nonce, COOKIE_OPTIONS);
  }

  return response;
}
