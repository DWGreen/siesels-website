import { BuilderStep }
  from "@/types/builder";

import { parseCategoryConfig }
  from "@/utils/categoryConfig";

import { getChildCategories }
  from "./categories";

import { getProductsByCategoryId }
  from "./products";

export async function getBuilderSteps(
  parentCategoryId: number
): Promise<BuilderStep[]> {

  const categories =
    await getChildCategories(
      parentCategoryId.toString()
    );

  const steps = await Promise.all(

    categories.map(async (category: any) => {

      const products =
        await getProductsByCategoryId(
          category.id
        );

      return {
        category: {
          id: category.id,

          name: category.name,

          slug: category.slug,

          description:
            category.description,

          config:
            parseCategoryConfig(
              category.description
            ),
        },

        products,
      };
    })
  );

  return steps;
}