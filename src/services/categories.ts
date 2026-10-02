import { getWooCommerceApi } from "@/lib/woocommerce";

import { Category } from "@/types/category";

import { mapWooCategory } from "./mappers/categoryMapper";

type CachedCategory = Category & { parentId: number };

const CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000;
let categoryCache: Promise<CachedCategory[]> | null = null;
let categoryCacheExpiresAt = 0;

async function getAllCategories(): Promise<CachedCategory[]> {
  if (categoryCache && Date.now() < categoryCacheExpiresAt) {
    return categoryCache;
  }

  const request = (async () => {
    const api = getWooCommerceApi();
    const categories: CachedCategory[] = [];
    const perPage = 100;
    let page = 1;

    while (true) {
      const response = await api.get(
        `products/categories?per_page=${perPage}&page=${page}&hide_empty=false`
      );
      const batch = response.data as Array<{
        id: number;
        parent?: number;
        name: string;
        slug: string;
        description?: string;
        menu_order?: number;
      }>;

      categories.push(...batch.map(category => ({
        ...mapWooCategory(category),
        parentId: category.parent ?? 0,
      })));

      if (batch.length < perPage) break;
      page += 1;
    }

    return categories;
  })();

  categoryCache = request;
  categoryCacheExpiresAt = Date.now() + CATEGORY_CACHE_TTL_MS;

  try {
    return await request;
  } catch (error) {
    if (categoryCache === request) {
      categoryCache = null;
      categoryCacheExpiresAt = 0;
    }
    throw error;
  }
}

export async function getCategoryById(id: string): Promise<Category> {
  const categories = await getAllCategories();
  const category = categories.find(entry => entry.id === Number(id));

  if (!category) {
    throw new Error(`Product category ${id} was not found.`);
  }

  return category;
}
export async function getChildCategories(
  id: string
): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter(category => category.parentId === Number(id));
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(category => category.slug === slug) ?? null;
}


