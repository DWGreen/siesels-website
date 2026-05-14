"use client";
import { Product } from "@/types/product";

type Props = {
  product: Product;

  onClick?: () => void;
};

export default function ProductCard({
  product,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="
        border
        rounded-2xl
        overflow-hidden
        bg-white
        shadow-sm
        hover:shadow-md
        transition
        cursor-pointer
      "
    >
      {product.image && (
        <img
          src={product.image.src}
          alt={product.image.alt || product.name}
          className="
            w-full
            h-52
            object-cover
          "
        />
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold">
          {product.name}
        </h2>

        <p className="text-gray-500 mt-1">
          ${product.price}
        </p>

        {product.shortDescription && (
          <p className="text-sm text-gray-600 mt-2">
            {product.shortDescription}
          </p>
        )}
      </div>
    </div>
  );
}