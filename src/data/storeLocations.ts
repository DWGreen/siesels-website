export type ReservationStoreLocation = {
  id: string;
  name: string;
  reservationReportEmail: string | null;
};

export const reservationStoreLocations: ReservationStoreLocation[] = [
  { id: "siesels-meats", name: "Siesel's Meats", reservationReportEmail: null },
  { id: "iowa-meat-farms", name: "Iowa Meat Farms", reservationReportEmail: null },
];

export function getReservationStoreLocation(id: string | undefined) {
  return reservationStoreLocations.find(location => location.id === id) ?? null;
}

export type ReservationType = "turkey" | "roast";
export type ReservationOrderingWindow = {
  startDate: string | null;
  endDate: string | null;
};

export const reservationOrderingWindows: Record<ReservationType, ReservationOrderingWindow> = {
  turkey: { startDate: "2026-10-05", endDate: "2026-11-20" },
  roast: { startDate: "2026-10-05", endDate: "2026-11-20" },
};