"use client";

import { useCart }
  from "@/context/CartContext";
import CartGrid from "./CartGrid";

import { routes } from "@/utils/routes";
import {
  useRouter
} from "next/navigation";
import CartActions from "./CartActions";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";


export default function
CartSidebar() {
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

    const router = useRouter();

    function onEditCustomItem(itemId: string, baseProductId: number) {
        // Handle edit item logic here, e.g. navigate to the builder page with the item ID
        router.push(routes.sandwichBuilder({editCartItemId:itemId, productId:baseProductId, returnTo: returnTo}));
    }
    function onEditItem(itemId: string, baseProductId: number) {
        // Handle edit item logic here, e.g. navigate to the builder page with the item ID

        router.push(routes.productCustomizer({editCartItemId:itemId, productId:baseProductId, returnTo: returnTo}));
    }


    
  const { cart, removeItem, clearCart } =
    useCart();
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
<div
      className="
        border-t
        p-4
        space-y-4
      "
    >
        <h1>Your Order</h1>

      <CartGrid
        items={cart.items}
        onRemove={(itemId) => {
          removeItem(itemId);
        }}
        onEditItem={(itemId) => {
            const baseProductId = cart.items.find(item => item.id === itemId)?.product?.baseProductId || 0;
            onEditItem(itemId, baseProductId);
        }}
        onEditCustomItem={(itemId) => {
            const baseProductId = cart.items.find(item => item.id === itemId)?.customSandwich?.baseProductId || 0;
            onEditCustomItem(itemId, baseProductId);
        }}
      />

      <div
        className="
          border-t
          pt-4
          space-y-1
        "
      >

        <p>
          Total Items:
          {" "}
          {totalItems}
        </p>

        <p>
          Total:
          {" "}
          ${totalCost.toFixed(2)}
        </p>

      </div>
<CartActions onClearCart={clearCart}/>
    </div>
    );
}