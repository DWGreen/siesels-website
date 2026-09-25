// Maps our internal CartItem model to the set of WooCommerce line items it should
// correspond to. Each "role" is a stable id (per cart item) used to track which
// WooCommerce cart line it maps to, so the sync layer can add/update/remove precisely.
//
// Price-override modifiers (e.g. "Half Sandwich & Soup") replace the base product line
// entirely with the modifier's own product, plus an optional free "companion" line item
// so WooCommerce order/receipt views still show the modifier by name (see docs/woocommerce-order-engine-plan.md §4 item 6a).

import { CartItem, CartModifier } from "@/types/cart";
import { getModifierByDefinitionId } from "@/data/modifiers";

export interface DesiredLineItem {
  role: string;
  productId: number;
  quantity: number;
  selectionMetadata?: string;
  groupKey?: string;
  parentName?: string;
}

const addFreeSelectionProducts =
  process.env.NEXT_PUBLIC_WC_ADD_FREE_SELECTION_PRODUCTS === "true";

function getSelectionMetadata(item: CartItem): string {
  const selections: string[] = [];

  item.product?.ingredientSelections.forEach(ingredient => {
    selections.push(
      `${ingredient.included ? "Included" : "No"} ${ingredient.name}${ingredient.extra ? " (Extra)" : ""}`
    );
  });

  item.customSandwich?.ingredients.forEach(ingredient => {
    selections.push(ingredient.name);
  });

  item.modifiers?.forEach(modifier => {
    selections.push(modifier.name);
    modifier.selectedGroups.forEach(group => {
      group.selectedOptions.forEach(option => {
        selections.push(`${group.groupName}: ${option.name}`);
      });
    });
  });

  return selections.join("\n");
}

function getBaseProductId(item: CartItem): number | undefined {
  return item.type === "custom-sandwich"
    ? item.customSandwich?.baseProductId
    : item.product?.baseProductId;
}

function getOverrideModifier(
  modifiers: CartModifier[] | undefined
): CartModifier | undefined {
  return modifiers?.find(modifier => modifier.priceOverride);
}

export function getDesiredLineItemsForCartItem(
  item: CartItem
): DesiredLineItem[] {
  const lines: DesiredLineItem[] = [];
  const overrideModifier = getOverrideModifier(item.modifiers);
  const baseProductId = getBaseProductId(item);
  const selectionMetadata = getSelectionMetadata(item);
  const groupKey = `siesels-${item.id}`;
  const parentName = item.customSandwich?.name ?? item.product?.name ?? "Sandwich";

  if (overrideModifier) {
    const definition = getModifierByDefinitionId(overrideModifier.definitionId);

    if (definition?.productId) {
      lines.push({
        role: "override",
        productId: definition.productId,
        quantity: item.quantity,
        ...(selectionMetadata ? { selectionMetadata } : {}),
        groupKey,
        parentName,
      });

      if (addFreeSelectionProducts && definition.companionProductId) {
        lines.push({
          role: "override-companion",
          productId: definition.companionProductId,
          quantity: item.quantity,
          groupKey,
          parentName,
        });
      }
    }
  } else if (baseProductId) {
    lines.push({
      role: "base",
      productId: baseProductId,
      quantity: item.quantity,
      ...(selectionMetadata ? { selectionMetadata } : {}),
      groupKey,
      parentName,
    });
  }

  if (item.type === "custom-sandwich") {
    item.customSandwich?.ingredients
      .filter(ingredient => Boolean(ingredient.id) && ingredient.price)
      .forEach(ingredient => {
        lines.push({
          role: `ingredient-${ingredient.id}`,
          productId: ingredient.id,
          quantity: item.quantity,
          groupKey,
          parentName,
        });
      });
  }

  item.modifiers
    ?.filter(modifier => modifier !== overrideModifier)
    .forEach(modifier => {
      const definition = getModifierByDefinitionId(modifier.definitionId);

      if (definition?.productId) {
        lines.push({
          role: `modifier-${definition.id}`,
          productId: definition.productId,
          quantity: item.quantity,
          groupKey,
          parentName,
        });
      }

      if (addFreeSelectionProducts) {
        modifier.selectedGroups.forEach(group => {
          group.selectedOptions.forEach(option => {
            lines.push({
              role: `modifier-option-${option.id}`,
              productId: option.id,
              quantity: item.quantity,
              groupKey,
              parentName,
            });
          });
        });
      }
    });

  return lines;
}
