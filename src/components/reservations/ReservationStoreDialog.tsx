"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import PickupStoreSelector from "./PickupStoreSelector";
import { useAccessibleModal } from "@/hooks/useAccessibleModal";

export default function ReservationStoreDialog() {
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const modalRef = useAccessibleModal<HTMLElement>(true, () => router.push("/holiday-meats"));
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-5">
      <section ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="reservation-store-title" className="w-full max-w-lg border-2 border-neutral-950 bg-[#faf8f3] p-6 text-neutral-950">
        <h2 id="reservation-store-title" className="font-heading text-xl font-bold uppercase">Choose your pickup store</h2>
        <p className="my-4 font-serif text-sm">Availability is different at each store. Where would you like to pick up your reservation?</p>
        <form onSubmit={event => {
          event.preventDefault();
          if (!storeId) return;
          setLoading(true);
          router.push(`${pathname}?store=${encodeURIComponent(storeId)}`);
        }}>
          <PickupStoreSelector value={storeId} onChange={setStoreId} disabled={loading} />
          <button type="submit" disabled={!storeId || loading} className="mt-5 w-full bg-neutral-950 px-4 py-3 font-heading text-sm font-bold uppercase text-white disabled:opacity-40">{loading ? "Loading availability…" : "View available products"}</button>
        </form>
        <Link href="/holiday-meats" className="mt-4 inline-block underline">Back to holiday meats</Link>
      </section>
    </div>
  );
}
