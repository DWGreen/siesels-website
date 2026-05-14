"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  Cart,
  CartItem,
} from "@/types/cart";

type CartContextType = {

  cart: Cart;
  clearCart: () => void;
  addItem: (
    item: CartItem
  ) => CartItem;

  removeItem: (
    itemId: string
  ) => void;

  updateQuantity: (
    itemId: string,
    quantity: number
  ) => void;
  updateItem: (
    itemId: string,
    updatedItem: CartItem
  ) => void;
};

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined);


  type Props = {
  children: ReactNode;
};

export function CartProvider({
  children,
}: Props) {

  const [cart, setCart] =
    useState<Cart>({
      items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
    });
function clearCart() {

  setCart({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  });
}

function addItem(
  item: CartItem
) {

  setCart(prev => ({

    ...prev,

    items: [
      ...prev.items,
      item,
    ],
  }));

  return item;
}


function removeItem(
  itemId: string
) {

  setCart(prev => ({

    ...prev,

    items:
      prev.items.filter(
        item => item.id !== itemId
      ),
  }));
}


function updateQuantity(
  itemId: string,
  quantity: number
) {

  setCart(prev => ({

    ...prev,

    items:
      prev.items.map(item =>

        item.id === itemId
          ? {
              ...item,
              quantity,
            }
          : item
      ),
  }));
}
function updateItem(
  itemId: string,
  updatedItem: CartItem
) {

  setCart(prev => ({

    ...prev,

    items:
      prev.items.map(item =>

        item.id === itemId
          ? {
              ...item,
              ...updatedItem,
            }
          : item
      ),
  }));
}

  return (

    <CartContext.Provider
      value={{

        cart,

        addItem,

        removeItem,

        updateQuantity,

        updateItem,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}

export function useCart() {

  const context =
    useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
}

  