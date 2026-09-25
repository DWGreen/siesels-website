import { describe, expect, it } from "vitest";
import { getDesiredLineItemsForCartItem } from "../cartLineItemMapper";
import { CartItem } from "@/types/cart";

describe("getDesiredLineItemsForCartItem", () => {
  it("maps a simple product cart item to its base product line", () => {
    const item: CartItem = {
      id: "cart-1",
      type: "product",
      quantity: 2,
      totalPrice: 19.98,
      product: {
        baseProductId: 42,
        name: "Turkey Club",
        baseProductHasIngredients: false,
        ingredientSelections: [],
        pricing: { basePrice: 9.99, additionalPrice: 0, ingredientPrices: {}, totalPrice: 9.99 },
      },
    };

    expect(getDesiredLineItemsForCartItem(item).map(({ groupKey, parentName, ...line }) => line)).toEqual([
      { role: "base", productId: 42, quantity: 2 },
    ]);
  });

  it("maps a custom sandwich's priced ingredients to their own lines", () => {
    const item: CartItem = {
      id: "cart-2",
      type: "custom-sandwich",
      quantity: 1,
      totalPrice: 12.5,
      customSandwich: {
        name: "Build Your Own",
        selections: {},
        baseProductId: 10,
        ingredients: [
          { id: 55, name: "Extra Bacon", price: 1.5 },
          { id: 56, name: "Lettuce", price: 0 },
        ],
        pricing: { basePrice: 8, additionalPrice: 1.5, ingredientPrices: {}, totalPrice: 9.5 },
      },
    };

    expect(getDesiredLineItemsForCartItem(item).map(({ groupKey, parentName, ...line }) => line)).toEqual([
      {
        role: "base",
        productId: 10,
        quantity: 1,
        selectionMetadata: "Extra Bacon\nLettuce",
      },
      { role: "ingredient-55", productId: 55, quantity: 1 },
    ]);
  });

  it("replaces the base line with the override modifier + companion product", () => {
    const item: CartItem = {
      id: "cart-3",
      type: "custom-sandwich",
      quantity: 1,
      totalPrice: 11.99,
      customSandwich: {
        name: "Turkey Club",
        selections: {},
        baseProductId: 10,
        ingredients: [],
        pricing: { basePrice: 8, additionalPrice: 0, ingredientPrices: {}, totalPrice: 8 },
      },
      modifiers: [
        {
          definitionId: "half-soup-1",
          name: "Half Sandwich & Soup",
          priceOverride: true,
          price: 11.99,
          selectedGroups: [],
        },
      ],
    };

    expect(getDesiredLineItemsForCartItem(item).map(({ groupKey, parentName, ...line }) => line)).toEqual([
      {
        role: "override",
        productId: 120,
        quantity: 1,
        selectionMetadata: "Half Sandwich & Soup",
      },
    ]);
  });

  it("maps additive modifiers and their selected options to separate lines", () => {
    const item: CartItem = {
      id: "cart-4",
      type: "product",
      quantity: 1,
      totalPrice: 13.98,
      product: {
        baseProductId: 42,
        name: "Turkey Club",
        baseProductHasIngredients: false,
        ingredientSelections: [],
        pricing: { basePrice: 9.99, additionalPrice: 0, ingredientPrices: {}, totalPrice: 9.99 },
      },
      modifiers: [
        {
          definitionId: "combo-1",
          name: "Combo",
          price: 3.99,
          selectedGroups: [
            {
              groupId: "drinks",
              groupName: "Drink",
              selectedOptions: [{ id: 200, name: "Soda", price: 0 }],
            },
          ],
        },
      ],
    };

    expect(getDesiredLineItemsForCartItem(item).map(({ groupKey, parentName, ...line }) => line)).toEqual([
      {
        role: "base",
        productId: 42,
        quantity: 1,
        selectionMetadata: "Combo\nDrink: Soda",
      },
      { role: "modifier-combo-1", productId: 95, quantity: 1 },
    ]);
  });

  it("combines an override modifier with an additional additive modifier (real-world BLTA scenario)", () => {
    const item: CartItem = {
      id: "cart-5",
      type: "product",
      quantity: 1,
      totalPrice: 15.98,
      product: {
        baseProductId: 124,
        name: "BLTA",
        baseProductHasIngredients: true,
        ingredientSelections: [],
        pricing: { basePrice: 11.99, additionalPrice: 0, ingredientPrices: {}, totalPrice: 11.99 },
      },
      modifiers: [
        {
          definitionId: "combo-1",
          name: "Make It a Combo",
          price: 3.99,
          selectedGroups: [
            {
              groupId: "31",
              groupName: "Select Chips",
              selectedOptions: [{ id: 94, name: "Miss Vickie's Chips", price: 0 }],
            },
            {
              groupId: "32",
              groupName: "Select Side",
              selectedOptions: [{ id: 93, name: "Baked Beans", price: 0 }],
            },
          ],
        },
        {
          definitionId: "half-soup-1",
          name: "Half Sandwich & Soup",
          priceOverride: true,
          price: 11.99,
          selectedGroups: [],
        },
      ],
    };

    expect(getDesiredLineItemsForCartItem(item).map(({ groupKey, parentName, ...line }) => line)).toEqual([
      {
        role: "override",
        productId: 120,
        quantity: 1,
        selectionMetadata:
          "Make It a Combo\nSelect Chips: Miss Vickie's Chips\nSelect Side: Baked Beans\nHalf Sandwich & Soup",
      },
      { role: "modifier-combo-1", productId: 95, quantity: 1 },
    ]);
  });
});
