import { CartModifier } from "@/types/cart";

type Props = {
  modifiers?: CartModifier[];
};

function formatPrice(
  price?: number
): string {
  if (!price) {
    return "";
  }

  return `$${price.toFixed(2)}`;
}

export default function CartModifierList({
  modifiers = [],
}: Props) {
  if (modifiers.length === 0) {
    return null;
  }

  return (
    <div
      className="
        space-y-3
      "
    >
      {modifiers.map(modifier => (
        <div
          key={modifier.name}
          className="
            border-l
            border-neutral-950
            pl-3
            text-xs
            leading-relaxed
            text-neutral-800
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-baseline
              justify-between
              gap-x-3
              gap-y-1
            "
          >
            <span
              className="
                font-black
                uppercase
                tracking-[0.14em]
                text-neutral-950
              "
            >
              {modifier.name}
            </span>

            {modifier.price ? (
              <span
                className="
                  font-semibold
                "
              >
                {modifier.priceOverride
                  ? "Changes Price To "
                  : "+ "}
                {formatPrice(
                  modifier.price
                )}
              </span>
            ) : null}
          </div>

          {modifier.selectedGroups.length > 0 && (
            <div
              className="
                mt-1
                space-y-1
                text-neutral-700
              "
            >
              {modifier.selectedGroups.flatMap(
                group =>
                  group.selectedOptions.map(
                    option => (
                      <div
                        key={`${group.groupId}-${option.id}`}
                      >
                        — {option.name}
                        {option.price ? (
                          <span>
                            {" "}
                            / {formatPrice(
                              option.price
                            )}
                          </span>
                        ) : null}
                      </div>
                    )
                  )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}