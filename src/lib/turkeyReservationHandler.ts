import { normalizeReservationPhone, RESERVATION_PHONE_ERROR } from "@/utils/reservationPhone";
import { NextResponse } from "next/server";

import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError, callStoreApi, StoreApiSession } from "@/lib/wooCommerceStoreApi";
import { validateTurkeyReservationLines, type TurkeyReservationType } from "@/services/turkeyReservations";
import { getReservationStoreLocation } from "@/data/storeLocations";
import { getReservationOrderingStatus } from "@/utils/reservationOrdering";
import { isReservationPickupDateAllowed } from "@/utils/reservationOrdering";

export function createTurkeyReservationHandler(type: TurkeyReservationType = "turkey") {
const SESSION_COOKIE_PREFIX = type === "turkey-breast" ? "wc_turkey_breast_reservation" : "wc_turkey_reservation";
const reservationLabel = type === "turkey-breast" ? "Turkey breast" : "Turkey";

type ReservationRequest = {
  pickupDate?: string;
  storeLocationId?: string;
  notes?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: Array<{
    productId?: number;
    variationId?: number;
    quantity?: number;
  }>;
};

function reservationResponse(
  body: unknown,
  status: number,
  session: StoreApiSession
) {
  return writeStoreApiSession(
    NextResponse.json(body, { status }),
    session,
    SESSION_COOKIE_PREFIX
  );
}

return async function POST(request: Request) {
  let session = await readStoreApiSession(SESSION_COOKIE_PREFIX);

  try {
    const ordering = getReservationOrderingStatus(type);
    if (!ordering.isOpen) {
      return reservationResponse({ message: ordering.message }, 403, session);
    }
    const body = (await request.json()) as ReservationRequest;
    const pickupDate = body.pickupDate ?? "";
    const storeLocation = getReservationStoreLocation(body.storeLocationId);
    const customerName = body.customer?.name?.trim() ?? "";
    const email = body.customer?.email?.trim() ?? "";
    const phone = normalizeReservationPhone(body.customer?.phone);
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";
    const items = (body.items ?? [])
      .map(item => ({
        productId: Number(item.productId),
        ...(item.variationId !== undefined ? { variationId: Number(item.variationId) } : {}),
        quantity: Number(item.quantity),
      }))
      .filter(item => item.quantity > 0);

    if (!isReservationPickupDateAllowed(type, pickupDate)) {
      return reservationResponse({ message: "Choose a pickup date within the current reservation window." }, 400, session);
    }

    if (!customerName || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      return reservationResponse(
        { message: "Enter your name and a valid email address." },
        400,
        session
      );
    }

    if (!storeLocation) {
      return reservationResponse({ message: "Choose a valid pickup location." }, 400, session);
    }
    if (phone === null) {
      return reservationResponse({ message: RESERVATION_PHONE_ERROR }, 400, session);
    }
    if (Buffer.byteLength(notes, "utf8") > 2000) {
      return reservationResponse({ message: "Reservation notes must be 500 characters or fewer." }, 400, session);
    }

    if (items.length === 0) {
      return reservationResponse(
        { message: "Select at least one turkey size and quantity." },
        400,
        session
      );
    }

    const validationError = await validateTurkeyReservationLines(items, type);
    if (validationError) {
      return reservationResponse({ message: validationError }, 400, session);
    }

    const currentCart = await callStoreApi("/cart", { session });
    session = currentCart.session;

    const clearedCart = await callStoreApi("/cart/items", {
      session,
      method: "DELETE",
    });
    session = clearedCart.session;

    for (const item of items) {
      const added = await callStoreApi("/cart/add-item", {
        session,
        method: "POST",
        body: JSON.stringify({
          id: item.variationId ?? item.productId,
          quantity: item.quantity,
          siesels_selection_metadata: `Pickup location: ${storeLocation.name} (${storeLocation.id})`,
        }),
      });
      session = added.session;
    }

    const firstName = customerName.split(/\s+/)[0] ?? "";
    const lastName = customerName.split(/\s+/).slice(1).join(" ");
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
        customer_note: `${reservationLabel} reservation. Pickup location: ${storeLocation.name} (${storeLocation.id}). Pickup date: ${pickupDate}. No payment collected online.${notes ? `\nReservation notes:\n${notes}` : ""}`,
      }),
    });
    session = checkout.session;

    const response = reservationResponse(checkout.data, 200, session);

    try {
      const clearResult = await callStoreApi("/cart/items", {
        session,
        method: "DELETE",
      });
      session = clearResult.session;
      return writeStoreApiSession(response, session, SESSION_COOKIE_PREFIX);
    } catch (error) {
      console.error("Turkey reservation order created; cart cleanup failed:", error);
      return response;
    }
  } catch (error) {
    if (error instanceof StoreApiError) {
      return reservationResponse(error.body ?? { message: error.message }, error.status, session);
    }

    console.error("Turkey reservation submission failed:", error);
    return reservationResponse(
      { message: "Unable to submit your turkey reservation. Please try again." },
      500,
      session
    );
  }
};
}
