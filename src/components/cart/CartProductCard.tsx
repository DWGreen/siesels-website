import { CartItem, ValidatedCheckoutItem } from "@/types/cart";
import QuickIngredientsList
  from "@/components/menu/QuickIngredientsList";
import { IngredientSelection } from "@/types/ingredients";
import CartModifierList from "./CartModifierList";
import { formatCurrencyFromCents } from "@/utils/money";

type Props = {
  item: CartItem;
  onRemove?: () => void;
  onEdit?: () => void;

  onToggleIngredient?: (
    ingredient: IngredientSelection
  ) => void;
  onQuantityChange?: (
  quantity: number
) => void;
validatedItem?: ValidatedCheckoutItem;
};

export default function CartProductCard({
  item,
  onRemove,
  onEdit,
  onQuantityChange,
  validatedItem,
}: Props) {
  const productEditable =
    (item.product?.ingredientSelections.length ?? 0) > 0 ||
    !!item.customSandwich;

  const itemName =
    item.type === "product"
      ? item.product?.name
      : item.customSandwich?.name;

  return (
    <div
      className="
        border-t
        border-neutral-950
        py-5
        text-neutral-950
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-baseline
              gap-x-3
              gap-y-1
            "
          >
            <h3
              className="
                text-sm
                font-black
                uppercase
                leading-snug
                tracking-[0.18em]
              "
            >
              {itemName}
            </h3>

            <label
  className="
    flex
    items-center
    gap-2
    text-xs
    font-black
    uppercase
    tracking-[0.14em]
    text-neutral-700
  "
>
  Qty

  <select
    value={item.quantity}
    onChange={(event) =>
      onQuantityChange?.(
        Number(event.target.value)
      )
    }
    className="
      border
      border-neutral-950
      bg-[#e6e6e6]
      px-2
      py-1
      text-xs
      font-black
      uppercase
      tracking-[0.12em]
      text-neutral-950
      outline-none
      transition
      focus:bg-white
    "
  >
    {Array.from(
      {
        length: 10,
      },
      (_, index) => index + 1
    ).map(quantity => (
      <option
        key={quantity}
        value={quantity}
      >
        {quantity}
      </option>
    ))}
  </select>
</label>

            {productEditable && (
              <button
                type="button"
                onClick={onEdit}
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.16em]
                  underline
                  underline-offset-4
                  transition
                  hover:opacity-60
                "
              >
                Edit
              </button>
            )}
          </div>

          <div
            className="
              mt-3
              space-y-3
            "
          >
            {item.product && (
              <QuickIngredientsList
                ingredients={
                  item.product.ingredientSelections.map(
                    selection => ({
                      name: selection.name,
                      price: selection.price,
                      included: selection.included,
                      extra: selection.extra,
                    })
                  )
                }
              />
            )}

            {item.customSandwich && (
              <QuickIngredientsList
                ingredients={
                  item.customSandwich.ingredients
                }
              />
            )}

            {item.modifiers &&
              item.modifiers.length > 0 && (
                <CartModifierList
                  modifiers={item.modifiers}
                />
              )}
          </div>
        </div>

        <div
          className="
            flex
            shrink-0
            items-start
            gap-3
          "
        >
          <span
            className="
              text-sm
              font-black
              tracking-[0.12em]
            "
          >
           {validatedItem
  ? formatCurrencyFromCents(validatedItem.totalPriceCents)
  : `$${item.totalPrice.toFixed(2)}`}
          </span>

          <button
            type="button"
            onClick={() => {
              onRemove?.();
            }}
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              border
              border-neutral-950
              text-xs
              font-black
              transition
              hover:bg-neutral-950
              hover:text-white
            "
            aria-label="Remove item"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}