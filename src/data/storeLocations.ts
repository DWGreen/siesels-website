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