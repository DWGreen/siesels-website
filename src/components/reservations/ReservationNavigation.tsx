"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bird, Drumstick, Beef, Utensils, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReservationType } from "@/data/storeLocations";

const pages = [
  { type: "turkey", icon: Bird, label: "Turkey", href: "/turkey-reservations" },
  { type: "ham", icon: Drumstick, label: "Ham", href: "/ham-reservations" },
  { type: "roast", icon: Beef, label: "Standing Rib Roast", href: "/roast-reservations" },
  { type: "turkey-breast", icon: Drumstick, label: "Turkey Breast", href: "/turkey-breast-reservations" },
  { type: "turducken", icon: Utensils, label: "Turducken", href: "/turducken" },
] as const;

export default function ReservationNavigation({ current }: { current: ReservationType | "turducken" }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [directions, setDirections] = useState({ left: false, right: false });
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const update = () => setDirections({
      left: element.scrollLeft > 1,
      right: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    });
    const revealCurrent = () => {
      const selected = element.querySelector<HTMLElement>('[aria-current="page"]');
      if (selected) {
        const viewport = element.getBoundingClientRect();
        const button = selected.getBoundingClientRect();
        if (button.left < viewport.left) element.scrollLeft += button.left - viewport.left;
        else if (button.right > viewport.right) element.scrollLeft += button.right - viewport.right;
      }
      update();
    };
    revealCurrent();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(revealCurrent);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };

  }, [current]);

  return (
    <nav aria-label="Holiday reservations" className="relative mt-[2px] w-full min-w-0 max-w-full bg-brand-black">
      <div ref={scrollRef} tabIndex={0} aria-label="Scroll holiday reservation links horizontally" className="w-full min-w-0 overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
      <ul className="mx-auto flex w-max min-w-max">
        {pages.map((page, index) => (
          <li key={page.type} className={`relative shrink-0 ${index > 0 ? "-ml-2.5" : ""}`}>
            <Link
              href={page.href}
              aria-current={page.type === current ? "page" : undefined}
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)",
              }}
              className={`inline-flex min-h-11 items-center justify-center gap-2 py-3 px-7 font-heading text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#9d321e] focus-visible:bg-[#9d321e] focus-visible:underline focus-visible:underline-offset-4 sm:text-sm ${page.type === current ? "bg-[#9d321e]" : "bg-brand-black"}`}
            >
              <page.icon aria-hidden="true" className="h-4 w-4 shrink-0 text-white" strokeWidth={1.75} />
              {page.label}
            </Link>
            <svg aria-hidden="true" viewBox="0 0 14 44" preserveAspectRatio="none" className="pointer-events-none absolute inset-y-0 left-0 h-full w-3.5 overflow-visible" fill="none">
              <path d="M-1 0L11 22L-1 44" stroke="white" strokeWidth="2" />
            </svg>
            {index === pages.length - 1 && (
              <svg aria-hidden="true" viewBox="0 0 14 44" preserveAspectRatio="none" className="pointer-events-none absolute inset-y-0 right-0 h-full w-3.5" fill="none">
                <path d="M2 0L14 22L2 44" stroke="white" strokeWidth="2" />
              </svg>
            )}
          </li>
        ))}
      </ul>
      </div>
      {directions.left && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center bg-gradient-to-r from-brand-black/75 via-brand-black/40 to-transparent pl-1 pr-4">
          <ScrollArrows direction="right" />
        </div>
      )}
      {directions.right && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-brand-black/75 via-brand-black/40 to-transparent pl-4 pr-1">
          <ScrollArrows direction="left" />
        </div>
      )}
    </nav>
  );
}

function ScrollArrows({ direction }: { direction: "left" | "right" }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <span role="img" aria-label={`Drag ${direction}`} className="flex items-center -space-x-1 text-white">
      {[0, 1, 2].map(index => (
        <Icon key={index} aria-hidden="true" className="reservation-scroll-arrow h-6 w-6" style={{ animationDelay: `${(direction === "right" ? index : 2 - index) * 400}ms` }} />
      ))}
    </span>
  );
}
