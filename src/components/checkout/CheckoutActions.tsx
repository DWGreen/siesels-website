"use client";

import { useRouter } from "next/navigation";

type Props = {
  onCheckout: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function CheckoutActions({
  onCheckout,
  disabled = false,
  isLoading = false,
}: Props) {
  const router = useRouter();

  return (
    <div
      className="
        mt-6
        space-y-3
      "
    >
      <button
        type="button"
        disabled={disabled || isLoading}
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
          disabled:cursor-not-allowed
          disabled:opacity-50
          disabled:hover:bg-neutral-950
          disabled:hover:text-white
        "
        onClick={onCheckout}
      >
        {isLoading
          ? "Preparing Checkout..."
          : "Continue To Payment"}
      </button>

      <button
        type="button"
        onClick={() =>
          router.push("/sandwiches/")
        }
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
        Continue Shopping
      </button>
    </div>
  );
}