"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];

  onProductClick?: (
    product: Product
  ) => void;
};

export default function ProductGrid({
  products,
  onProductClick,
}: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-x-10
        gap-y-14
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() =>
            onProductClick?.(product)
          }
        />
      ))}
    </div>
  );
}