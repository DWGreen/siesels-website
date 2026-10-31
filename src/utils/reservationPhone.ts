import parsePhoneNumber from "libphonenumber-js/max";

export const RESERVATION_PHONE_ERROR = "Enter a valid phone number with area code (or +country code), without an extension.";

/** Blank remains optional; null indicates an invalid supplied number. */
export function normalizeReservationPhone(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string" || value.length > 80) return null;
  const input = value.trim();
  if (!input) return "";
  // Accept familiar punctuation, but never extract a number from arbitrary text.
  if (!/^\+?[\d\s().-]+$/.test(input)) return null;
  const phone = parsePhoneNumber(input, { defaultCountry: "US", extract: false });
  return phone?.isValid() && !phone.ext ? phone.number : null;
}
