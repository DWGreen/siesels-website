
import { getBuilderSteps }
  from "@/services/builder";
import BuilderOptionGrid 
    from "@/components/sandwich-builder/BuilderOptionGrid";
import SandwichBuilder from "@/components/sandwich-builder/SandwichBuilder";    
import { Product } from "@/types/product";  
import { getProductById }
  from "@/services/products";
  import { notFound }
  from "next/navigation";
import { getCategoryById } from "@/services/categories";
import { getModifierDefinitionsForCategories } from "@/data/modifiers";
import { getHydratedModifierDefinitions } from "@/services/modifiers";
type Props = {
  searchParams: Promise<{
    productId?: string;
    editCartItemId?: string;
    returnTo?: string;
  }>;
};
export default async function BuildPage({
  searchParams,
}: Props) {
 const params =
    await searchParams;

  const productId =
    params.productId;

  console.log("productid:", productId);
  const returnTo = params.returnTo || "/sandwiches/menu";
const editCartItemId = params.editCartItemId;
const product =
    productId
      ? await getProductById(
          productId
        )
      : null;

if (!product || (!product.allowBuilder && !editCartItemId)) {
    notFound();
}
 
console.log("product:", product);

  const steps =
    await getBuilderSteps(24);
    type BuilderSelections = {
  [categoryId: number]: Product[];
};
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
  return (
    <SandwichBuilder
         product={product}
      steps={steps}
      editCartItemId={editCartItemId}
      returnTo={returnTo}
      modifierDefinitions={hydratedModifierDefinitions}
    />
  );
}