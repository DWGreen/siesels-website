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
          placeholder="Full Name"
          className={inputClass}
          value={values.fullName}
          onChange={event =>
            onChange({ ...values, fullName: event.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email Address"
          className={inputClass}
          value={values.email}
          onChange={event =>
            onChange({ ...values, email: event.target.value })
          }
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className={inputClass}
          value={values.phone}
          onChange={event =>
            onChange({ ...values, phone: event.target.value })
          }
        />

        <input
          type="text"
          placeholder="Street Address"
          className={inputClass}
          value={values.address1}
          onChange={event =>
            onChange({ ...values, address1: event.target.value })
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="City"
            className={inputClass}
            value={values.city}
            onChange={event =>
              onChange({ ...values, city: event.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            className={inputClass}
            value={values.state}
            onChange={event =>
              onChange({ ...values, state: event.target.value })
            }
          />
          <input
            type="text"
            placeholder="ZIP Code"
            className={inputClass}
            value={values.postcode}
            onChange={event =>
              onChange({ ...values, postcode: event.target.value })
            }
          />
        </div>

        <textarea
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