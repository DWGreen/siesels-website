import { Category } from "@/types/category";
import { parseCategoryConfig } from "@/utils/categoryConfig";

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

export function mapWooCategory(
  wooCategory: WooCategory
): Category {
  return {
    id: wooCategory.id,
    name: wooCategory.name,
    slug: wooCategory.slug,
    description: wooCategory.description,
    config: parseCategoryConfig(
      wooCategory.description
    ),
  };
}