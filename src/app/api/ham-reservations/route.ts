import { NextResponse } from "next/server";
import { getReservationStoreLocation } from "@/data/storeLocations";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { callStoreApi, StoreApiError, StoreApiSession } from "@/lib/wooCommerceStoreApi";
import { getHamReservationProducts, validateHamReservationLines } from "@/services/hamReservations";
import { getReservationOrderingStatus } from "@/utils/reservationOrdering";

export const dynamic = "force-dynamic";
const SESSION_COOKIE_PREFIX = "wc_ham_reservation";

function respond(body: unknown, status: number, session: StoreApiSession) {
  return writeStoreApiSession(NextResponse.json(body, { status }), session, SESSION_COOKIE_PREFIX);
}

export async function POST(request: Request) {
  let session = await readStoreApiSession(SESSION_COOKIE_PREFIX);
  try {
    const ordering = getReservationOrderingStatus("ham");
    if (!ordering.isOpen) return respond({ message: ordering.message }, 403, session);
    const body = await request.json();
    const pickupDate = typeof body.pickupDate === "string" ? body.pickupDate : "";
    const store = getReservationStoreLocation(body.storeLocationId);
    const name = typeof body.customer?.name === "string" ? body.customer.name.trim() : "";
    const email = typeof body.customer?.email === "string" ? body.customer.email.trim() : "";
    const phone = typeof body.customer?.phone === "string" ? body.customer.phone.trim() : "";
    const items: Array<{ productId: number; variationId: number; quantity: number }> = Array.isArray(body.items) ? body.items : [];
    const parsed = new Date(`${pickupDate}T00:00:00Z`);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== pickupDate || pickupDate < today) {
      return respond({ message: "Choose a valid pickup date today or later." }, 400, session);
    }
    if (!store || !name || !/^\S+@\S+\.\S+$/.test(email)) {
      return respond({ message: "Choose a pickup location and enter your name and a valid email address." }, 400, session);
    }
    if (!items.length || items.length > 100 || items.some(item => !item || !Number.isInteger(item.productId) || !Number.isInteger(item.variationId) || !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return respond({ message: "Choose valid ham options and quantities." }, 400, session);
    }
    const products = await getHamReservationProducts();
    const validationError = validateHamReservationLines(products, items);
    if (validationError) return respond({ message: validationError }, 400, session);

    const initial = await callStoreApi("/cart", { session });
    session = initial.session;
    const cleared = await callStoreApi("/cart/items", { session, method: "DELETE" });
    session = cleared.session;
    for (const item of items) {
      const added = await callStoreApi("/cart/add-item", {
        session,
        method: "POST",
        body: JSON.stringify({
          id: item.variationId,
          quantity: item.quantity,
          siesels_selection_metadata: `Pickup location: ${store.name} (${store.id})`,
        }),
      });
      session = added.session;
    }
    const [firstName, ...lastName] = name.split(/\s+/);
    const checkout = await callStoreApi<Record<string, unknown>>("/checkout", {
      session,
      method: "POST",
      body: JSON.stringify({
        billing_address: {
          first_name: firstName, last_name: lastName.join(" "), company: "",
          address_1: "", address_2: "", city: "", state: "", postcode: "",
          email, phone, country: "US",
        },
        customer_note: `Holiday ham reservation. Pickup location: ${store.name} (${store.id}). Pickup date: ${pickupDate}. No payment collected online.`,
      }),
    });
    session = checkout.session;
    const response = respond(checkout.data, 200, session);
    try {
      const emptied = await callStoreApi("/cart/items", { session, method: "DELETE" });
      return writeStoreApiSession(response, emptied.session, SESSION_COOKIE_PREFIX);
    } catch (error) {
      console.error("Ham reservation created; cart cleanup failed:", error);
      return response;
    }
  } catch (error) {
    if (error instanceof StoreApiError) return respond(error.body ?? { message: error.message }, error.status, session);
    console.error("Ham reservation failed:", error);
    return respond({ message: "Unable to submit ham reservation. Please try again." }, 500, session);
  }
}