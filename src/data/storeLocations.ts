export type ReservationStoreLocation = {
  id: string;
  name: string;
  address: string;
  cityStateZip: string;
  reservationReportEmail: string | null;
};

export const reservationStoreLocations: ReservationStoreLocation[] = [
  { id: "siesels-meats", name: "Siesel's Meats", address: "4131 Ashton Street", cityStateZip: "San Diego, CA 92109", reservationReportEmail: null },
  { id: "iowa-meat-farms", name: "Iowa Meat Farms", address: "6041 Mission Gorge Rd", cityStateZip: "San Diego, CA 92120", reservationReportEmail: null },
];

export function getReservationStoreLocation(id: string | undefined) {
  return reservationStoreLocations.find(location => location.id === id) ?? null;
}

export type ReservationType = "turkey" | "turkey-breast" | "roast" | "ham";
export type ReservationOrderingWindow = {
  startDate: string | null;
  endDate: string | null;
};

export const reservationOrderingWindows: Record<ReservationType, ReservationOrderingWindow> = {
  ham: { startDate: "2026-10-05", endDate: "2026-11-25" },
  turkey: { startDate: "2026-10-05", endDate: "2026-11-25" },
  "turkey-breast": { startDate: "2026-10-05", endDate: "2026-11-25" },
  roast: { startDate: "2026-10-05", endDate: "2026-11-25" },
};

export const reservationPickupWindows: Record<ReservationType, ReservationOrderingWindow> = {
  ham: { startDate: "2026-10-05", endDate: "2026-11-25" },
  turkey: { startDate: "2026-10-05", endDate: "2026-11-25" },
  "turkey-breast": { startDate: "2026-10-05", endDate: "2026-11-25" },
  roast: { startDate: "2026-10-05", endDate: "2026-11-25" },
};