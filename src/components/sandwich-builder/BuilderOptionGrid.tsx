import { Product }
  from "@/types/product";

import BuilderOptionCard
  from "./BuilderOptionCard";

type Props = {
  products: Product[];
  selected: number[];
    onToggle: (productId: number) => void;
};

export default function BuilderOptionGrid({
  products,
  selected,
  onToggle,
}: Props) {

  return (
    <div
      className="
        grid
        grid-cols-1
md:grid-cols-2
xl:grid-cols-3
        gap-4
      "
    >

      {products.map((product) => (

        <BuilderOptionCard
          key={product.id}
          product={product}
          selected={selected.includes(product.id)}
          onToggle={() => {
  console.log("clicked product", product.id);
  onToggle(product.id);
}}
        />

      ))}

    </div>
  );
}