import { describe, expect, it } from "vitest";
import { reservationPickupWindows, type ReservationType } from "@/data/storeLocations";
import { getReservationOrderingStatus, getReservationPickupDateBounds, isReservationPickupDateAllowed } from "./reservationOrdering";

const window = { startDate: "2026-11-01", endDate: "2026-11-20" };

describe("reservation ordering windows", () => {
  it("bounds pickup dates by the pickup window and Pacific today", () => {
    expect(getReservationPickupDateBounds("turkey", new Date("2026-10-14T18:00:00Z")))
      .toEqual({ minDate: "2026-10-14", maxDate: reservationPickupWindows.turkey.endDate ?? undefined });
    expect(getReservationPickupDateBounds("turkey", new Date("2026-10-01T18:00:00Z")))
      .toEqual({ minDate: reservationPickupWindows.turkey.startDate, maxDate: reservationPickupWindows.turkey.endDate ?? undefined });
  });

  it.each<ReservationType>(["turkey", "turkey-breast", "roast", "ham"])("keeps ordering and pickup windows independent for %s", type => {
    const now = new Date("2026-11-19T20:00:00Z");
    const pickupWindow = { startDate: "2026-11-23", endDate: "2026-11-26" };
    expect(getReservationOrderingStatus(type, now, window).isOpen).toBe(true);
    expect(getReservationPickupDateBounds(type, now, pickupWindow))
      .toEqual({ minDate: "2026-11-23", maxDate: "2026-11-26" });
    expect(isReservationPickupDateAllowed(type, "2026-11-22", now, pickupWindow)).toBe(false);
    expect(isReservationPickupDateAllowed(type, "2026-11-23", now, pickupWindow)).toBe(true);
    expect(isReservationPickupDateAllowed(type, "2026-11-26", now, pickupWindow)).toBe(true);
    expect(isReservationPickupDateAllowed(type, "2026-11-27", now, pickupWindow)).toBe(false);
    expect(getReservationOrderingStatus(type, new Date("2026-11-21T20:00:00Z"), window).isOpen).toBe(false);
  });

  it("supports unbounded pickup windows and uses Pacific today", () => {
    const now = new Date("2026-11-21T07:59:59Z");
    expect(getReservationPickupDateBounds("turkey", now, { startDate: null, endDate: null }))
      .toEqual({ minDate: "2026-11-20", maxDate: undefined });
    expect(isReservationPickupDateAllowed("turkey", "2026-11-19", now, { startDate: null, endDate: null })).toBe(false);
  });

  it("rejects all pickup dates when pickup configuration is invalid", () => {
    for (const invalidWindow of [
      { startDate: "2026-02-30", endDate: null },
      { startDate: null, endDate: "Nov 26" },
      { startDate: "2026-11-27", endDate: "2026-11-23" },
    ]) {
      expect(isReservationPickupDateAllowed("ham", "2026-11-25", new Date("2026-11-19T20:00:00Z"), invalidWindow)).toBe(false);
    }
  });

  it("rejects pickup dates outside the configured window or invalid calendar dates", () => {
    const now = new Date("2026-10-14T18:00:00Z");
    const { minDate, maxDate } = getReservationPickupDateBounds("turkey", now);
    const dayAfterMax = new Date(`${maxDate}T00:00:00Z`);
    dayAfterMax.setUTCDate(dayAfterMax.getUTCDate() + 1);
    expect(isReservationPickupDateAllowed("turkey", "2026-10-13", now)).toBe(false);
    expect(isReservationPickupDateAllowed("turkey", minDate, now)).toBe(true);
    expect(isReservationPickupDateAllowed("turkey", maxDate!, now)).toBe(true);
    expect(isReservationPickupDateAllowed("turkey", dayAfterMax.toISOString().slice(0, 10), now)).toBe(false);
    expect(isReservationPickupDateAllowed("turkey", "2026-02-30", now)).toBe(false);
  });

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
      .toEqual({ isOpen: true, message: "Diestel Turkey Ordering Closes Nov 20" });
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