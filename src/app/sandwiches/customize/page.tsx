
import { Product } from "@/types/product";
import ProductCustomization from "@/components/customization/ProductCustomization";
import { getProductById } from "@/services/products";
import { notFound } from "next/navigation";
import ProductCustomizationClient from "@/components/customization/ProductCustomizationClient";
import { getModifierDefinitionsForCategories } from "@/data/modifiers";
import { getHydratedModifierDefinitions } from "@/services/modifiers";

import {
  getCategoryById,
} from "@/services/categories";
type Props = {
  searchParams: Promise<{
    productId?: number;
    editCartItemId?: string;
    returnTo?: string;
  }>;
};
export default async function ProductPage({
  searchParams,
}: Props) {
 const params =
    await searchParams;

const product =
    params.productId
      ? await getProductById(
          params.productId
        )
      : null;

const editCartItemId = params.editCartItemId;
console.log("product customization page:", product);
if (!product) {
  notFound();
}

const returnTo = params.returnTo || "/sandwiches/";
const fullProductCategories =
  await Promise.all(
    product.categories.map(
      category =>
        getCategoryById(
          String(category.id)
        )
    )
  );

 console.log("full product categories:", fullProductCategories); 
const matchingModifierDefinitions =
  getModifierDefinitionsForCategories(
    fullProductCategories
  );
  console.log("matching modifier definitions:", matchingModifierDefinitions);

const hydratedModifierDefinitions =
  await getHydratedModifierDefinitions(
    matchingModifierDefinitions
  );

return <ProductCustomizationClient product={product} editCartItemId={editCartItemId} returnTo={returnTo} modifierDefinitions={hydratedModifierDefinitions} />;
}