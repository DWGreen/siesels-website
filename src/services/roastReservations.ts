import { getWooCommerceApi } from "@/lib/woocommerce";

export interface RoastReservationVariation {
  id: number;
  grade: "Prime" | "Choice";
  attributeName: string;
  stockManaged: boolean;
  stockQuantity: number | null;
  inStock: boolean;
}

export interface RoastReservationProduct {
  id: number;
  name: string;
  variations: RoastReservationVariation[];
}

type WooVariation = {
  id: number;
  status?: string;
  manage_stock?: boolean;
  stock_quantity?: number | null;
  stock_status?: string;
  attributes?: Array<{ name: string; option: string }>;
};

type WooProduct = {
  id: number;
  name: string;
  type: string;
  status?: string;
  manage_stock?: boolean;
  stock_quantity?: number | null;
  stock_status?: string;
  categories?: Array<{ id: number; slug: string }>;
};

function getGrade(variation: WooVariation): "Prime" | "Choice" | null {
  const value = variation.attributes?.find(attribute =>
    attribute.name.trim().toLowerCase() === "grade"
  )?.option.trim().toLowerCase();

  if (value === "prime") return "Prime";
  if (value === "choice") return "Choice";
  return null;
}

export async function getRoastReservationProducts(): Promise<RoastReservationProduct[]> {
  try {
    const api = getWooCommerceApi();
    const response = await api.get(
      "products?category=41&per_page=100&orderby=menu_order&order=asc&status=publish"
    );
    const parents = (response.data as WooProduct[]).filter(product =>
      product.categories?.some(category => category.id === 41)
    );

    return await Promise.all(
      parents.map(async parent => {
        const variationsResponse = await api.get(
          `products/${parent.id}/variations?per_page=100&status=publish`
        );
        const variations = (variationsResponse.data as WooVariation[])
          .filter(variation => variation.status === "publish")
          .map(variation => {
            const grade = getGrade(variation);
            if (!grade) return null;

            const stockManaged = variation.manage_stock === true || parent.manage_stock === true;
            const stockQuantity = variation.manage_stock
              ? variation.stock_quantity ?? null
              : parent.stock_quantity ?? null;

            return {
              id: variation.id,
              grade,
              attributeName: variation.attributes?.find(attribute =>
                attribute.name.trim().toLowerCase() === "grade"
              )?.name ?? "Grade",
              stockManaged,
              stockQuantity,
              inStock: variation.stock_status !== "outofstock" && parent.stock_status !== "outofstock",
            } satisfies RoastReservationVariation;
          })
          .filter((variation): variation is RoastReservationVariation => variation !== null);

        return { id: parent.id, name: parent.name, variations };
      })
    );
  } catch (error) {
    console.error("Failed to load roast reservation products:", error);
    return [];
  }
}

export async function validateRoastReservationLines(
  lines: Array<{ productId: number; variationId: number; quantity: number }>
): Promise<string | null> {
  const api = getWooCommerceApi();

  for (const line of lines) {
    if (
      !Number.isInteger(line.productId) ||
      !Number.isInteger(line.variationId) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1
    ) {
      return "Choose a valid roast cut, grade, and quantity.";
    }

    try {
      const [parentResponse, variationResponse] = await Promise.all([
        api.get(`products/${line.productId}`),
        api.get(`products/${line.productId}/variations/${line.variationId}`),
      ]);
      const parent = parentResponse.data as WooProduct;
      const variation = variationResponse.data as WooVariation;
      const isRoast = parent.categories?.some(category => category.id === 41);
      const grade = getGrade(variation);

      if (parent.status !== "publish" || parent.type !== "variable" || !isRoast || variation.status !== "publish" || !grade) {
        return "One of the selected roast options is no longer available.";
      }

      const stockManaged = variation.manage_stock === true || parent.manage_stock === true;
      const stockQuantity = variation.manage_stock
        ? variation.stock_quantity
        : parent.stock_quantity;
      const inStock = variation.stock_status !== "outofstock" && parent.stock_status !== "outofstock";

      if (!stockManaged) {
        return `${parent.name} (${grade}) is not available for reservation yet. Please contact the shop.`;
      }
      if (!inStock) {
        return `${parent.name} (${grade}) is sold out.`;
      }
      if (typeof stockQuantity === "number" && line.quantity > stockQuantity) {
        return `The requested quantity for ${parent.name} (${grade}) exceeds the amount currently available.`;
      }
    } catch {
      return "Unable to verify roast availability. Please try again.";
    }
  }

  return null;
}
