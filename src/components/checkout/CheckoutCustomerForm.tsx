export default function CheckoutCustomerForm() {

  return (

    <section>

      <h2
        className="
          text-2xl
          font-semibold
          mb-6
        "
      >
        Customer Information
      </h2>

      <div
        className="
          grid
          gap-4
        "
      >

        <input
          type="text"
          placeholder="Full Name"
          className="
            border
            rounded-lg
            p-3
          "
        />

        <input
          type="email"
          placeholder="Email Address"
          className="
            border
            rounded-lg
            p-3
          "
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="
            border
            rounded-lg
            p-3
          "
        />

        <textarea
          placeholder="Order Notes"
          className="
            border
            rounded-lg
            p-3
            min-h-[120px]
          "
        />

      </div>

    </section>
  );
}