import { CartItem } from "@/types/cart";
import CartProductCard
  from "./CartProductCard";
import { IngredientSelection } from "@/types/ingredients";

type Props = {
  items: CartItem[];
  onRemove?: (itemId: string) => void;
  onToggleIngredient?: (itemId: string, ingredientName: string) => void;
  onEditItem?: (itemId: string) => void;
  onEditCustomItem?: (itemId: string, baseProductId: number) => void;
};

export default function CartGrid({
  items,
  onRemove,
  onToggleIngredient,
  onEditItem,
    onEditCustomItem,
}: Props) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <CartProductCard
          key={item.id}
          item={item}
          onRemove={() => onRemove?.(item.id)}
          onToggleIngredient={(ingredient) => onToggleIngredient?.(item.id, ingredient.name)}
          
        onEdit={() => {
        if (item.customSandwich) {
            const baseProductId = item.customSandwich?.baseProductId || 0;
            onEditCustomItem?.(item.id, baseProductId);
        } else {
            onEditItem?.(item.id);
        }
        }}  
  
      />
      ))}
    </div>
  );
}