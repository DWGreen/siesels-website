import { getWooCommerceApi } from "@/lib/woocommerce";

export type TurkeyReservationType = "turkey" | "turkey-breast";
const categories = {
  turkey: { id: 40, slug: "turkey-reservations" },
  "turkey-breast": { id: 43, slug: "turkey-breast-reservations" },
};

export interface TurkeyReservationProduct {
  id: number;
  name: string;
  description: string;
  stockManaged: boolean;
  stockQuantity: number | null;
  inStock: boolean;
}

type WooCommerceReservationProduct = {
  id: number;
  name: string;
  description?: string;
  manage_stock?: boolean;
  stock_quantity?: number | null;
  stock_status?: string;
  categories?: Array<{ id: number; slug: string }>;
  status?: string;
};

export async function getTurkeyReservationProducts(type: TurkeyReservationType = "turkey"): Promise<TurkeyReservationProduct[]> {
  const categoryConfig = categories[type];
  try {
    const api = getWooCommerceApi();
    const response = await api.get(
      `products?category=${categoryConfig.id}&per_page=100&orderby=menu_order&order=asc&status=publish`
    );

    return (response.data as WooCommerceReservationProduct[])
      .filter(product =>
        product.categories?.some(
          category => category.id === categoryConfig.id || category.slug === categoryConfig.slug
        )
      )
      .map(product => ({
        id: product.id,
        name: product.name,
        description: product.description ?? "",
        stockManaged: product.manage_stock === true,
        stockQuantity: product.stock_quantity ?? null,
        inStock: product.stock_status !== "outofstock",
      }));
  } catch (error) {
    console.error("Failed to load turkey reservation products:", error);
    return [];
  }
}

export async function validateTurkeyReservationLines(
  lines: Array<{ productId: number; quantity: number }>,
  type: TurkeyReservationType = "turkey"
): Promise<string | null> {
  const categoryConfig = categories[type];
  const api = getWooCommerceApi();

  for (const line of lines) {
    if (!Number.isInteger(line.productId) || !Number.isInteger(line.quantity) || line.quantity < 1) {
      return "Choose a valid turkey range and quantity.";
    }

    try {
      const response = await api.get(`products/${line.productId}`);
      const product = response.data as WooCommerceReservationProduct;
      const isTurkeyReservation = product.categories?.some(
        category => category.id === categoryConfig.id || category.slug === categoryConfig.slug
      );

      if (product.status !== "publish" || !isTurkeyReservation) {
        return "One of the selected turkey ranges is no longer available.";
      }

      if (!product.manage_stock) {
        return `${product.name} is not available for reservation yet. Please contact the shop.`;
      }

      if (product.stock_status === "outofstock") {
        return `${product.name} is sold out. Please choose another size.`;
      }

      if (
        product.manage_stock &&
        typeof product.stock_quantity === "number" &&
        line.quantity > product.stock_quantity
      ) {
        return `Only ${product.stock_quantity} ${product.name} reservation(s) remain.`;
      }
    } catch {
      return "Unable to verify turkey availability. Please try again.";
    }
  }

  return null;
}