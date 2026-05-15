import { Ingredient } from "@/types/ingredients";

type Props = {
  ingredients: Ingredient[];
};

function formatIngredientLabel(
  ingredient: Ingredient
): string {
  const prefix =
    ingredient.included
      ? ingredient.extra
        ? "Extra"
        : "Included"
      : "No";

  const price =
    ingredient.price
      ? ` / +$${ingredient.price.toFixed(2)}`
      : "";

  return `${prefix} ${ingredient.name}${price}`;
}

export default function QuickIngredientsList({
  ingredients,
}: Props) {
  return (
    <div
      className="
        space-y-2
      "
    >
      {ingredients.map((ingredient) => {
        const included =
          ingredient.included;

        return (
          <div
            key={ingredient.name}
            className="
              flex
              items-start
              gap-2
              text-xs
              leading-relaxed
              text-neutral-800
            "
          >
            <span
              className={`
                mt-0.5
                flex
                h-4
                w-4
                shrink-0
                items-center
                justify-center
                border
                text-[10px]
                font-black
                leading-none

                ${
                  included
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-300 bg-white text-transparent"
                }
              `}
            >
              ✓
            </span>

            <span
              className={`
                ${
                  included
                    ? "text-neutral-800"
                    : "text-neutral-500 line-through"
                }
              `}
            >
              {formatIngredientLabel(
                ingredient
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}