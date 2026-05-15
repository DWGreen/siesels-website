type Props = {
  subtotal: number;
  estimatedTax: number;
  estimatedTotal: number;
};

export default function CheckoutSummary({
  subtotal,
  estimatedTax,
  estimatedTotal,
}: Props) {
  return (
    <section
      className="
        sticky
        top-6
        border-2
        border-neutral-950
        bg-[#e6e6e6]
        p-6
        text-neutral-950
      "
    >
      <h2
        className="
          mb-6
          text-xl
          font-black
          uppercase
          tracking-[0.25em]
        "
      >
        Order Summary
      </h2>

      <div
        className="
          space-y-4
          text-sm
          font-semibold
        "
      >
        <div
          className="
            flex
            justify-between
            gap-4
          "
        >
          <span
            className="
              uppercase
              tracking-[0.16em]
            "
          >
            Subtotal
          </span>

          <span>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div
          className="
            flex
            justify-between
            gap-4
          "
        >
          <span
            className="
              uppercase
              tracking-[0.16em]
            "
          >
            Estimated Tax
          </span>

          <span>
            ${estimatedTax.toFixed(2)}
          </span>
        </div>

        <div
          className="
            border-t
            border-neutral-950
            pt-4
            flex
            justify-between
            gap-4
            text-lg
            font-black
          "
        >
          <span
            className="
              uppercase
              tracking-[0.18em]
            "
          >
            Total
          </span>

          <span>
            ${estimatedTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}