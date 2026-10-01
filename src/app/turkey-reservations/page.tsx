import type { Metadata } from "next";
import TurkeyReservationsClient from "@/components/turkey-reservations/TurkeyReservationsClient";
import { getTurkeyReservationProducts } from "@/services/turkeyReservations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Turkey Reservations | Siesel's Meats",
  description: "Reserve a fresh turkey by weight range for pickup at Siesel's Meats.",
};

export default async function TurkeyReservationsPage() {
  const products = await getTurkeyReservationProducts();

  return <TurkeyReservationsClient products={products} />;
}