import { reservationOrderingWindows, ReservationOrderingWindow, ReservationType } from "@/data/storeLocations";

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
  const label = type === "turkey" ? "Turkey" : "Rib Roast";
  const validDate = (date: string | null) => {
    if (date === null) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  };
  const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

  if (!validDate(window.startDate) || !validDate(window.endDate) ||
    (window.startDate && window.endDate && window.startDate > window.endDate)) {
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