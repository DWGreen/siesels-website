import {
  getProductById,
  getProductsByCategoryId,
} from "@/services/products";

import {
  getChildCategories,
} from "@/services/categories";

import {
  ModifierDefinition,
  ModifierOptionGroupDefinition,
} from "@/types/cart";

import {
  productToModifierOption,
 
} from "@/services/mappers/modifierMapper";

export async function getHydratedModifierDefinition(
  definition: ModifierDefinition
): Promise<ModifierDefinition> {
  const baseProductId =
    definition.productId;

  const baseProduct =
    baseProductId
      ? await getProductById(
          baseProductId
        )
      : null;

  const childCategories =
    await getChildCategories(
      String(definition.optionCategoryId)
    );

  const optionGroups =
    await Promise.all(
      childCategories.map(
        async (
          category
        ): Promise<ModifierOptionGroupDefinition> => {
          const products =
            await getProductsByCategoryId(
              String(category.id)
            );

          return {
            id: String(category.id),

            name: category.name,

            required:
              category.config
                .selectionRequired ?? false,

            minSelections:
              category.config
                .selectionRequired
                ? 1
                : 0,

            maxSelections:
              category.config
                .maxSelections ?? 1,

            initializeAllSelected:
              category.config
                .initializeAllSelected ?? false,
            autoAddAllProducts:
            category.config.autoAddAllProducts ?? false,
            options:
              products.map(
                productToModifierOption
              ),
          };
        }
      )
    );

  return {
    ...definition,



    baseProduct:
      baseProduct ?? undefined,




    optionGroups,
  };
}

export async function getHydratedModifierDefinitions(
  definitions: ModifierDefinition[]
): Promise<ModifierDefinition[]> {
  return Promise.all(
    definitions.map(
      getHydratedModifierDefinition
    )
  );
}