"use client";

import { Product } from "@/types/product";

type Props = {
  product: Product;

  onClick?: () => void;
};

function formatPrice(
  price: Product["price"]
): string | null {
  if (
    price === null ||
    price === undefined ||
    price === "" ||
    isNaN(Number(price))
  ) {
    return null;
  }

  return `$${Number(price).toFixed(2)}`;
}

export default function ProductCard({
  product,
  onClick,
}: Props) {
  const price =
    formatPrice(product.price);

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        block
        w-full
        text-left
      "
    >
      <div
        className="
          border-2
          border-neutral-900
          bg-[#e6e6e6]
          p-3
          transition
          group-hover:bg-white
        "
      >
        {product.image ? (
          <img
            src={product.image.src}
            alt={
              product.image.alt ||
              product.name
            }
            className="
              h-52
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-52
              w-full
              items-center
              justify-center
              bg-neutral-200
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-neutral-500
            "
          >
            No Image
          </div>
        )}
      </div>

      <div
        className="
          mt-4
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <h2
            className="
              text-xl
              font-black
              uppercase
              leading-tight
              tracking-[0.18em]
              text-neutral-950
            "
          >
            {product.name}
          </h2>

          {price && (
            <p
              className="
                shrink-0
                text-lg
                font-black
                tracking-[0.12em]
                text-neutral-950
              "
            >
              {price}
            </p>
          )}
        </div>

        {product.shortDescription && (
          <div
            className="
              mt-3
              text-xs
              italic
              leading-relaxed
              text-neutral-700
              line-clamp-3
            "
            dangerouslySetInnerHTML={{
              __html: product.shortDescription,
            }}
          />
        )}

        <div
          className="
            mt-4
            inline-flex
            border
            border-neutral-950
            px-4
            py-2
            text-xs
            font-black
            uppercase
            tracking-[0.22em]
            text-neutral-950
            transition
            group-hover:bg-neutral-950
            group-hover:text-white
          "
        >
          Customize
        </div>
      </div>
    </button>
  );
}