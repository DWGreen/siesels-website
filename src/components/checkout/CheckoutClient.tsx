"use client";

import { useMemo } from "react";

import { useCart }
  from "@/context/CartContext";

import CartItemCard
  from "@/components/cart/CartProductCard";

import CheckoutCustomerForm
  from "./CheckoutCustomerForm";

import CheckoutSummary
  from "./CheckoutSummary";

import CheckoutActions
  from "./CheckoutActions";
import {
  useRouter
} from "next/navigation";
import { createCheckoutValidationRequest} from "@/utils/pricingRequestFactory";


import { routes } from "@/utils/routes";
import { CartItem } from "@/types/cart";


async function validateCart(cartItems: CartItem[]) {
  const request = createCheckoutValidationRequest(cartItems);

  const response = await fetch("/api/checkout/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Validation failed:", result.errors);
    return null;
  }
 console.log("Validation succeeded:", result);
  return result;
}

export default function CheckoutClient() {
      const router = useRouter();
    function onEditCustomItem(itemId: string, baseProductId: number) {
        // Handle edit item logic here, e.g. navigate to the builder page with the item ID
        router.push(routes.sandwichBuilder({editCartItemId:itemId, productId:baseProductId, returnTo: routes.checkout}));
    }
    function onEditItem(itemId: string, baseProductId: number) {
        // Handle edit item logic here, e.g. navigate to the builder page with the item ID

        router.push(routes.productCustomizer({editCartItemId:itemId, productId:baseProductId, returnTo: routes.checkout}));
    }


    
  const { cart, removeItem, clearCart } =
    useCart();


  const subtotal = useMemo(() => {

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
        max-w-7xl
        mx-auto
        px-4
        py-12
      "
    >

      <h1
        className="
          text-4xl
          font-bold
          mb-10
        "
      >
        Checkout
      </h1>

      <div
        className="
          grid
          gap-10
          lg:grid-cols-[2fr_1fr]
        "
      >

        <div className="space-y-10">

          <section>

            <h2
              className="
                text-2xl
                font-semibold
                mb-6
              "
            >
              Your Order
            </h2>

            <div className="space-y-4">

              {cart.items.map(item => (

                <CartItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => {
        if (item.customSandwich) {
            const baseProductId = item.customSandwich?.baseProductId || 0;
            onEditCustomItem?.(item.id, baseProductId);
        } else {
            const baseProductId = item.product?.baseProductId || 0;
            onEditItem?.(item.id, baseProductId);
        }
        }}
                  onRemove={() => removeItem(item.id)}
                />

              ))}

            </div>

          </section>

          <CheckoutCustomerForm />

        </div>

        <div>

          <CheckoutSummary
            subtotal={subtotal}
            estimatedTax={estimatedTax}
            estimatedTotal={estimatedTotal}
          />

          <CheckoutActions onCheckout={() => validateCart(cart.items)} />

        </div>

      </div>

    </div>
  );
}