"use client";

import { useRouter }
  from "next/navigation";

export default function CheckoutActions() {

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
      >
        Continue To Payment
      </button>

      <button
        onClick={() =>
          router.push("/sandwiches/menu")
        }
        className="
          w-full
          border
          rounded-xl
          py-4
          font-semibold
        "
      >
        Continue Shopping
      </button>

    </div>
  );
}