import { Product } from "@/types/product";
import BuilderOptionCard from "./BuilderOptionCard";

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
        sm:grid-cols-2
        gap-x-8
        gap-y-3
      "
    >
      {products.map((product) => (
        <BuilderOptionCard
          key={product.id}
          product={product}
          selected={selected.includes(product.id)}
          onToggle={() => onToggle(product.id)}
        />
      ))}
    </div>
  );
}