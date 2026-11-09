import ReservationStoreDialog from "@/components/reservations/ReservationStoreDialog";
import { getReservationStoreLocation } from "@/data/storeLocations";
import type { Metadata } from "next";
import RoastReservationsClient from "@/components/roast-reservations/RoastReservationsClient";
import { getRoastReservationProducts } from "@/services/roastReservations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Standing Rib Roast Reservations | Siesel's Meats",
  description: "Reserve a standing rib roast by cut and grade for pickup at Siesel's Meats.",
};

export default async function RoastReservationsPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const params = await searchParams;
  const store = getReservationStoreLocation(params.store);
  if (!store) {
    return (
      <>
        <RoastReservationsClient products={[]} awaitingStore />
        <ReservationStoreDialog />
      </>
    );
  }
  const products = await getRoastReservationProducts(store?.id);
  return <RoastReservationsClient key={store?.id ?? "legacy"} products={products} initialStoreLocationId={store?.id} />;
}
