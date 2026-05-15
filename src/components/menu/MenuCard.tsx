type Props = {
  product: any;
};

function getProductImage(product: any): string | undefined {
  return (
    product.images?.[0]?.src ??
    product.image?.src
  );
}

function getProductImageAlt(product: any): string {
  return (
    product.images?.[0]?.alt ??
    product.image?.alt ??
    product.name
  );
}

function formatPrice(price: any): string | null {
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

export default function MenuCard({
  product,
}: Props) {
  const imageSrc =
    getProductImage(product);

  const price =
    formatPrice(product.price);

  return (
    <div
      className="
        group
        cursor-pointer
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
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={getProductImageAlt(product)}
            className="
              h-48
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex
              h-48
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
              mt-1
              text-lg
              font-black
              tracking-[0.14em]
              text-neutral-950
            "
          >
            {price}
          </p>
        )}
      </div>
    </div>
  );
}