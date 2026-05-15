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

function getModeLabel(
  mode: IngredientMode
): string {
  if (mode === "removed") {
    return "No";
  }

  if (mode === "extra") {
    return "Extra";
  }

  return "Regular";
}

function getNextMode(
  mode: IngredientMode
): IngredientMode {
  if (mode === "regular") {
    return "extra";
  }

  if (mode === "extra") {
    return "removed";
  }

  return "regular";
}

export default function EditableIngredientList({
  ingredientSelection,
  onChangeIngredient,
}: Props) {
  return (
    <div
      className="
        space-y-3
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

          const nextMode =
            getNextMode(mode);

          const isRemoved =
            mode === "removed";

          const isExtra =
            mode === "extra";

          return (
            <div
              key={ingredient.name}
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <button
                type="button"
                onClick={() =>
                  onChangeIngredient?.(
                    updateIngredientMode(
                      ingredient,
                      nextMode
                    )
                  )
                }
                className="
                  group
                  flex
                  min-w-0
                  flex-1
                  items-start
                  gap-3
                  text-left
                  text-sm
                  text-neutral-950
                "
              >
                <span
                  className={`
                    mt-0.5
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    border
                    text-sm
                    font-black
                    leading-none
                    transition

                    ${
                      isRemoved
                        ? "border-neutral-300 bg-white text-transparent group-hover:border-neutral-950"
                        : "border-neutral-950 bg-neutral-950 text-white"
                    }
                  `}
                >
                  ✓
                </span>

                <span
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <span
                    className={`
                      block
                      font-semibold
                      leading-snug

                      ${
                        isRemoved
                          ? "text-neutral-500 line-through"
                          : "text-neutral-950"
                      }
                    `}
                  >
                    {ingredient.name}
                  </span>

                  {ingredient.price ? (
                    <span
                      className="
                        mt-1
                        block
                        text-xs
                        font-semibold
                        text-neutral-700
                      "
                    >
                      Extra / $
                      {ingredient.price.toFixed(
                        2
                      )}
                    </span>
                  ) : null}
                </span>
              </button>

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  border
                  border-neutral-300
                  bg-white
                  p-1
                "
              >
                {(
                  [
                    "removed",
                    "regular",
                    "extra",
                  ] as IngredientMode[]
                ).map(optionMode => {
                  const active =
                    mode === optionMode;

                  return (
                    <button
                      key={optionMode}
                      type="button"
                      onClick={() =>
                        onChangeIngredient?.(
                          updateIngredientMode(
                            ingredient,
                            optionMode
                          )
                        )
                      }
                      className={`
                        px-2
                        py-1
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.12em]
                        transition

                        ${
                          active
                            ? "bg-neutral-950 text-white"
                            : "bg-white text-neutral-600 hover:bg-neutral-100"
                        }
                      `}
                    >
                      {getModeLabel(
                        optionMode
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}