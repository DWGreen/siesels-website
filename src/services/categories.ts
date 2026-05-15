import api from "@/lib/woocommerce";

import { Category } from "@/types/category";

import { mapWooCategory } from "./mappers/categoryMapper";


export async function getCategoryById(id: string): Promise<Category> {
  const response = await api.get(
    `products/categories/${id}`
  );

  return mapWooCategory(response.data);
}
export async function getChildCategories(
  id: string
): Promise<Category[]> {
  const response = await api.get(
    `products/categories?parent=${id}&per_page=100`
  );

  return response.data.map(mapWooCategory);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const response = await api.get(
    `products/categories?slug=${encodeURIComponent(slug)}`
  );

  const category =
    response.data?.[0];

  if (!category) {
    return null;
  }

  return mapWooCategory(category);
}


