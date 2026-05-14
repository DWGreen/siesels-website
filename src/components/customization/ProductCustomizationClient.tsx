"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";

import ProductCustomization from "./ProductCustomization";

import {
  Product,
  ProductOrder,
} from "@/types/product";

import { CartItem, CartModifier, ModifierDefinition } from "@/types/cart";

import {
  productToProductOrder,
  productOrderToCartItem,
} from "@/utils/cartItemFactory";

type Props = {
  product: Product;
  editCartItemId?: string;
  returnTo: string;
  modifierDefinitions: ModifierDefinition[];
};

function buildInitialProductOrder(
  product: Product,
  editingItem?: CartItem
): ProductOrder {
  if (editingItem?.product) {
    return editingItem.product;
  }

  return productToProductOrder(product);
}
function buildInitialModifiers(
  editingItem?: CartItem
): CartModifier[] {
  return editingItem?.modifiers ?? [];
}
function buildInitialQuantity(
  editingItem?: CartItem
): number {
  return editingItem?.quantity ?? 1;
}

export default function ProductCustomizationClient({
  product,
  editCartItemId,
  returnTo,
  modifierDefinitions,
}: Props) {
  const router = useRouter();

  const {
    cart,
    addItem,
    updateItem,
  } = useCart();

  const editingItem =
    cart.items.find(
      item =>
        item.id === editCartItemId
    );
const initialModifiers =
  useMemo(
    () =>
      buildInitialModifiers(
        editingItem
      ),
    [
      editingItem,
    ]
  );
  const initialProductOrder =
    useMemo(
      () =>
        buildInitialProductOrder(
          product,
          editingItem
        ),
      [
        product,
        editingItem,
      ]
    );
  
  const initialQuantity =
    useMemo(
      () =>
        buildInitialQuantity(
          editingItem
        ),
      [
        editingItem,
      ]
    );

  function handleCancel() {
    router.push(
      returnTo
    );
  }

  function handleSave(
    productOrder: ProductOrder,
    quantity: number,
    modifiers: CartModifier[]
  ) {
    console.log("modifers received in handleSave:", modifiers);
    const cartItem =
      productOrderToCartItem(
        productOrder,
        quantity,
        modifiers
      );
console.log("Cart item to save:", cartItem);
    if (editingItem) {
      updateItem(
        editingItem.id,
        {
          ...cartItem,
          id: editingItem.id,
        }
      );
    } else {
      addItem(cartItem);
    }

    router.push(
      returnTo
    );
  }

  return (
    <ProductCustomization
      key={
        editCartItemId ??
        product.id
      }
      product={product}
      productOrder={
        initialProductOrder
      }
      initialQuantity={
        initialQuantity
      }
      initialModifiers={
    initialModifiers
  }
      onCancel={
        handleCancel
      }
      onSave={
        handleSave
      }
      modifierDefinitions={modifierDefinitions}
      isEditing={
        !!editingItem
      }
    />
  );
}