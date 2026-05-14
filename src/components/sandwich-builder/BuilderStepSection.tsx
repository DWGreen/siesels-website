"use client";

import { BuilderStep }
  from "@/types/builder";

import ProductGrid
  from "@/components/menu/ProductGrid";
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

  const {
    category,
    products,

  } = step;

  return (
    <section
      className="
        space-y-6
      "
    >

      <div>

        <h2
          className="
            text-3xl
            font-bold
          "
        >
          {category.name}
        </h2>

        <div
          className="
            flex
            gap-4
            mt-2
            text-sm
            text-gray-500
          "
        >

          {category.config.maxSelections && (
            <span>
              Max selections:
              {" "}
              {category.config.maxSelections}
            </span>
          )}

          {category.config.initializeAllSelected && (
            <span>
              Default included
            </span>
          )}

        </div>

      </div>

      <BuilderOptionGrid products={products} selected={selected} onToggle={onToggle} />

    </section>
  );
}