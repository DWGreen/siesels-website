import { mapHamVariation, type HamReservationVariation } from "@/services/hamReservations";
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
  variations?: HamReservationVariation[];
  stockManaged: boolean;
  stockQuantity: number | null;
  inStock: boolean;
}

type WooCommerceReservationProduct = {
  id: number;
  name: string;
  type?: string;
  attributes?: Array<{ name: string; slug?: string; variation?: boolean; options: string[] }>;
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

    const parents = (response.data as WooCommerceReservationProduct[])
      .filter(product =>
        product.categories?.some(
          category => category.id === categoryConfig.id || category.slug === categoryConfig.slug
        )
      );
    return await Promise.all(parents.map(async product => ({
        id: product.id,
        name: product.name,
        description: product.description ?? "",
        stockManaged: product.manage_stock === true,
        stockQuantity: product.stock_quantity ?? null,
        inStock: product.stock_status !== "outofstock",
        ...(type === "turkey-breast" && product.type === "variable" ? {
          variations: await (async () => {
            const variations: HamReservationVariation[] = [];
            for (let page = 1; ; page += 1) {
              const result = await api.get(`products/${product.id}/variations?per_page=100&page=${page}&status=publish`);
              for (const variation of result.data) {
                const mapped = mapHamVariation({ ...product, type: "variable" }, variation);
                if (mapped && mapped.attributes.length === 1 && mapped.attributes[0].name.trim().toLowerCase() === "weight") variations.push(mapped);
              }
              if (result.data.length < 100) break;
            }
            return variations.sort((a, b) => a.attributes[0].value.localeCompare(b.attributes[0].value, undefined, { numeric: true }));
          })(),
        } : {}),
      })));

  } catch (error) {
    console.error("Failed to load turkey reservation products:", error);
    return [];
  }
}

export async function validateTurkeyReservationLines(
  lines: Array<{ productId: number; variationId?: number; quantity: number }>,
  type: TurkeyReservationType = "turkey"
): Promise<string | null> {
  const categoryConfig = categories[type];
  const api = getWooCommerceApi();
  if (!lines.length || lines.length > 100 || new Set(lines.map(line => `${line.productId}:${line.variationId ?? ""}`)).size !== lines.length) {
    return "Choose valid turkey options and quantities.";
  }
  const parentQuantities = new Map<number, number>();

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

      if (type === "turkey-breast" && product.type === "variable") {
        if (!Number.isInteger(line.variationId)) return "Choose a weight for each turkey breast.";
        const response = await api.get(`products/${product.id}/variations/${line.variationId}`);
        const variation = mapHamVariation({ ...product, type: "variable" }, response.data);
        if (!variation || variation.attributes.length !== 1 || variation.attributes[0].name.trim().toLowerCase() !== "weight") {
          return "One of the selected turkey breast weights is no longer available.";
        }
        if (!variation.stockManaged || !variation.inStock || variation.stockQuantity === null || !Number.isFinite(variation.stockQuantity) || line.quantity > variation.stockQuantity) {
          return `${product.name} (${variation.attributes[0].value}) is not available in that quantity.`;
        }
        if (variation.usesParentStock) {
          const total = (parentQuantities.get(product.id) ?? 0) + line.quantity;
          parentQuantities.set(product.id, total);
          if (total > variation.stockQuantity) return `The combined quantity for ${product.name} exceeds the amount available.`;
        }
        continue;
      }
      if (line.variationId !== undefined) return "Choose a valid turkey option.";
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