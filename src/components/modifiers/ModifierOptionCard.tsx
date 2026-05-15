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
        group
        flex
        w-full
        items-start
        gap-3
        text-left
        text-sm
        text-neutral-950

        ${
          disabled
            ? "cursor-default opacity-70"
            : "cursor-pointer"
        }
      `}
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
            selected
              ? "border-neutral-950 bg-neutral-950 text-white"
              : "border-neutral-300 bg-white text-transparent group-hover:border-neutral-950"
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
          className="
            flex
            flex-wrap
            items-baseline
            gap-x-2
            gap-y-1
          "
        >
          <span
            className="
              font-semibold
              leading-snug
            "
          >
            {option.name}
          </span>

          {price > 0 && (
            <span
              className="
                text-xs
                font-semibold
                text-neutral-700
              "
            >
              / ${price.toFixed(2)}
            </span>
          )}
        </span>

        {option.description && (
          <span
            className="
              mt-1
              block
              text-xs
              italic
              leading-relaxed
              text-neutral-600
            "
            dangerouslySetInnerHTML={{
              __html: option.description,
            }}
          />
        )}
      </span>
    </button>
  );
}