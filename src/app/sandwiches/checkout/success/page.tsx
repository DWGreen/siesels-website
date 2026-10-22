import { redirect } from "next/navigation";

// Preserve confirmation links issued before the shared confirmation page.
export default async function LegacyCheckoutSuccessPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["order_id", "order_key", "session_id"]) {
    if (typeof params[key] === "string") query.set(key, params[key]);
  }
  const type = params.orderType ?? params.reservation;
  query.set("orderType", typeof type === "string" ? type : "sandwich");
  redirect(`/order-confirmation?${query.toString()}`);
}
