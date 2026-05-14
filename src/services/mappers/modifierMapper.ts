import { Product } from "@/types/product";
import {
  ModifierOptionDefinition,
 
} from "@/types/cart";

export function productToModifierOption(
  product: Product
): ModifierOptionDefinition {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price || 0),
    description:
      product.shortDescription ??
      product.description,
    image: product.image,
  };
}

