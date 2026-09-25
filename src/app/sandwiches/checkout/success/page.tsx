import Link from "next/link";
import { getWooCommerceApi } from "@/lib/woocommerce";

type Props = {
  searchParams: Promise<{
    session_id?: string;
    order_id?: string;
    order_key?: string;
  }>;
};

type WooOrder = {
  id: number;
  number: string;
  status: string;
  currency: string;
  subtotal: string;
  total_tax: string;
  total: string;
  line_items: Array<{
    name: string;
    quantity: number;
    subtotal: string;
    total: string;
    meta_data?: Array<{
      key: string;
      value: string;
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

export default async function CheckoutSuccessPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const order = await getOrder(params.order_id, params.order_key);
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

function getMeta(
  item: WooOrder["line_items"][number],
  key: string
): string | undefined {
  return item.meta_data?.find(
    meta => meta.key.toLowerCase() === key.toLowerCase()
  )?.value;
}

  return (
    <main
      className="
        min-h-screen
        bg-[#e6e6e6]
        px-6
        py-20
        text-neutral-950
      "
    >
      <div className="mx-auto max-w-3xl border-2 border-neutral-950 bg-white p-8">
        <h1
          className="
            text-4xl
            font-black
            uppercase
            tracking-[0.22em]
          "
        >
          Order Received
        </h1>

        <p className="mt-6 text-center text-sm font-semibold leading-relaxed">
          Thank you. Your payment was completed successfully.
        </p>

        {(order || params.order_id || params.session_id) && (
          <p className="mt-6 text-center text-xs text-neutral-600">
            {params.order_id
              ? `Order number: ${order?.number ?? params.order_id}`
              : `Session ID: ${params.session_id}`}
          </p>
        )}

        {order && (
          <div className="mt-8 border-t border-neutral-950 pt-6">
            <h2 className="text-lg font-black uppercase tracking-[0.2em]">
              Receipt
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
                                {item.quantity} x {order.currency} {item.total}
                              </span>
                            </div>
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

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{order.currency} {order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{order.currency} {order.total_tax}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-950 pt-3 text-lg font-black">
                <span>Total</span>
                <span>{order.currency} {order.total}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/sandwiches"
            className="bg-neutral-950 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-white"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-neutral-950 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.18em]"
          >
            Go To Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}