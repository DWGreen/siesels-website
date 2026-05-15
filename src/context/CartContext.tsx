"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
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
  setCart(currentCart => ({
    ...currentCart,
    items: currentCart.items.map(item => {
      if (item.id !== itemId) {
        return item;
      }

      const unitPrice =
        item.quantity > 0
          ? item.totalPrice / item.quantity
          : item.totalPrice;

      return {
        ...item,
        quantity,
        totalPrice:
          unitPrice * quantity,
      };
    }),
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
useEffect(() => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  window.__cartDebug = {
    getCart: () => cart,

    setCart,

    setFirstItemTotalPrice: (totalPrice: number) => {
      setCart(current => ({
        ...current,
        items: current.items.map((item, index) =>
          index === 0
            ? {
                ...item,
                totalPrice,
              }
            : item
        ),
      }));
    },

    setFirstItemQuantity: (quantity: number) => {
      setCart(current => ({
        ...current,
        items: current.items.map((item, index) =>
          index === 0
            ? {
                ...item,
                quantity,
              }
            : item
        ),
      }));
    },

    setFirstCustomIngredientPrice: (price: number) => {
      setCart(current => ({
        ...current,
        items: current.items.map((item, index) => {
          if (index !== 0 || !item.customSandwich) {
            return item;
          }

          return {
            ...item,
            customSandwich: {
              ...item.customSandwich,
              ingredients: item.customSandwich.ingredients.map(
                (ingredient, ingredientIndex) =>
                  ingredientIndex === 0
                    ? {
                        ...ingredient,
                        price,
                      }
                    : ingredient
              ),
            },
          };
        }),
      }));
    },

    setFirstCustomIngredientId: (id: number) => {
      setCart(current => ({
        ...current,
        items: current.items.map((item, index) => {
          if (index !== 0 || !item.customSandwich) {
            return item;
          }

          return {
            ...item,
            customSandwich: {
              ...item.customSandwich,
              ingredients: item.customSandwich.ingredients.map(
                (ingredient, ingredientIndex) =>
                  ingredientIndex === 0
                    ? {
                        ...ingredient,
                        id,
                      }
                    : ingredient
              ),
            },
          };
        }),
      }));
    },

    setFirstProductBaseProductId: (baseProductId: number) => {
      setCart(current => ({
        ...current,
        items: current.items.map((item, index) => {
          if (index !== 0 || !item.product) {
            return item;
          }

          return {
            ...item,
            product: {
              ...item.product,
              baseProductId,
            },
          };
        }),
      }));
    },

    setFirstCustomBaseProductId: (baseProductId: number) => {
      setCart(current => ({
        ...current,
        items: current.items.map((item, index) => {
          if (index !== 0 || !item.customSandwich) {
            return item;
          }

          return {
            ...item,
            customSandwich: {
              ...item.customSandwich,
              baseProductId,
            },
          };
        }),
      }));
    },
  };

  return () => {
    delete window.__cartDebug;
  };
}, [cart, setCart]);
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

  