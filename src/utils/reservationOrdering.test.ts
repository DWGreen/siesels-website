import { describe, expect, it } from "vitest";
import { getReservationOrderingStatus } from "./reservationOrdering";

const window = { startDate: "2026-11-01", endDate: "2026-11-20" };

describe("reservation ordering windows", () => {
  it("preserves open ordering when no dates are configured", () => {
    expect(getReservationOrderingStatus("turkey", new Date(), { startDate: null, endDate: null }))
      .toEqual({ isOpen: true, message: null });
  });

  it("announces the opening date before the window", () => {
    expect(getReservationOrderingStatus("turkey", new Date("2026-10-31T19:00:00Z"), window))
      .toEqual({ isOpen: false, message: "Online Ordering Opens Nov 1" });
  });

  it("opens on the start date in Pacific time", () => {
    expect(getReservationOrderingStatus("turkey", new Date("2026-11-01T07:00:00Z"), window))
      .toEqual({ isOpen: true, message: "Turkey Ordering Closes Nov 20" });
  });

  it("keeps ordering open through the final Pacific calendar day", () => {
    expect(getReservationOrderingStatus("roast", new Date("2026-11-21T07:59:59Z"), window))
      .toEqual({ isOpen: true, message: "Rib Roast Ordering Closes Nov 20" });
    expect(getReservationOrderingStatus("roast", new Date("2026-11-21T08:00:00Z"), window))
      .toEqual({ isOpen: false, message: "Rib Roast Online Ordering Is Closed" });
  });

  it("supports a start-only or end-only window", () => {
    expect(getReservationOrderingStatus("turkey", new Date("2026-10-31T19:00:00Z"), { ...window, endDate: null }).isOpen).toBe(false);
    expect(getReservationOrderingStatus("turkey", new Date("2026-10-31T19:00:00Z"), { ...window, startDate: null }).isOpen).toBe(true);
  });

  it("fails closed for invalid or reversed configured dates", () => {
    for (const invalidWindow of [
      { startDate: "2026-02-30", endDate: null },
      { startDate: "Nov 1", endDate: null },
      { startDate: "2026-11-21", endDate: "2026-11-20" },
    ]) {
      expect(getReservationOrderingStatus("turkey", new Date(), invalidWindow).isOpen).toBe(false);
    }
  });
});