import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

  return NextResponse.json(
    { publishableKey },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}