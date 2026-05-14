import { CartItem } from "@/types/cart";
import QuickIngredientsList
  from "@/components/menu/QuickIngredientsList";
import EditableIngredientList from "../customization/EditableIngredientList";
import { IngredientSelection } from "@/types/ingredients";
import CartModifierList from "./CartModifierList";

type Props = {
  item: CartItem;
  onRemove?: () => void;
  onEdit?: () => void;
  
  onToggleIngredient?: (
    ingredient: IngredientSelection
  ) => void;
};

export default function CartProductCard({
  item,
  onRemove,
  onEdit,



}: Props) {
    console.log("Rendering CartProductCard for item:", item);
const productEditable =
  (item.product?.ingredientSelections.length ?? 0) > 0 ||
  !!item.customSandwich;
  return (
<div
  className="
    border-b
    py-4
    flex
    justify-between
    gap-4
  "
>

  <div className="flex-1">

    <div
      className="
        flex
        justify-between
      "
    >

      <div
  className="
    flex
    items-center
    gap-2
  "
>

  <h3 className="font-medium">

    {item.type === "product"
      ? item.product?.name
      : item.customSandwich?.name}

  </h3>
 <span>
        x{item.quantity}
      </span>
  {productEditable && (

    <button
      onClick={onEdit}
      className="
        text-sm
        text-blue-500
        hover:underline
      "
    >
      Edit
    </button>

  )}

</div>

       
      <span>
        ${item.totalPrice.toFixed(2)}
      </span>

    </div>

    {item.product && (
        <div className="mt-2">
          <QuickIngredientsList
            ingredients={item.product.ingredientSelections.map(
              (selection) => ({
                name: selection.name,
                price: selection.price,
                included: selection.included,
                extra: selection.extra,
              })
            )}
            
          />
        </div>
      )}
      {item.customSandwich && (
        <div className="mt-2">
          <QuickIngredientsList
            ingredients={
              item.customSandwich.ingredients
            }
          />
        </div>
      )}
    {item.modifiers && item.modifiers.length > 0 && (
      <div className="mt-2">
        <CartModifierList modifiers={item.modifiers} />
      </div>
    )}
 </div>

  <button
    type="button"

    onClick={() => {
      onRemove?.();
    }}

    className="
      p-2
      rounded-full
      hover:bg-gray-100
      text-gray-500
      hover:text-black
      self-start
    "
  >
    ✕
  </button>

</div>
  );
}