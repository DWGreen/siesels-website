"use client";

import { useRouter } from "next/navigation";

type Props = {
  onClearCart: () => void;
};

export default function CartActions({
  onClearCart,
}: Props) {
  const router =
    useRouter();

  return (
    <div
      className="
        mt-6
        space-y-3
      "
    >
      <button
        type="button"
        className="
          w-full
          border
          border-neutral-950
          bg-neutral-950
          px-5
          py-4
          text-xs
          font-black
          uppercase
          tracking-[0.25em]
          text-white
          transition
          hover:bg-white
          hover:text-neutral-950
        "
        onClick={() =>
          router.push("/sandwiches/checkout")
        }
      >
        Proceed To Checkout
      </button>

      <button
        type="button"
        onClick={onClearCart}
        className="
          w-full
          border
          border-neutral-950
          px-5
          py-4
          text-xs
          font-black
          uppercase
          tracking-[0.25em]
          text-neutral-950
          transition
          hover:bg-neutral-950
          hover:text-white
        "
      >
        Clear Cart
      </button>
    </div>
  );
}