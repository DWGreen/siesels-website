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
        border
        rounded-2xl
        p-6
        bg-white
        shadow-sm
        sticky
        top-6
      "
    >

      <h2
        className="
          text-2xl
          font-semibold
          mb-6
        "
      >
        Order Summary
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Estimated Tax</span>

          <span>
            ${estimatedTax.toFixed(2)}
          </span>
        </div>

        <div
          className="
            border-t
            pt-4
            flex
            justify-between
            font-bold
            text-lg
          "
        >
          <span>Total</span>

          <span>
            ${estimatedTotal.toFixed(2)}
          </span>
        </div>

      </div>

    </section>
  );
}