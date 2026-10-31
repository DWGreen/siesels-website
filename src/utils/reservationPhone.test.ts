import { describe, expect, it } from "vitest";
import { normalizeReservationPhone } from "./reservationPhone";

describe("reservation phone normalization", () => {
  it.each(["(619) 555-1234", "619-555-1234", "619.555.1234", "6195551234", "1 619 555 1234", "+1 619 555 1234"])("normalizes %s", input => {
    expect(normalizeReservationPhone(input)).toBe("+16195551234");
  });
  it("supports explicit international numbers", () => {
    expect(normalizeReservationPhone("+44 20 7946 0018")).toBe("+442079460018");
  });
  it.each([undefined, null, "", "   "])("keeps blank phones optional: %s", input => {
    expect(normalizeReservationPhone(input)).toBe("");
  });
  it.each(["555-1234", "1234567890", "Call 6195551234", "6195551234 ext 25", "6195551234 / 8585551234", 6195551234, {}, "9".repeat(81)])("rejects invalid input: %s", input => {
    expect(normalizeReservationPhone(input)).toBeNull();
  });
});
