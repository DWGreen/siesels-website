import { NextRequest, NextResponse } from "next/server";
import { isDisabledRoute } from "@/config/disabledFeatures";

export function proxy(request: NextRequest) {
  if (!isDisabledRoute(request.nextUrl.pathname)) return NextResponse.next();

  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Not found." }, { status: 404, headers });
  }
  return new NextResponse("Not found.", { status: 404, headers });
}

export const config = {
  matcher: [
    "/gift-cards/:path*",
    "/sandwiches/:path*",
    "/cooking/:path*",
    "/recipes/:path*",
    "/api/gift-cards/:path*",
    "/api/recipes/:path*",
    "/api/cart/:path*",
    "/api/checkout/:path*",
    "/api/stripe/:path*",
    "/debug/stripe/:path*",
  ],
};
