import { Product, ProductConfig } from "@/types/product";
import { Ingredient, IngredientOverrideDefinition} from "@/types/ingredients";
import { parseCategoryConfig } from "@/utils/categoryConfig";
import { Category } from "@/types/category";
import { config } from "process";
const WP_INTERNAL_URL = process.env.WP_INTERNAL_URL ?? "";
const WP_PUBLIC_URL = process.env.WP_PUBLIC_URL ?? "";

export function toPublicWpUrl(url?: string | null) {
  if (!url) return "";

  if (WP_INTERNAL_URL && WP_PUBLIC_URL) {
    return url.replace(WP_INTERNAL_URL, WP_PUBLIC_URL);
  }

  return url;
}
function mapIngredients(
  attributes: any[]
): Ingredient[] {

  const ingredientAttribute =
    attributes.find(
      attr =>
        attr.name === "Ingredients"
    );

  if (!ingredientAttribute) {
    return [];
  }

  return ingredientAttribute.options.map(
    (option: string) => ({
      name: option,
    })
  );
}
function mapIngredientOverrides(
  attributes: any[]
): IngredientOverrideDefinition | undefined {
  const ingredientAttribute = attributes.find(
    attr =>
      attr.name?.trim().toLowerCase() === "ingredientoverride"
  );

  if (!ingredientAttribute?.options?.length) {
    return undefined;
  }

  return {
    id: "ingredientOverride",
    ingredientOptions: ingredientAttribute.options.map(
      (option: string) => ({
        name: option,
      })
    ),
  };
}

function normalizeConfigOption(option: string): string {
  return option.trim().toLowerCase();
}

function mapProductConfig(attributes: any[]): ProductConfig {
  const configAttribute = attributes.find(
    attr => attr.name?.trim().toLowerCase() === "config"
  );

  if (!configAttribute?.options?.length) {
    return {};
  }

  const configOptions = new Set(
    configAttribute.options.map((option: string) =>
      normalizeConfigOption(option)
    )
  );

  return {
    priceOverride: configOptions.has("priceoverride"),
  };
}

function mapAllowedBuilder(
  attributes: any[]
): boolean {
  const builderAttribute =
    attributes.find(
      attr =>
        attr.name === "AllowBuilder"
    );

  if (!builderAttribute) {
    return false;
  }

  return builderAttribute.options.includes("true");
}

export function mapWooProduct(
  woo: any
): Product {
  return {
    id: woo.id,

    name: woo.name,

    slug: woo.slug,
    ingredients: mapIngredients(woo.attributes),
    ingredientOverrideDefinition: mapIngredientOverrides(woo.attributes),
    description: woo.description,

    shortDescription: woo.short_description,

    price: woo.price,

    image: woo.images?.[0]
      ? {
          id: woo.images[0].id,
          src: `/images/products/${woo.id}.png`,
          alt: woo.images[0].alt,
        }
      : undefined,
    config: mapProductConfig(woo.attributes),
    categories:
  woo.categories.map(
    (category: Category) => ({
      id: category.id,

      name: category.name,

      slug: category.slug,

      description:
        category.description,

      config:
        parseCategoryConfig(
          category.description
        ),
  })
  ),
    allowBuilder: mapAllowedBuilder(woo.attributes),
  };
}