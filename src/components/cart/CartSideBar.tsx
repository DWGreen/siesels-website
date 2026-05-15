"use client";

import { useCart } from "@/context/CartContext";
import CartGrid from "./CartGrid";

import { routes } from "@/utils/routes";
import { useRouter } from "next/navigation";
import CartActions from "./CartActions";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

export default function CartSidebar() {
  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  const queryString =
    searchParams.toString();

  const returnTo =
    queryString
      ? `${pathname}?${queryString}`
      : pathname;

  const router =
    useRouter();

  const {
    cart,
    removeItem,
    clearCart,
  } = useCart();

  function onEditCustomItem(
    itemId: string,
    baseProductId: number
  ) {
    router.push(
      routes.sandwichBuilder({
        editCartItemId: itemId,
        productId: baseProductId,
        returnTo,
      })
    );
  }

  function onEditItem(
    itemId: string,
    baseProductId: number
  ) {
    router.push(
      routes.productCustomizer({
        editCartItemId: itemId,
        productId: baseProductId,
        returnTo,
      })
    );
  }

  const totalItems =
    cart.items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const totalCost =
    cart.items.reduce(
      (sum, item) =>
        sum + item.totalPrice,
      0
    );

  return (
    <aside
      className="
        border-t-2
        border-neutral-950
        bg-[#e6e6e6]
        p-5
        text-neutral-950
      "
    >
      <div
        className="
          mb-5
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <h1
          className="
            text-xl
            font-black
            uppercase
            tracking-[0.25em]
          "
        >
          Your Order
        </h1>

        <span
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.18em]
          "
        >
          {totalItems} item{totalItems === 1 ? "" : "s"}
        </span>
      </div>

      <CartGrid
        items={cart.items}
        onRemove={(itemId) => {
          removeItem(itemId);
        }}
        onEditItem={(itemId) => {
          const baseProductId =
            cart.items.find(
              item =>
                item.id === itemId
            )?.product?.baseProductId || 0;

          onEditItem(
            itemId,
            baseProductId
          );
        }}
        onEditCustomItem={(itemId) => {
          const baseProductId =
            cart.items.find(
              item =>
                item.id === itemId
            )?.customSandwich?.baseProductId || 0;

          onEditCustomItem(
            itemId,
            baseProductId
          );
        }}
      />

      <div
        className="
          mt-5
          border-t
          border-neutral-950
          pt-4
          text-sm
          font-semibold
        "
      >
        <div
          className="
            flex
            justify-between
            gap-4
          "
        >
          <span
            className="
              uppercase
              tracking-[0.18em]
            "
          >
            Total Items
          </span>

          <span>
            {totalItems}
          </span>
        </div>

        <div
          className="
            mt-2
            flex
            justify-between
            gap-4
            text-lg
            font-black
          "
        >
          <span
            className="
              uppercase
              tracking-[0.18em]
            "
          >
            Total
          </span>

          <span>
            ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>

      <CartActions
        onClearCart={clearCart}
      />
    </aside>
  );
}