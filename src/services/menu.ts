// src/services/menuService.ts

import { menuConfig } from "@/config/menuConfig";

import {
  getCategoryById,

  getCategoryBySlug,
  getChildCategories,
} from "@/services/categories";

import {
  getProductsByCategoryId,
} from "@/services/products";

import {
  MenuStructure,
} from "@/types/menu";

import {
  Category,
} from "@/types/category";

function sortCategories(
  categories: Category[]
): Category[] {
  return [...categories].sort(
    (a, b) =>
      (a.config.menuOrder ?? 999) -
        (b.config.menuOrder ?? 999) ||
      a.name.localeCompare(b.name)
  );
}
export async function getMenuStructure(): Promise<MenuStructure> {
  const rootCategory =
    await getCategoryBySlug(
      menuConfig.mainMenuCategorySlug
    );

  const childCategories =
    await getChildCategories(
      String(rootCategory?.id)
    );

  const sortedChildCategories =
    sortCategories(
      childCategories
    );

  const sections =
    await Promise.all(
      sortedChildCategories.map(
        async category => {
          const products =
            await getProductsByCategoryId(
              String(category.id)
            );

          return {
            category,
            products,
          };
        }
      )
    );

  return {
    rootCategory : rootCategory!,
    sections,
  };
}