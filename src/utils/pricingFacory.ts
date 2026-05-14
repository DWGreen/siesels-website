import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

export function pricingFromProduct(
  product: Product
): SandwichPricing {

  const basePrice =
    Number(product.price || 0);

  return {
    basePrice,
    additionalPrice: 0,
    ingredientPrices: {},
    totalPrice: basePrice,
  };
}

