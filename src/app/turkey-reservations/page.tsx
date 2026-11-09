import ReservationStoreDialog from "@/components/reservations/ReservationStoreDialog";
import { getReservationStoreLocation } from "@/data/storeLocations";
import type { Metadata } from "next";
import TurkeyReservationsClient from "@/components/turkey-reservations/TurkeyReservationsClient";
import { getTurkeyReservationProducts } from "@/services/turkeyReservations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Turkey Reservations | Siesel's Meats",
  description: "Reserve a fresh turkey by weight range for pickup at Siesel's Meats.",
};

export default async function TurkeyReservationsPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const params = await searchParams;
  const store = getReservationStoreLocation(params.store);
  if (!store) {
    return (
      <>
        <TurkeyReservationsClient products={[]} awaitingStore />
        <ReservationStoreDialog />
      </>
    );
  }
  const products = await getTurkeyReservationProducts("turkey", store?.id);

  return <TurkeyReservationsClient key={store?.id ?? "legacy"} products={products} initialStoreLocationId={store?.id} />;
}