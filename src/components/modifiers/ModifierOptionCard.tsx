import {
  ModifierOptionDefinition,
} from "@/types/cart";

type Props = {
  option: ModifierOptionDefinition;

  selected: boolean;

  disabled?: boolean;

  onToggle: () => void;
};

export default function ModifierOptionCard({
  option,
  selected,
  disabled = false,
  onToggle,
}: Props) {
  const price =
    Number(option.price ?? 0);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`
        text-left
        rounded-2xl
        border
        p-3
        transition
        ${
          selected
            ? "border-black bg-gray-100"
            : "border-gray-200 bg-white"
        }
        ${
          disabled
            ? "cursor-default opacity-80"
            : "cursor-pointer hover:border-gray-400"
        }
      `}
    >
      <div
        className="
          flex
          gap-3
          items-start
        "
      >
        {option.image && (
          <img
            src={option.image.src}
            alt={
              option.image.alt ??
              option.name
            }
            className="
              h-16
              w-16
              rounded-xl
              object-cover
              flex-shrink-0
            "
          />
        )}

        <div className="space-y-1">
          <div
            className="
              font-semibold
              text-sm
            "
          >
            {option.name}
          </div>

          {option.description && (
            <div
              className="
                text-xs
                text-gray-500
                line-clamp-2
              "
              dangerouslySetInnerHTML={{
                __html: option.description,
              }}
            />
          )}

          {price > 0 && (
            <div
              className="
                text-xs
                font-medium
              "
            >
              +${price.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}