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
    `products/categories?parent=${id}`
  );

  return response.data.map(mapWooCategory);
}