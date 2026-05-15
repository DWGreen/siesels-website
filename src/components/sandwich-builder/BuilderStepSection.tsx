"use client";

import { BuilderStep } from "@/types/builder";
import BuilderOptionGrid from "./BuilderOptionGrid";

type Props = {
  step: BuilderStep;
  selected: number[];
  onToggle: (productId: number) => void;
};

export default function BuilderStepSection({
  step,
  selected,
  onToggle,
}: Props) {
  const { category, products } = step;

  const maxSelections =
    category.config.maxSelections;

  const isDefaultIncluded =
    category.config.initializeAllSelected;

  return (
    <section
      className="
        border-t
        border-black/70
        pt-6
      "
    >
      <div
        className="
          mb-5
        "
      >
        <h2
          className="
            text-sm
            font-black
            uppercase
            tracking-[0.28em]
            text-neutral-950
          "
        >
          {category.name}
        </h2>

        <div
          className="
            mt-2
            max-w-xl
            text-xs
            italic
            leading-relaxed
            text-neutral-700
          "
        >
          {maxSelections && (
            <span>
              Choose up to {maxSelections}.
            </span>
          )}

          {isDefaultIncluded && (
            <span>
              {maxSelections ? " " : ""}
              Items in this section are included by default.
            </span>
          )}
        </div>
      </div>

      <BuilderOptionGrid
        products={products}
        selected={selected}
        onToggle={onToggle}
      />
    </section>
  );
}