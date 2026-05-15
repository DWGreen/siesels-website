import { CartItem } from "@/types/cart";
import CartProductCard
  from "./CartProductCard";

type Props = {
  items: CartItem[];
  onRemove?: (itemId: string) => void;
  onToggleIngredient?: (
    itemId: string,
    ingredientName: string
  ) => void;
  onEditItem?: (itemId: string) => void;
  onEditCustomItem?: (
    itemId: string,
    baseProductId: number
  ) => void;
  onQuantityChange?: (
  itemId: string,
  quantity: number
) => void;
};

export default function CartGrid({
  items,
  onRemove,
  onToggleIngredient,
  onEditItem,
  onEditCustomItem,
  onQuantityChange,
}: Props) {
  if (items.length === 0) {
    return (
      <div
        className="
          border-t
          border-neutral-950
          py-6
          text-sm
          italic
          text-neutral-700
        "
      >
        Your order is currently empty.
      </div>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <CartProductCard
          key={item.id}
          item={item}
          onRemove={() =>
            onRemove?.(item.id)
          }
          onQuantityChange={(quantity) =>
    onQuantityChange?.(
      item.id,
      quantity
    )
  }
          onToggleIngredient={(ingredient) =>
            onToggleIngredient?.(
              item.id,
              ingredient.name
            )
          }
          onEdit={() => {
            if (item.customSandwich) {
              const baseProductId =
                item.customSandwich
                  ?.baseProductId || 0;

              onEditCustomItem?.(
                item.id,
                baseProductId
              );
            } else {
              onEditItem?.(item.id);
            }
          }}
        />
      ))}
    </div>
  );
}