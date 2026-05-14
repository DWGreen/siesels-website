"use client";

import { useRouter }
  from "next/navigation";


  type Props = {
    onClearCart: () => void;
  };
export default function CartActions({ onClearCart }: Props) {

  const router =
    useRouter();

  return (

    <div
      className="
        mt-6
        space-y-4
      "
    >

      <button
        className="
          w-full
         
          border
          rounded-xl
          py-4
          font-semibold
          hover:opacity-90
          transition
        "
        onClick={() =>
          router.push("/sandwiches/checkout")
        }
      >
        Proceed to Checkout
      </button>

      <button
        onClick={onClearCart}
        className="
          w-full
          border
          rounded-xl
          py-4
          font-semibold
        "
      >
        Clear Cart
      </button>

    </div>
  );
}