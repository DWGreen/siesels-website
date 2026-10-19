import type { Metadata } from "next";
import TurkeyBreastReservationsClient from "@/components/turkey-breast-reservations/TurkeyBreastReservationsClient";
import { getTurkeyReservationProducts } from "@/services/turkeyReservations";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Turkey Breast Reservations | Siesel's Meats",
  description: "Reserve turkey breast by weight range for pickup at Siesel's Meats or Iowa Meat Farms.",
};

export default async function TurkeyBreastReservationsPage() {
  const products = await getTurkeyReservationProducts("turkey-breast");
  return <TurkeyBreastReservationsClient products={products} />;
}