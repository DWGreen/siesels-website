import { getWooCommerceApi } from "@/lib/woocommerce";

export const HAM_CATEGORY_ID = 42;

export type HamReservationVariation = {
  id: number;
  attributes: Array<{ attribute: string; value: string }>;
  stockManaged: boolean;
  usesParentStock: boolean;
  stockQuantity: number | null;
  inStock: boolean;
};
export type HamReservationProduct = {
  id: number;
  name: string;
  variations: HamReservationVariation[];
};
type WooProduct = {
  id: number;
  name: string;
  type: string;
  status?: string;
  manage_stock?: boolean;
  stock_quantity?: number | null;
  stock_status?: string;
  categories?: Array<{ id: number }>;
  attributes?: Array<{ name: string; slug?: string; variation?: boolean; options: string[] }>;
};
type WooVariation = {
  id: number;
  status?: string;
  manage_stock?: boolean | string;
  stock_quantity?: number | null;
  stock_status?: string;
  attributes?: Array<{ name: string; slug?: string; option: string }>;
};

export function mapHamVariation(parent: WooProduct, variation: WooVariation): HamReservationVariation | null {
  if (variation.status !== "publish" || variation.attributes?.some(attribute => !attribute.option.trim())) return null;
  return {
    id: variation.id,
    attributes: (variation.attributes ?? []).map(attribute => ({
      attribute: attribute.slug || attribute.name,
      value: attribute.option,
    })),
    stockManaged: variation.manage_stock === true || parent.manage_stock === true,
    usesParentStock: variation.manage_stock !== true && parent.manage_stock === true,
    stockQuantity: variation.manage_stock === true ? variation.stock_quantity ?? null : parent.stock_quantity ?? null,
    inStock: variation.stock_status !== "outofstock" && parent.stock_status !== "outofstock",
  };
}

export async function getHamReservationProducts(): Promise<HamReservationProduct[]> {
  const api = getWooCommerceApi();
  const parents: WooProduct[] = [];
  for (let page = 1; ; page += 1) {
    const response = await api.get(`products?category=${HAM_CATEGORY_ID}&per_page=100&page=${page}&status=publish&orderby=menu_order&order=asc`);
    const batch = response.data as WooProduct[];
    parents.push(...batch);
    if (batch.length < 100) break;
  }
  return Promise.all(parents.filter(parent => parent.type === "variable" && parent.categories?.some(category => category.id === HAM_CATEGORY_ID)).map(async parent => {
    const variations: HamReservationVariation[] = [];
    for (let page = 1; ; page += 1) {
      const response = await api.get(`products/${parent.id}/variations?per_page=100&page=${page}&status=publish`);
      const batch = response.data as WooVariation[];
      for (const variation of batch) {
        const mapped = mapHamVariation(parent, variation);
        if (!mapped) continue;
        variations.push(mapped);
      }
      if (batch.length < 100) break;
    }
    return { id: parent.id, name: parent.name, variations };
  }));
}

export function validateHamReservationLines(
  products: HamReservationProduct[],
  items: Array<{ productId: number; variationId: number; quantity: number }>
): string | null {
  if (!items.length || items.length > 100 || new Set(items.map(item => `${item.productId}:${item.variationId}`)).size !== items.length) {
    return "Choose valid ham options and quantities.";
  }
  const parentQuantities = new Map<number, number>();
  for (const item of items) {
    const product = products.find(entry => entry.id === item.productId);
    const variation = product?.variations.find(entry => entry.id === item.variationId);
    if (!Number.isInteger(item.productId) || !Number.isInteger(item.variationId) || !Number.isInteger(item.quantity) || item.quantity < 1 || !product || !variation) {
      return "Choose valid ham options and quantities.";
    }
    if (!variation.stockManaged || !variation.inStock || variation.stockQuantity === null || !Number.isFinite(variation.stockQuantity) || item.quantity > variation.stockQuantity) {
      return `${product.name} is not available in that quantity.`;
    }
    if (variation.usesParentStock) {
      const total = (parentQuantities.get(product.id) ?? 0) + item.quantity;
      parentQuantities.set(product.id, total);
      if (total > variation.stockQuantity) return `The combined quantity for ${product.name} exceeds the amount available.`;
    }
  }
  return null;
}