import ReservationStoreDialog from "@/components/reservations/ReservationStoreDialog";
import { getReservationStoreLocation } from "@/data/storeLocations";
import type { Metadata } from "next";
import TurkeyBreastReservationsClient from "@/components/turkey-breast-reservations/TurkeyBreastReservationsClient";
import { getTurkeyReservationProducts } from "@/services/turkeyReservations";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Turkey Breast Reservations | Siesel's Meats",
  description: "Reserve turkey breast by weight range for pickup at Siesel's Meats or Iowa Meat Farms.",
};

export default async function TurkeyBreastReservationsPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const params = await searchParams;
  const store = getReservationStoreLocation(params.store);
  if (!store) {
    return (
      <>
        <TurkeyBreastReservationsClient products={[]} awaitingStore />
        <ReservationStoreDialog />
      </>
    );
  }
  const products = await getTurkeyReservationProducts("turkey-breast", store?.id);
  return <TurkeyBreastReservationsClient key={store?.id ?? "legacy"} products={products} initialStoreLocationId={store?.id} />;
}