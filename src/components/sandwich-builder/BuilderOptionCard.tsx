"use client";

import { Product } from "@/types/product";

type Props = {
  product: Product;
  selected: boolean;
  onToggle: () => void;
};

function formatPrice(price: Product["price"]) {
  if (
    price === null ||
    price === undefined ||
    price === "" ||
    isNaN(Number(price))
  ) {
    return null;
  }

  const numericPrice = Number(price);

  if (numericPrice === 0) {
    return null;
  }

  return `$${numericPrice.toFixed(2)}`;
}

export default function BuilderOptionCard({
  product,
  selected,
  onToggle,
}: Props) {
  const price = formatPrice(product.price);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        text-left
        text-sm
        text-neutral-950
      "
    >
      <span
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          border
          border-neutral-300
          text-sm
          font-black
          leading-none
          transition

          ${
            selected
              ? "bg-neutral-950 text-white border-neutral-950"
              : "bg-white text-transparent group-hover:border-neutral-950"
          }
        `}
      >
        ✓
      </span>

      <span
        className="
          flex
          min-w-0
          flex-1
          items-baseline
          gap-2
        "
      >
        <span
          className="
            font-semibold
            leading-snug
          "
        >
          {product.name}
        </span>

        {price && (
          <span
            className="
              text-xs
              font-semibold
              text-neutral-700
            "
          >
            / {price}
          </span>
        )}
      </span>
    </button>
  );
}