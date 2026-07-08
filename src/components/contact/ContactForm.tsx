"use client";

import { FormEvent, useState } from "react";

import { ContactApiResponse } from "@/types/contact";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredLocation: "",
  subject: "",
  message: "",
  newsletterOptIn: false,
  website: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ContactApiResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as ContactApiResponse;
      setStatus(result);

      if (result.ok) {
        setFormData(initialState);
      }
    } catch {
      setStatus({
        ok: false,
        message: "We could not submit your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-brand-black">
            First Name
          </span>
          <input
            required
            type="text"
            value={formData.firstName}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, firstName: event.target.value }))
            }
            className="h-12 border border-black/20 bg-white px-3 font-body text-sm text-brand-black focus:border-brand-black focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-brand-black">
            Last Name
          </span>
          <input
            required
            type="text"
            value={formData.lastName}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, lastName: event.target.value }))
            }
            className="h-12 border border-black/20 bg-white px-3 font-body text-sm text-brand-black focus:border-brand-black focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-brand-black">
            Email
          </span>
          <input
            required
            type="email"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            className="h-12 border border-black/20 bg-white px-3 font-body text-sm text-brand-black focus:border-brand-black focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-brand-black">
            Phone
          </span>
          <input
            type="tel"
            value={formData.phone}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, phone: event.target.value }))
            }
            className="h-12 border border-black/20 bg-white px-3 font-body text-sm text-brand-black focus:border-brand-black focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-brand-black">
            Preferred Location
          </span>
          <select
            value={formData.preferredLocation}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                preferredLocation: event.target.value,
              }))
            }
            className="h-12 border border-black/20 bg-white px-3 font-body text-sm text-brand-black focus:border-brand-black focus:outline-none"
          >
            <option value="">No preference</option>
            <option value="Iowa Meat Farms">Iowa Meat Farms</option>
            <option value="Siesel's Meats">Siesel&apos;s Meats</option>
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-brand-black">
            Subject
          </span>
          <input
            type="text"
            value={formData.subject}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, subject: event.target.value }))
            }
            className="h-12 border border-black/20 bg-white px-3 font-body text-sm text-brand-black focus:border-brand-black focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-brand-black">
          Message
        </span>
        <textarea
          required
          minLength={10}
          rows={7}
          value={formData.message}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, message: event.target.value }))
          }
          className="border border-black/20 bg-white px-3 py-3 font-body text-sm text-brand-black focus:border-brand-black focus:outline-none"
        />
      </label>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={formData.newsletterOptIn}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              newsletterOptIn: event.target.checked,
            }))
          }
          className="mt-1 h-4 w-4 border border-black/30"
        />
        <span className="font-body text-sm text-black/80">
          I also want to receive specials and promotions.
        </span>
      </label>

      <label className="hidden" aria-hidden>
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, website: event.target.value }))
          }
          name="website"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 bg-brand-black px-8 font-heading text-sm font-bold uppercase tracking-[0.16em] text-brand-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Send Message"}
      </button>

      {status && (
        <p
          className={`font-body text-sm ${status.ok ? "text-green-700" : "text-red-700"}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
