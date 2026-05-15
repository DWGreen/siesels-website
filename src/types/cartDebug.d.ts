import { Cart } from "@/types/cart";
import { Dispatch, SetStateAction } from "react";

declare global {
  interface Window {
    __cartDebug?: {
      getCart: () => Cart;
      setCart: Dispatch<SetStateAction<Cart>>;

      setFirstItemTotalPrice: (totalPrice: number) => void;
      setFirstItemQuantity: (quantity: number) => void;

      setFirstCustomIngredientPrice: (price: number) => void;
      setFirstCustomIngredientId: (id: number) => void;

      setFirstProductBaseProductId: (baseProductId: number) => void;
      setFirstCustomBaseProductId: (baseProductId: number) => void;
    };
  }
}

export {};