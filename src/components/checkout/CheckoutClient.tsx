"use client";

import { useMemo } from "react";

import { useCart } from "@/context/CartContext";

import CartItemCard
  from "@/components/cart/CartProductCard";

import CheckoutCustomerForm
  from "./CheckoutCustomerForm";

import CheckoutSummary
  from "./CheckoutSummary";

import CheckoutActions
  from "./CheckoutActions";

import {
  useRouter,
} from "next/navigation";

import {
  createCheckoutValidationRequest,
} from "@/utils/pricingRequestFactory";

import { routes } from "@/utils/routes";
import { CartItem } from "@/types/cart";

async function validateCart(
  cartItems: CartItem[]
) {
  const request =
    createCheckoutValidationRequest(
      cartItems
    );

  const response =
    await fetch(
      "/api/checkout/validate",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          request
        ),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    console.error(
      "Validation failed:",
      result.errors
    );

    return null;
  }

  console.log(
    "Validation succeeded:",
    result
  );

  return result;
}

export default function CheckoutClient() {
  const router =
    useRouter();

  const {
    cart,
    removeItem,
  } = useCart();

  function onEditCustomItem(
    itemId: string,
    baseProductId: number
  ) {
    router.push(
      routes.sandwichBuilder({
        editCartItemId: itemId,
        productId: baseProductId,
        returnTo: routes.checkout,
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
        returnTo: routes.checkout,
      })
    );
  }

  const subtotal =
    useMemo(() => {
      return cart.items.reduce(
        (sum, item) =>
          sum + item.totalPrice,
        0
      );
    }, [cart.items]);

  const estimatedTax =
    subtotal * 0.08;

  const estimatedTotal =
    subtotal + estimatedTax;

  return (
    <div
      className="
        min-h-screen
        bg-[#e6e6e6]
        text-neutral-950
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-6
          py-14
        "
      >
        <header
          className="
            mb-12
            text-center
          "
        >
          <div
            className="
              mb-5
              flex
              items-center
              justify-center
              gap-5
            "
          >
            <span
              className="
                h-px
                w-20
                bg-neutral-700
                sm:w-28
              "
            />

            <span
              className="
                text-sm
                font-black
                uppercase
                tracking-[0.45em]
                sm:text-lg
              "
            >
              Order Online
            </span>

            <span
              className="
                h-px
                w-20
                bg-neutral-700
                sm:w-28
              "
            />
          </div>

          <h1
            className="
              text-5xl
              font-black
              uppercase
              tracking-[0.28em]
              md:text-7xl
            "
          >
            Checkout
          </h1>

          <p
            className="
              mt-5
              text-xs
              font-black
              uppercase
              tracking-[0.28em]
              sm:text-sm
            "
          >
            Review Your Order
          </p>
        </header>

        <div
          className="
            grid
            gap-10
            lg:grid-cols-[2fr_1fr]
          "
        >
          <div
            className="
              space-y-10
            "
          >
            <section>
              <div
                className="
                  mb-6
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <h2
                  className="
                    text-xl
                    font-black
                    uppercase
                    tracking-[0.25em]
                  "
                >
                  Your Order
                </h2>

                <span
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.18em]
                  "
                >
                  {cart.items.length} item
                  {cart.items.length === 1
                    ? ""
                    : "s"}
                </span>
              </div>

              <div
                className="
                  border-b
                  border-neutral-950
                "
              >
                {cart.items.length === 0 ? (
                  <div
                    className="
                      border-t
                      border-neutral-950
                      py-6
                      text-sm
                      italic
                      text-neutral-700
                    "
                  >
                    Your order is currently empty.
                  </div>
                ) : (
                  cart.items.map(item => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onEdit={() => {
                        if (item.customSandwich) {
                          const baseProductId =
                            item.customSandwich
                              ?.baseProductId || 0;

                          onEditCustomItem(
                            item.id,
                            baseProductId
                          );
                        } else {
                          const baseProductId =
                            item.product
                              ?.baseProductId || 0;

                          onEditItem(
                            item.id,
                            baseProductId
                          );
                        }
                      }}
                      onRemove={() =>
                        removeItem(item.id)
                      }
                    />
                  ))
                )}
              </div>
            </section>

            <CheckoutCustomerForm />
          </div>

          <div>
            <CheckoutSummary
              subtotal={subtotal}
              estimatedTax={estimatedTax}
              estimatedTotal={
                estimatedTotal
              }
            />

            <CheckoutActions
              onCheckout={() =>
                validateCart(cart.items)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}