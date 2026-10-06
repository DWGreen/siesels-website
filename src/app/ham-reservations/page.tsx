import type { Metadata } from "next";
import HamReservationsClient from "@/components/ham-reservations/HamReservationsClient";
import { getHamReservationProducts, type HamReservationProduct } from "@/services/hamReservations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Holiday Ham Reservations | Siesel's Meats",
  description: "Reserve your holiday ham for pickup at Siesel's Meats or Iowa Meat Farms.",
};

export default async function HamReservationsPage() {
  let products: HamReservationProduct[] = [];
  try {
    products = await getHamReservationProducts();
  } catch (error) {
    console.error("Failed to load holiday ham reservation options:", error);
  }

  if (!products.length) {
    return (
      <div className="bg-white px-5 py-10 text-neutral-950 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 font-heading text-3xl font-bold uppercase">Holiday Ham Reservations</h2>
          <p role="status" className="border border-[#b8aa97] bg-[#faf8f3] p-6 font-serif text-sm">Holiday ham options are currently unavailable. Please check back soon.</p>
        </div>
      </div>
    );
  }

  return <HamReservationsClient products={products} />;
}