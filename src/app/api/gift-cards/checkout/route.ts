import { NextResponse } from "next/server";
import { getWooCommerceApi } from "@/lib/woocommerce";
import { readStoreApiSession, writeStoreApiSession } from "@/lib/storeApiSession";
import { StoreApiError, callStoreApi, StoreApiSession } from "@/lib/wooCommerceStoreApi";
import { MAX_GIFT_CARD_QUANTITY } from "@/config/giftCards";

const SESSION_COOKIE_PREFIX = "wc_gift_card";
const GIFT_CARD_CATEGORY_ID = 37;

type GiftCardRequest = {
  items?: Array<{ productId?: number; quantity?: number }>;
  recipientName?: string;
  recipientEmail?: string;
  fromName?: string;
  giftNote?: string;
  paymentMethodId?: string;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address1?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
};

function respond(body: unknown, status: number, session: StoreApiSession) {
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
    const body = (await request.json()) as GiftCardRequest;
    const items = (body.items ?? []).map(item => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }));
    const quantityByProduct = new Map<number, number>();
    for (const item of items) {
      quantityByProduct.set(
        item.productId,
        (quantityByProduct.get(item.productId) ?? 0) + item.quantity
      );
    }
    const recipientName = body.recipientName?.trim() ?? "";
    const recipientEmail = body.recipientEmail?.trim() ?? "";
    const fromName = body.fromName?.trim() ?? "";
    const giftNote = body.giftNote?.trim() ?? "";
    const customer = body.customer ?? {};
    const customerName = customer.fullName?.trim() ?? "";
    const customerEmail = customer.email?.trim() ?? "";
    const paymentMethodId = body.paymentMethodId ?? "";

    if (items.length === 0 || items.length > 20 || items.some(item => !Number.isInteger(item.productId) || !Number.isInteger(item.quantity) || item.quantity < 1) || [...quantityByProduct.values()].some(quantity => quantity > MAX_GIFT_CARD_QUANTITY) || !recipientName || !fromName || !/^\S+@\S+\.\S+$/.test(recipientEmail) || recipientEmail.length > 254 || recipientName.length > 100 || fromName.length > 100 || giftNote.length > 200) {
      return respond({ message: "Enter valid recipient details and a gift note of 200 characters or fewer." }, 400, session);
    }

    if (!customerName || !/^\S+@\S+\.\S+$/.test(customerEmail) || !customer.phone?.trim() || !customer.address1?.trim() || !customer.city?.trim() || !customer.state?.trim() || !customer.postcode?.trim()) {
      return respond({ message: "Complete the purchaser contact and billing address fields." }, 400, session);
    }

    if (!paymentMethodId.startsWith("pm_")) {
      return respond({ message: "Enter valid card details before placing your order." }, 400, session);
    }

    const api = getWooCommerceApi();
    const products = await Promise.all(items.map(async item => {
      const productResponse = await api.get(`products/${item.productId}`);
      return productResponse.data;
    }));
    const invalidProduct = products.some(product =>
      product.status !== "publish" || !product.categories?.some(
        (category: { id: number; slug?: string }) => category.id === GIFT_CARD_CATEGORY_ID || category.slug === "gift-cards"
      )
    );
    if (invalidProduct) {
      return respond({ message: "That gift card is no longer available." }, 400, session);
    }

    const metadata = [
      `Recipient: ${recipientName}`,
      `Recipient email: ${recipientEmail}`,
      `From: ${fromName}`,
      ...(giftNote ? [`Gift note: ${giftNote}`] : []),
    ].join("\n");

    const cartResult = await callStoreApi<Record<string, unknown>>("/cart", { session });
    session = cartResult.session;
    const clearedCart = await callStoreApi<Record<string, unknown>>("/cart/items", { session, method: "DELETE" });
    session = clearedCart.session;
    for (const [index, item] of items.entries()) {
      const addResult = await callStoreApi<Record<string, unknown>>("/cart/add-item", {
        session,
        method: "POST",
        body: JSON.stringify({
          id: item.productId,
          quantity: item.quantity,
          siesels_selection_metadata: metadata,
          siesels_line_group: `gift-card-${index + 1}`,
          siesels_parent_name: products[index].name,
        }),
      });
      session = addResult.session;
    }

    const nameParts = customerName.split(/\s+/);
    const firstName = nameParts.shift() ?? "";
    const lastName = nameParts.join(" ");
    const checkout = await callStoreApi<Record<string, unknown>>("/checkout", {
      session,
      method: "POST",
      body: JSON.stringify({
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address_1: customer.address1,
          address_2: "",
          city: customer.city,
          state: customer.state,
          postcode: customer.postcode,
          country: "US",
          email: customerEmail,
          phone: customer.phone,
        },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address_1: customer.address1,
          address_2: "",
          city: customer.city,
          state: customer.state,
          postcode: customer.postcode,
          country: "US",
          phone: customer.phone,
        },
        customer_note: "Gift card order. Recipient details are recorded on the gift card line item.",
        payment_method: "stripe",
        payment_data: [
          { key: "payment_method", value: "stripe" },
          { key: "wc-stripe-payment-method", value: paymentMethodId },
        ],
      }),
    });
    session = checkout.session;

    const response = respond(checkout.data, 200, session);
    try {
      const emptiedCart = await callStoreApi<Record<string, unknown>>("/cart/items", { session, method: "DELETE" });
      return writeStoreApiSession(response, emptiedCart.session, SESSION_COOKIE_PREFIX);
    } catch (cleanupError) {
      console.error("Gift card order created; isolated cart cleanup failed:", cleanupError);
      return response;
    }
  } catch (error) {
    if (error instanceof StoreApiError) {
      return respond(error.body ?? { message: error.message }, error.status, session);
    }
    console.error("Gift card checkout failed:", error);
    return respond({ message: "Unable to place gift card order. Please try again." }, 500, session);
  }
}