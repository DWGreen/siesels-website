"use client";

import { House } from "lucide-react";
import { reservationStoreLocations } from "@/data/storeLocations";

type Props = {
  value: string;
  onChange: (storeId: string) => void;
  disabled?: boolean;
};

export default function PickupStoreSelector({ value, onChange, disabled = false }: Props) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="font-heading text-[10px] font-bold uppercase tracking-[0.15em]">Pickup Location</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {reservationStoreLocations.map(location => (
          <label key={location.id} className="relative block min-w-0 cursor-pointer">
            <input
              type="radio"
              name="storeLocationId"
              value={location.id}
              checked={value === location.id}
              onChange={() => onChange(location.id)}
              required
              className="peer sr-only"
            />
            <span className="flex aspect-square min-h-40 w-full min-w-0 flex-col items-center justify-center gap-2 border-2 border-neutral-300 bg-white px-2 py-3 text-center transition-colors hover:border-neutral-500 peer-checked:border-black peer-checked:bg-neutral-100 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
              <House aria-hidden="true" className={`h-7 w-7 shrink-0 ${value === location.id ? "text-black" : "text-neutral-400"}`} />
              <span className="font-heading text-xs font-bold uppercase leading-4 text-neutral-950">{location.name}</span>
              <span className="block font-body text-[11px] font-normal leading-4 text-neutral-600">
                <span className="block">{location.address}</span>
                <span className="block">{location.cityStateZip}</span>
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}