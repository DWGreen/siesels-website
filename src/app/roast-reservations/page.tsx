import type { Metadata } from "next";
import RoastReservationsClient from "@/components/roast-reservations/RoastReservationsClient";
import { getRoastReservationProducts } from "@/services/roastReservations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Standing Rib Roast Reservations | Siesel's Meats",
  description: "Reserve a standing rib roast by cut and grade for pickup at Siesel's Meats.",
};

export default async function RoastReservationsPage() {
  const products = await getRoastReservationProducts();
  return <RoastReservationsClient products={products} />;
}
