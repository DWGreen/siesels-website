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

export default function QuickModifierList({
  modifiers = [],
}: Props) {
  if (modifiers.length === 0) {
    return null;
  }

  return (
    <div
      className="
        flex
        flex-col
        gap-2
      "
    >
      {modifiers.map(modifier => (
        <div
          key={modifier.name}
          className="
            text-xs
            bg-gray-100
            rounded-xl
            px-2
            py-1
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              
            "
          >
            <span>
              ✓ <b>{modifier.name}</b>
            </span>

            {modifier.price ? (
              <span>
                {modifier.priceOverride ? "Changes Price To: " : " + "}
                {formatPrice(
                  modifier.price
                )}
              </span>
            ) : null}
          </div>

          <div
            className="
              mt-1
              flex
              flex-col
              gap-1
              text-gray-600
            "
          >
            {modifier.selectedGroups.flatMap(
              group =>
                group.selectedOptions.map(
                  option => (
                    <div
                      key={`${group.groupId}-${option.id}`}
                      className="
                        pl-3
                      "
                    >
                      - {option.name}
                      {option.price ? (
                        <span>
                          {" "}
                          {formatPrice(
                            option.price
                          )}
                        </span>
                      ) : null}
                    </div>
                  )
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}