// src/services/checkout/checkoutValidationService.ts

import {
  CheckoutValidationRequest,
  CheckoutValidationResponse,
  CheckoutItemRequest,
  ValidatedCheckoutItem,
  CheckoutValidationError,
  ValidatedProductModifier,
} from "@/types/cart";

import {
  getProductById,
  getProductsByIds,
} from "@/services/products";

import { calculateTax } from "@/services/checkout/taxService";

export async function validateCheckoutRequest(
  request: CheckoutValidationRequest
): Promise<CheckoutValidationResponse> {
  const errors: CheckoutValidationError[] = [];
  const validatedItems: ValidatedCheckoutItem[] = [];

  if (!request.items || request.items.length === 0) {
    return {
      isValid: false,
      items: [],
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
      taxRate: 0,
      errors: [{ message: "Cart is empty." }],
    };
  }

  for (const item of request.items) {
    try {
      const validatedItem = await validateCheckoutItem(item);
      validatedItems.push(validatedItem);
    } catch (error) {
      errors.push({
        cartItemId: item.cartItemId,
        message:
          error instanceof Error
            ? error.message
            : "Unable to validate cart item.",
      });
    }
  }

  const subtotalCents = validatedItems.reduce(
    (sum, item) => sum + item.totalPriceCents,
    0
  );

  const taxResult = calculateTax({
    subtotalCents,
  });

  const totalCents =
    subtotalCents + taxResult.taxCents;

  return {
    isValid: errors.length === 0,
    items: validatedItems,
    subtotalCents,
    taxCents: taxResult.taxCents,
    totalCents,
    taxRate: taxResult.taxRate,
    errors,
  };
}

async function validateCheckoutItem(
  item: CheckoutItemRequest
): Promise<ValidatedCheckoutItem> {
  validateBasicItemShape(item);

  const baseProduct = await getProductById(item.productId);

  if (!baseProduct) {
    throw new Error("Base product was not found.");
  }

  const validatedIngredients =
    item.type === "custom-sandwich"
      ? await validateCustomSandwichIngredients(item)
      : [];

  const validatedModifiers = await validateModifiers(item);

  const basePriceCents = parsePriceToCents(baseProduct.price);

  const overrideModifiers = validatedModifiers.filter(
    (modifier) => modifier.overrideBasePrice
  );

  if (overrideModifiers.length > 1) {
    throw new Error("Only one price override modifier can be selected.");
  }

  const overrideModifier = overrideModifiers[0];

  const effectiveBasePriceCents = overrideModifier
    ? overrideModifier.priceCents
    : basePriceCents;

  const modifierTotalCents = validatedModifiers
    .filter((modifier) => !modifier.overrideBasePrice)
    .reduce(
      (sum, modifier) => sum + modifier.priceCents,
      0
    );

  const ingredientTotalCents = validatedIngredients.reduce(
    (sum, ingredient) => sum + ingredient.priceCents,
    0
  );

  const unitPriceCents =
    effectiveBasePriceCents +
    modifierTotalCents +
    ingredientTotalCents;

  const totalPriceCents =
    unitPriceCents * item.quantity;

  return {
    cartItemId: item.cartItemId,
    type: item.type,
    productId: baseProduct.id,
    name: baseProduct.name,
    quantity: item.quantity,

    basePriceCents,
    effectiveBasePriceCents,
    ingredientTotalCents,
    modifierTotalCents,
    unitPriceCents,
    totalPriceCents,

    ingredients: validatedIngredients,
    modifiers: validatedModifiers,
  };
}

function validateBasicItemShape(item: CheckoutItemRequest) {
  if (!item.cartItemId) {
    throw new Error("Cart item is missing an id.");
  }

  if (!item.productId) {
    throw new Error("Cart item is missing a product id.");
  }

  if (!item.quantity || item.quantity < 1) {
    throw new Error("Cart item has an invalid quantity.");
  }

  if (item.type === "custom-sandwich" && !Array.isArray(item.ingredients)) {
    throw new Error("Cart item ingredients are invalid.");
  }

  if (!Array.isArray(item.modifiers)) {
    throw new Error("Cart item modifiers are invalid.");
  }
}

async function validateCustomSandwichIngredients(
  item: CheckoutItemRequest
) {
  if (item.type !== "custom-sandwich") {
    return [];
  }

  const ingredientProductIds = item.ingredients.map(
    (ingredient) => ingredient.productId
  );

  if (ingredientProductIds.length === 0) {
    return [];
  }

  const ingredientProducts = await getProductsByIds(
    ingredientProductIds
  );

  return ingredientProductIds.map((productId) => {
    const product = ingredientProducts.find(
      (p) => p.id === productId
    );

    if (!product) {
      throw new Error(
        `Ingredient product ${productId} was not found.`
      );
    }

    // Later: validate category/step here.
    // Example:
    // if (!isAllowedCustomSandwichIngredient(product)) {
    //   throw new Error(`${product.name} is not allowed as a sandwich ingredient.`);
    // }

    return {
      productId: product.id,
      name: product.name,
      priceCents: parsePriceToCents(product.price),
    };
  });
}

async function validateModifiers(
  item: CheckoutItemRequest
): Promise<ValidatedProductModifier[]> {
  const modifierProductIds = item.modifiers.map(
    (modifier) => modifier.modifierProductId
  );

  if (modifierProductIds.length === 0) {
    return [];
  }

  const modifierProducts = await getProductsByIds(
    modifierProductIds
  );

  return item.modifiers.map((modifier) => {
    const product = modifierProducts.find(
      (p) => p.id === modifier.modifierProductId
    );

    if (!product) {
      throw new Error(
        `Modifier product ${modifier.modifierProductId} was not found.`
      );
    }

    return {
      modifierDefinitionId: modifier.modifierDefinitionId,
      modifierProductId: product.id,
      name: product.name,
      priceCents: parsePriceToCents(product.price),
      overrideBasePrice:
        product.config?.priceOverride ?? false,
    };
  });
}

function parsePriceToCents(
  price: string | number | undefined
): number {
  if (price === undefined || price === null || price === "") {
    return 0;
  }

  const parsed =
    typeof price === "number"
      ? price
      : Number(price);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.round(parsed * 100);
}