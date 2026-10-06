import { NextResponse } from "next/server";
import { getWooCommerceApi } from "@/lib/woocommerce";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError, callStoreApi, StoreApiSession } from "@/lib/wooCommerceStoreApi";
import { getReservationStoreLocation } from "@/data/storeLocations";
import { getReservationOrderingStatus } from "@/utils/reservationOrdering";

const SESSION_COOKIE_PREFIX = "wc_roast_reservation";
const ROAST_CATEGORY_ID = 41;

type RoastLineRequest = { productId: number; variationId: number; grade: string; quantity: number };
type RequestBody = {
  pickupDate?: string;
  storeLocationId?: string;
  customer?: { name?: string; email?: string; phone?: string };
  items?: RoastLineRequest[];
};

function respond(body: unknown, status: number, session: StoreApiSession) {
  return writeStoreApiSession(NextResponse.json(body, { status }), session, SESSION_COOKIE_PREFIX);
}

async function validateLines(lines: RoastLineRequest[]): Promise<string | null> {
  const api = getWooCommerceApi();

  for (const line of lines) {
    if (!Number.isInteger(line.productId) || !Number.isInteger(line.variationId) || !Number.isInteger(line.quantity) || line.quantity < 1 || !["Prime", "Choice"].includes(line.grade)) {
      return "Choose a valid roast cut, grade, and quantity.";
    }

    try {
      const [parentResponse, variationResponse] = await Promise.all([
        api.get(`products/${line.productId}`),
        api.get(`products/${line.productId}/variations/${line.variationId}`),
      ]);
      const parent = parentResponse.data;
      const variation = variationResponse.data;
      const categoryMatch = parent.categories?.some((category: { id: number }) => category.id === ROAST_CATEGORY_ID);
      const variationGrade = variation.attributes?.find((attribute: { name: string }) => attribute.name.trim().toLowerCase() === "grade")?.option;

      if (parent.status !== "publish" || parent.type !== "variable" || !categoryMatch || variation.status !== "publish" || variationGrade !== line.grade) {
        return "One of the selected roast options is no longer available.";
      }
      const stockManaged = variation.manage_stock === true || parent.manage_stock === true;
      const stockQuantity = variation.manage_stock === true
        ? variation.stock_quantity
        : parent.stock_quantity;
      const inStock = variation.stock_status !== "outofstock" && parent.stock_status !== "outofstock";
      if (!stockManaged || !inStock) {
        return `${parent.name} (${line.grade}) is not available for reservation yet.`;
      }
      if (typeof stockQuantity === "number" && line.quantity > stockQuantity) {
        return `The requested quantity for ${parent.name} (${line.grade}) exceeds the amount available.`;
      }
    } catch {
      return "Unable to verify roast availability. Please try again.";
    }
  }

  return null;
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let session = await readStoreApiSession(SESSION_COOKIE_PREFIX);

  try {
    const ordering = getReservationOrderingStatus("roast");
    if (!ordering.isOpen) {
      return respond({ message: ordering.message }, 403, session);
    }
    const body = (await request.json()) as RequestBody;
    const pickupDate = body.pickupDate ?? "";
    const storeLocation = getReservationStoreLocation(body.storeLocationId);
    const name = body.customer?.name?.trim() ?? "";
    const email = body.customer?.email?.trim() ?? "";
    const phone = body.customer?.phone?.trim() ?? "";
    const items = body.items ?? [];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
      return respond({ message: "Choose a valid pickup date." }, 400, session);
    }
    const [year, month, day] = pickupDate.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    const today = new Date();
    const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day || parsed.getTime() < todayUtc) {
      return respond({ message: "Pickup date must be today or later." }, 400, session);
    }
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      return respond({ message: "Enter your name and a valid email address." }, 400, session);
    }
    if (!storeLocation) {
      return respond({ message: "Choose a valid pickup location." }, 400, session);
    }
    if (!items.length) {
      return respond({ message: "Add at least one roast to your reservation." }, 400, session);
    }

    const validationError = await validateLines(items);
    if (validationError) return respond({ message: validationError }, 400, session);

    await callStoreApi("/cart", { session }).then(result => { session = result.session; });
    const clearResult = await callStoreApi("/cart/items", { session, method: "DELETE" });
    session = clearResult.session;

    for (const item of items) {
      const addResult = await callStoreApi("/cart/add-item", {
        session,
        method: "POST",
        body: JSON.stringify({
          id: item.productId,
          quantity: item.quantity,
          variation: [{ attribute: "Grade", value: item.grade }],
          siesels_selection_metadata: `Pickup location: ${storeLocation.name} (${storeLocation.id})`,
        }),
      });
      session = addResult.session;
    }

    const nameParts = name.split(/\s+/);
    const firstName = nameParts.shift() ?? "";
    const lastName = nameParts.join(" ");
    const checkout = await callStoreApi<Record<string, unknown>>("/checkout", {
      session,
      method: "POST",
      body: JSON.stringify({
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          email,
          phone,
          country: "US",
        },
        customer_note: `Standing rib roast reservation. Pickup location: ${storeLocation.name} (${storeLocation.id}). Pickup date: ${pickupDate}. No payment collected online.`,
      }),
    });
    session = checkout.session;

    const response = respond(checkout.data, 200, session);
    try {
      const emptied = await callStoreApi("/cart/items", { session, method: "DELETE" });
      return writeStoreApiSession(response, emptied.session, SESSION_COOKIE_PREFIX);
    } catch (error) {
      console.error("Roast reservation created; cart cleanup failed:", error);
      return response;
    }
  } catch (error) {
    if (error instanceof StoreApiError) return respond(error.body ?? { message: error.message }, error.status, session);
    console.error("Roast reservation submission failed:", error);
    return respond({ message: "Unable to submit roast reservation. Please try again." }, 500, session);
  }
}
