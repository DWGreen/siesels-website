"use client";

import { Product }
  from "@/types/product";

type Props = {
  product: Product;
  selected: boolean;

  onToggle: () => void;
};

export default function BuilderOptionCard({
  product,
  selected,
  onToggle,
}: Props) {
console.log("product image:" , product.image?.src || "no image");
  return (
    <button
    onClick={onToggle}
      className={`
        relative
        border
        rounded-md
        p-4
        transition
        text-left
        

        ${
          selected
            ? "border-black ring-2 ring-black shadow-lg"
            : "border-gray-200 bg-white"
        }
      `}
    >

      {product.image && (
        <div
  className="
    w-full
    h-24
    overflow-hidden
  "
>
  <img
    src={product.image.src}
    alt={product.name}
    className="
      w-full
      h-full
      object-cover
    "
  />
</div>
      )}

      <div>

        <h3 className="font-semibold">
          {product.name}
         
        </h3>

       <p
  className="
    text-sm
    text-gray-500
    mt-1
  "
>
  {product.price !== null &&
   product.price !== undefined &&
   product.price !== "" &&
   !isNaN(Number(product.price))
    ? `$${product.price}`
    : null}
</p>
{selected && (
  <div
    className="
      absolute
      top-2
      right-2
      w-6
      h-6
      rounded-full
      bg-black
      text-dark 
      flex
      items-center
      justify-center
      text-sm
      font-bold
    "
  >
    ✓
  </div>
)}
      </div>

    </button>
  );
}