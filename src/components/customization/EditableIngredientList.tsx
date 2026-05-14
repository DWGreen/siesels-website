import {
  IngredientSelection,
} from "@/types/ingredients";

type Props = {
  ingredientSelection: IngredientSelection[];

  onChangeIngredient?: (
    ingredient: IngredientSelection
  ) => void;
};

type IngredientMode =
  | "removed"
  | "regular"
  | "extra";

function getIngredientMode(
  ingredient: IngredientSelection
): IngredientMode {
  if (!ingredient.included) {
    return "removed";
  }

  if (ingredient.extra) {
    return "extra";
  }

  return "regular";
}

function updateIngredientMode(
  ingredient: IngredientSelection,
  mode: IngredientMode
): IngredientSelection {
  if (mode === "removed") {
    return {
      ...ingredient,
      included: false,
      extra: false,
    };
  }

  if (mode === "extra") {
    return {
      ...ingredient,
      included: true,
      extra: true,
    };
  }

  return {
    ...ingredient,
    included: true,
    extra: false,
  };
}

function getButtonClass(
  active: boolean
): string {
  return active
    ? `
      bg-black
      text-white
      border-black
    `
    : `
      bg-white
      text-gray-600
      border-gray-200
    `;
}

export default function EditableIngredientList({
  ingredientSelection,
  onChangeIngredient,
}: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-3
      "
    >
      {ingredientSelection.map(
        ingredient => {
          if (ingredient.disabled) {
            return null;
          }

          const mode =
            getIngredientMode(
              ingredient
            );

          return (
            <div
              key={ingredient.name}
              className="
                rounded-2xl
                bg-gray-100
                px-2
                py-1
                space-y-2
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    min-w-0
                  "
                >
                  <div
                    className="
                      text-sm
                      font-medium
                      text-gray-900
                      leading-tight
                    "
                  >
                    {ingredient.name}
                  </div>

                  {ingredient.price ? (
                    <div
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                      "
                    >
                      Extra +$
                      {ingredient.price.toFixed(
                        2
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    onChangeIngredient?.(
                      updateIngredientMode(
                        ingredient,
                        "removed"
                      )
                    )
                  }
                  className={`
                    rounded-full
                    border
                    px-2
                    py-2
                    text-xs
                    font-medium
                    transition
                    ${getButtonClass(
                      mode === "removed"
                    )}
                  `}
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onChangeIngredient?.(
                      updateIngredientMode(
                        ingredient,
                        "regular"
                      )
                    )
                  }
                  className={`
                    rounded-full
                    border
                    px-2
                    py-2
                    text-xs
                    font-medium
                    transition
                    ${getButtonClass(
                      mode === "regular"
                    )}
                  `}
                >
                  Regular
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onChangeIngredient?.(
                      updateIngredientMode(
                        ingredient,
                        "extra"
                      )
                    )
                  }
                  className={`
                    rounded-full
                    border
                    px-2
                    py-2
                    text-xs
                    font-medium
                    transition
                    ${getButtonClass(
                      mode === "extra"
                    )}
                  `}
                >
                  Extra
                </button>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}