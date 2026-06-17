"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { steaks, SteakEntry } from "@/data/steaks";

export default function SteakGrid() {
  const [active, setActive] = useState<SteakEntry | null>(null);

  const cuts = steaks.filter((s) => s.category === "cut");
  const info = steaks.filter((s) => s.category === "info");

  return (
    <>
      {/* ── Steak Cuts ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-4 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 -960 960 960"
            width="40px"
            fill="#000000"
          >
            <path d="M446.33-80q-13 0-25.66-4.67-12.67-4.66-22-14.66l-299.34-300q-10-9.34-14.83-21.84T79.67-446q0-12.33 4.83-25t14.83-22.67l366-366.33q9-9 21.67-14.5 12.67-5.5 26-5.5h300.33q27.67 0 47.17 19.5t19.5 47.17v299.66q0 13.34-5.33 25.5Q869.33-476 860.33-467l-367 367.67q-9.33 10-22 14.66-12.66 4.67-25 4.67ZM710-656q22.33 0 38.5-16.17 16.17-16.16 16.17-38.5 0-22.33-16.17-38.5-16.17-16.16-38.5-16.16t-38.5 16.16q-16.17 16.17-16.17 38.5 0 22.34 16.17 38.5Q687.67-656 710-656Z" />
          </svg>
        </div>

        <h2 className="mb-10 text-center font-barlow text-[40px] font-bold uppercase leading-tight tracking-[0.12em] text-brand-black md:text-[50px]">
          The Cuts
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cuts.map((steak) => (
            <SteakCard key={steak.id} steak={steak} onClick={setActive} />
          ))}
        </div>

        {/* ── Reference Info ────────────────────────────────────────────── */}
        <h2 className="mb-10 mt-24 text-center font-barlow text-[40px] font-bold uppercase leading-tight tracking-[0.12em] text-brand-black md:text-[50px]">
          Good To Know
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {info.map((entry) => (
            <SteakCard key={entry.id} steak={entry} onClick={setActive} />
          ))}
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6"
          onClick={() => setActive(null)}
        >
          {/* dot-grid texture */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-25
              [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.18)_1px,transparent_1px)]
              [background-size:18px_18px]
            "
          />

          <div
            className="
              relative
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              border
              border-white/40
              bg-[#1f1f1f]
              p-6
              shadow-[0_0_0_6px_rgba(255,255,255,0.06)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* header bar */}
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/25 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/60">
                  Siesel&rsquo;s Meats
                </p>
                <h2 className="mt-1 font-barlow text-2xl font-bold uppercase tracking-[0.12em] text-white sm:text-3xl">
                  {active.name}
                </h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-white/50">
                  {active.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="
                  mt-1
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  border
                  border-white/60
                  bg-transparent
                  text-white
                  transition
                  hover:bg-white
                  hover:text-black
                "
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* image */}
            {active.image ? (
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden border border-white/20 bg-neutral-800">
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            ) : null}

            {/* body */}
            <div className="space-y-4">
              {active.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="whitespace-pre-line text-sm leading-relaxed text-white/85"
                >
                  {para}
                </p>
              ))}
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Click outside to close
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SteakCard({
  steak,
  onClick,
}: {
  steak: SteakEntry;
  onClick: (s: SteakEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(steak)}
      className="
        group
        border-2
        border-neutral-900
        bg-white
        p-3
        text-left
        transition
        hover:-translate-y-1
        hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]
      "
    >
      {/* card image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
        {steak.image ? (
          <Image
            src={steak.image}
            alt={steak.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-200">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
              No image
            </span>
          </div>
        )}
      </div>

      {/* card text */}
      <div className="p-2 pt-3">
        <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.35em] text-neutral-400">
          {steak.category === "cut" ? "Steak Cut" : "Reference"}
        </span>

        <h3 className="font-barlow text-xl font-bold uppercase tracking-[0.1em] text-brand-black">
          {steak.name}
        </h3>

        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-600">
          {steak.tagline}
        </p>

        <span className="mt-4 block text-[10px] font-black uppercase tracking-[0.28em] text-neutral-400 transition group-hover:text-brand-black">
          Learn more &rsaquo;
        </span>
      </div>
    </button>
  );
}
