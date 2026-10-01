import { NextResponse } from "next/server";

import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError, callStoreApi, StoreApiSession } from "@/lib/wooCommerceStoreApi";
import { validateTurkeyReservationLines } from "@/services/turkeyReservations";

const SESSION_COOKIE_PREFIX = "wc_turkey_reservation";

type ReservationRequest = {
  pickupDate?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: Array<{
    productId?: number;
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

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let session = await readStoreApiSession(SESSION_COOKIE_PREFIX);

  try {
    const body = (await request.json()) as ReservationRequest;
    const pickupDate = body.pickupDate ?? "";
    const customerName = body.customer?.name?.trim() ?? "";
    const email = body.customer?.email?.trim() ?? "";
    const phone = body.customer?.phone?.trim() ?? "";
    const items = (body.items ?? [])
      .map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      }))
      .filter(item => item.quantity > 0);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
      return reservationResponse({ message: "Choose a valid pickup date." }, 400, session);
    }

    const [year, month, day] = pickupDate.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));
    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() !== month - 1 ||
      parsedDate.getUTCDate() !== day ||
      parsedDate.getTime() < Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate()
      )
    ) {
      return reservationResponse({ message: "Pickup date must be today or later." }, 400, session);
    }

    if (!customerName || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      return reservationResponse(
        { message: "Enter your name and a valid email address." },
        400,
        session
      );
    }

    if (items.length === 0) {
      return reservationResponse(
        { message: "Select at least one turkey size and quantity." },
        400,
        session
      );
    }

    const validationError = await validateTurkeyReservationLines(items);
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
        body: JSON.stringify({ id: item.productId, quantity: item.quantity }),
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
        customer_note: `Turkey reservation. Pickup date: ${pickupDate}. No payment collected online.`,
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
}