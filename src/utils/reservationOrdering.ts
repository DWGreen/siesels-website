import { reservationOrderingWindows, reservationPickupWindows, ReservationOrderingWindow, ReservationType } from "@/data/storeLocations";

function validDate(date: string | null) {
  if (date === null) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function validWindow(window: ReservationOrderingWindow) {
  return validDate(window.startDate) && validDate(window.endDate) &&
    !(window.startDate && window.endDate && window.startDate > window.endDate);
}

export function getReservationOrderingStatus(
  type: ReservationType,
  now = new Date(),
  window: ReservationOrderingWindow = reservationOrderingWindows[type]
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (name: string) => parts.find(entry => entry.type === name)?.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const label = { turkey: "Diestel Turkey", "turkey-breast": "Turkey Breast", roast: "Rib Roast", ham: "Holiday Ham" }[type];
  const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

  if (!validWindow(window)) {
    return { isOpen: false, message: "Online ordering is temporarily unavailable." };
  }
  if (window.startDate && today < window.startDate) {
    return { isOpen: false, message: `Online Ordering Opens ${formatDate(window.startDate)}` };
  }
  if (window.endDate && today > window.endDate) {
    return { isOpen: false, message: `${label} Online Ordering Is Closed` };
  }
  return {
    isOpen: true,
    message: window.endDate ? `${label} Ordering Closes ${formatDate(window.endDate)}` : null,
  };
}

export function getReservationPickupDateBounds(
  type: ReservationType,
  now = new Date(),
  window: ReservationOrderingWindow = reservationPickupWindows[type]
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (name: string) => parts.find(entry => entry.type === name)?.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  if (!validWindow(window)) {
    return { minDate: "9999-12-31", maxDate: "0001-01-01" };
  }

  return {
    minDate: window.startDate && window.startDate > today ? window.startDate : today,
    maxDate: window.endDate ?? undefined,
  };
}

export function isReservationPickupDateAllowed(
  type: ReservationType,
  date: string,
  now = new Date(),
  window: ReservationOrderingWindow = reservationPickupWindows[type]
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false;

  const { minDate, maxDate } = getReservationPickupDateBounds(type, now, window);
  return date >= minDate && (!maxDate || date <= maxDate);
}