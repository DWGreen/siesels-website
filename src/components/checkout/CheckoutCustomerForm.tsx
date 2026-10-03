export interface CheckoutCustomerValues {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  notes: string;
}

type Props = {
  values: CheckoutCustomerValues;
  onChange: (values: CheckoutCustomerValues) => void;
};

export default function CheckoutCustomerForm({ values, onChange }: Props) {
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
          name="name"
          autoComplete="name"
          aria-label="Full name"
          placeholder="Full Name"
          className={inputClass}
          value={values.fullName}
          onChange={event =>
            onChange({ ...values, fullName: event.target.value })
          }
        />

        <input
          type="email"
          name="email"
          autoComplete="email"
          aria-label="Email address"
          placeholder="Email Address"
          className={inputClass}
          value={values.email}
          onChange={event =>
            onChange({ ...values, email: event.target.value })
          }
        />

        <input
          type="tel"
          name="tel"
          autoComplete="tel"
          aria-label="Phone number"
          placeholder="Phone Number"
          className={inputClass}
          value={values.phone}
          onChange={event =>
            onChange({ ...values, phone: event.target.value })
          }
        />

        <input
          type="text"
          name="address1"
          autoComplete="address-line1"
          aria-label="Street address"
          placeholder="Street Address"
          className={inputClass}
          value={values.address1}
          onChange={event =>
            onChange({ ...values, address1: event.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <input
            type="text"
            name="city"
            autoComplete="address-level2"
            aria-label="City"
            placeholder="City"
            className={`${inputClass} col-span-2 sm:col-span-1`}
            value={values.city}
            onChange={event =>
              onChange({ ...values, city: event.target.value })
            }
          />
          <input
            type="text"
            name="state"
            autoComplete="address-level1"
            aria-label="State"
            placeholder="State"
            className={inputClass}
            value={values.state}
            onChange={event =>
              onChange({ ...values, state: event.target.value })
            }
          />
          <input
            type="text"
            name="postcode"
            autoComplete="postal-code"
            inputMode="numeric"
            aria-label="ZIP code"
            placeholder="ZIP Code"
            className={inputClass}
            value={values.postcode}
            onChange={event =>
              onChange({ ...values, postcode: event.target.value })
            }
          />
        </div>

        <textarea
          name="notes"
          aria-label="Order notes"
          placeholder="Order Notes"
          className={`
            ${inputClass}
            min-h-[120px]
            resize-y
          `}
          value={values.notes}
          onChange={event =>
            onChange({ ...values, notes: event.target.value })
          }
        />
      </div>
    </section>
  );
}