"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useCart } from "@/context/CartContext";

import CartItemCard from "@/components/cart/CartProductCard";

import CheckoutCustomerForm from "./CheckoutCustomerForm";
import CheckoutSummary from "./CheckoutSummary";
import CheckoutActions from "./CheckoutActions";
import CheckoutPaymentForm, {
  useCheckoutPaymentMethod,
} from "./CheckoutPaymentForm";
import { CheckoutCustomerValues } from "./CheckoutCustomerForm";

import { useRouter } from "next/navigation";

import {
  createCheckoutValidationRequest,
} from "@/utils/pricingRequestFactory";

import {
  dollarsToCents,
} from "@/utils/money";

import { routes } from "@/utils/routes";

import {
  CartItem,
  CheckoutValidationResponse,
} from "@/types/cart";

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

async function validateCart(
  cartItems: CartItem[]
): Promise<CheckoutValidationResponse | null> {
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

function CheckoutClientInner() {
  const router = useRouter();
  const createPaymentMethod = useCheckoutPaymentMethod();

  const {
    cart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [
    validatedCheckout,
    setValidatedCheckout,
  ] = useState<CheckoutValidationResponse | null>(
    null
  );

  const [
    isValidating,
    setIsValidating,
  ] = useState(false);

  const [
    validationError,
    setValidationError,
  ] = useState<string | null>(null);

  const [
    checkoutError,
    setCheckoutError,
  ] = useState<string | null>(null);

  const [
    isStartingCheckout,
    setIsStartingCheckout,
  ] = useState(false);

  const [customer, setCustomer] =
    useState<CheckoutCustomerValues>({
      fullName: "",
      email: "",
      phone: "",
      address1: "",
      city: "",
      state: "",
      postcode: "",
      notes: "",
    });

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

  const clientSubtotal = useMemo(() => {
    return cart.items.reduce(
      (sum, item) =>
        sum + item.totalPrice,
      0
    );
  }, [cart.items]);

  const clientSubtotalCents =
    dollarsToCents(clientSubtotal);

  const estimatedTaxCents =
    Math.round(clientSubtotalCents * 0.081);

  const estimatedTotalCents =
    clientSubtotalCents + estimatedTaxCents;

  useEffect(() => {
    let cancelled = false;

    async function runValidation() {
      if (cart.items.length === 0) {
        setValidatedCheckout(null);
        setValidationError(null);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      setValidationError(null);

      const result =
        await validateCart(cart.items);

      if (cancelled) {
        return;
      }

      if (!result) {
        setValidatedCheckout(null);
        setValidationError(
          "Some items in your cart need to be reviewed before checkout."
        );
        setIsValidating(false);
        return;
      }

      setValidatedCheckout(result);
      setValidationError(null);
      setIsValidating(false);
    }

    runValidation();

    return () => {
      cancelled = true;
    };
  }, [cart.items]);
const validatedItemByCartItemId = new Map(
  validatedCheckout?.items.map(item => [
    item.cartItemId,
    item,
  ]) ?? []
);
  const displaySubtotalCents =
    validatedCheckout?.subtotalCents ??
    clientSubtotalCents;

  const displayTaxCents =
    validatedCheckout?.taxCents ??
    estimatedTaxCents;

  const displayTotalCents =
    validatedCheckout?.totalCents ??
    estimatedTotalCents;

  async function handleCheckout() {
  if (cart.items.length === 0) {
    return;
  }

  setIsStartingCheckout(true);
  setCheckoutError(null);

  try {
    const nameParts = customer.fullName.trim().split(/\s+/);
    const firstName = nameParts.shift() ?? "";
    const lastName = nameParts.join(" ");
    const paymentMethodId = await createPaymentMethod({
      name: customer.fullName,
      email: customer.email,
      phone: customer.phone,
    });

    const response =
      await fetch("/api/checkout/woocommerce", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
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
              email: customer.email,
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
            customer_note: customer.notes,
            payment_method: "stripe",
            payment_data: [
              { key: "payment_method", value: "stripe" },
              { key: "wc-stripe-payment-method", value: paymentMethodId },
            ],
          }),
        });

    const result =
      await response.json();

    if (!response.ok) {
      console.error("WooCommerce checkout failed:", result);
      setCheckoutError(
        result.message ??
          "WooCommerce could not process the payment."
      );
      return;
    }

    await clearCart();
    router.push(
      `${routes.checkout}/success?order_id=${encodeURIComponent(
        String(result.order_id ?? "")
      )}&order_key=${encodeURIComponent(String(result.order_key ?? ""))}`
    );
  } catch (error) {
    console.error(
      "Checkout failed:",
      error
    );

    setCheckoutError(
      "Unable to start checkout. Please try again."
    );
  } finally {
    setIsStartingCheckout(false);
  }
}

  const canCheckout =
    cart.items.length > 0 &&
    !!validatedCheckout &&
    !isValidating &&
    !validationError;

  const checkoutMessage = validationError ?? checkoutError;

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

              {checkoutMessage && (
                <div
                  className="
                    mb-5
                    border
                    border-neutral-950
                    bg-white
                    p-4
                    text-sm
                    font-semibold
                    text-neutral-950
                  "
                >
                  {checkoutMessage}
                </div>
              )}

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
                      validatedItem={
    validatedItemByCartItemId.get(item.id)
  }
   onQuantityChange={(
    
    quantity
  ) => {
    updateQuantity(
      item.id,
      quantity
    );
  }}
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

            <CheckoutCustomerForm
              values={customer}
              onChange={setCustomer}
            />

            <CheckoutPaymentForm />
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <CheckoutSummary
              subtotalCents={
                displaySubtotalCents
              }
              taxCents={
                displayTaxCents
              }
              totalCents={
                displayTotalCents
              }
              isValidating={
                isValidating
              }
              isValidated={
                !!validatedCheckout
              }
            />

            <CheckoutActions
              onCheckout={
                handleCheckout
              }
              disabled={
                !canCheckout
              }
              isLoading={
                isStartingCheckout
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutClient() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutClientInner />
    </Elements>
  );
}