export default function CheckoutCustomerForm() {
  const inputClass = `
    w-full
    border
    border-neutral-950
    bg-white
    px-4
    py-3
    text-sm
    outline-none
    placeholder:text-neutral-500
    focus:bg-[#f5f5f5]
  `;

  return (
    <section
      className="
        border-t
        border-neutral-950
        pt-8
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
          className={inputClass}
        />

        <input
          type="email"
          placeholder="Email Address"
          className={inputClass}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className={inputClass}
        />

        <textarea
          placeholder="Order Notes"
          className={`
            ${inputClass}
            min-h-[120px]
            resize-y
          `}
        />
      </div>
    </section>
  );
}