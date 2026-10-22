import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import { getOrderType, orderConfirmationConfig } from "@/data/orderConfirmation";

import { getWooCommerceApi } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false, follow: false } };

type Props = {
  searchParams: Promise<{
    session_id?: string;
    order_id?: string;
    order_key?: string;
    reservation?: string;
    orderType?: string;
  }>;
};

type WooOrder = {
  id: number;
  number: string;
  status: string;
  currency: string;
  subtotal?: string;
  total_tax: string;
  total: string;
  customer_note?: string;
  line_items: Array<{
    name: string;
    quantity: number;
    subtotal: string;
    total: string;
    meta_data?: Array<{
      key: string;
      value: unknown;
      display_key?: string;
      display_value?: string;
    }>;
  }>;
};

async function getOrder(
  orderId?: string,
  orderKey?: string
): Promise<WooOrder | null> {
  if (!orderId || !orderKey || !/^\d+$/.test(orderId)) {
    return null;
  }

  try {
    const api = getWooCommerceApi();
    const response = await api.get(`orders/${orderId}`);
    const order = response.data as WooOrder & { order_key?: string };

    return order.order_key === orderKey ? order : null;
  } catch (error) {
    console.error("Unable to load WooCommerce receipt:", error);
    return null;
  }
}

function getMeta(
  item: WooOrder["line_items"][number],
  key: string
): string | undefined {
  const value = item.meta_data?.find(
    meta => meta.key.toLowerCase() === key.toLowerCase()
  )?.value;
  return typeof value === "string" ? value : undefined;
}

export default async function OrderConfirmationPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const order = await getOrder(params.order_id, params.order_key);
  const config = orderConfirmationConfig[getOrderType(params.orderType ?? params.reservation)];
  const isReservation = config.isReservation;
  const pickupDate = order?.customer_note?.match(/Pickup date: (\d{4}-\d{2}-\d{2})/)?.[1];
  const pickupLocation = order?.customer_note?.match(/Pickup location: (.+?)\s*\([^)]+\)\./)?.[1];
  const groups = order
    ? Array.from(
        order.line_items.reduce((map, item, index) => {
          const groupKey = getMeta(item, "Line group") ?? `line-${index}`;
          const group = map.get(groupKey) ?? {
            name: getMeta(item, "Parent name") ?? item.name,
            items: [],
          };
          group.items.push({ item, index });
          map.set(groupKey, group);
          return map;
        }, new Map<string, { name: string; items: Array<{ item: WooOrder["line_items"][number]; index: number }> }>())
      ).map(([, group]) => group)
    : [];

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <InteriorHero title={config.heroTitle} backgroundImage={config.heroImage} backgroundAlt={config.heroTitle} showMasterLogo />
        <div
          className="
            min-h-svh
            bg-[#e6e6e6]
            px-6
            py-20
            text-neutral-950
          "
        >
          <div className="mx-auto max-w-3xl border-2 border-neutral-950 bg-white p-8">
            <h2
              className="
                font-heading text-2xl sm:text-4xl
                font-black
                uppercase
                tracking-[0.08em]
              "
            >
              {order ? config.heading : "Order Confirmation"}
            </h2>

            <p className="mt-6 text-center text-sm font-semibold leading-relaxed">
              {order ? config.message : "We couldn’t load your order details. If you just submitted an order, check your confirmation email or contact the shop before submitting again."}
            </p>

            {isReservation && pickupDate && (
              <p className="mt-4 text-center text-sm font-bold">
                Pickup date: {pickupDate}
              </p>
            )}

            {isReservation && pickupLocation && (
              <p className="mt-2 text-center text-sm font-bold">Pickup location: {pickupLocation}</p>
            )}

            {order && (
              <p className="mt-6 text-center text-xs text-neutral-600">
                Order number: {order.number}
              </p>
            )}

            {order && (
              <div className="mt-8 border-t border-neutral-950 pt-6">
                <h2 className="text-lg font-black uppercase tracking-[0.2em]">
                  {isReservation ? "Reservation Details" : "Receipt"}
                </h2>

                <div className="mt-5 divide-y divide-neutral-300 border-y border-neutral-300">
                  {groups.map(group => {
                    return (
                      <div key={group.name} className="py-4 text-left">
                        <h3 className="font-black uppercase tracking-[0.12em]">{group.name}</h3>
                        <div className="mt-3 space-y-3 border-l-2 border-neutral-300 pl-4">
                          {group.items.map(({ item, index }) => {
                            const selections = getMeta(item, "Selections");

                            return (
                              <div key={`${item.name}-${index}`}>
                                <div className="flex justify-between gap-4 font-bold">
                                  <span>{item.name}</span>
                                  <span>
                                    {isReservation ? `Quantity: ${item.quantity}` : `${order.currency} ${item.total} (Qty: ${item.quantity})`}
                                  </span>
                                </div>
                                {isReservation && item.meta_data?.filter(meta =>
                                  !meta.key.startsWith("_") && !["selections", "line group", "parent name"].includes(meta.key.toLowerCase())
                                ).map((meta, index) => (
                                  <p key={`${meta.key}-${index}`} className="mt-1 text-sm text-neutral-600">
                                    {meta.display_key ?? meta.key}: {String(meta.display_value ?? meta.value).replace(/<[^>]*>/g, "")}
                                  </p>
                                ))}
                                {selections && (
                                  <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">
                                    {selections}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isReservation && <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{order.currency} {order.subtotal ?? order.line_items.reduce((total, item) => total + Number(item.subtotal), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{order.currency} {order.total_tax}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-950 pt-3 text-lg font-black">
                    <span>Total</span>
                    <span>{order.currency} {order.total}</span>
                  </div>
                </div>}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={config.returnHref}
                className="bg-neutral-950 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-white"
              >
                {config.returnLabel}
              </Link>
              <Link
                href="/"
                className="border border-neutral-950 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em]"
              >
                Go To Home Page
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className="bg-footer-texture"><Footer /></div>
    </div>
  );
}
