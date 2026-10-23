import Link from "next/link";
import { Bird, Drumstick, Beef, Utensils } from "lucide-react";
import type { ReservationType } from "@/data/storeLocations";

const pages = [
  { type: "turkey", icon: Bird, label: "Turkey", href: "/turkey-reservations" },
  { type: "ham", icon: Drumstick, label: "Ham", href: "/ham-reservations" },
  { type: "roast", icon: Beef, label: "Standing Rib Roast", href: "/roast-reservations" },
  { type: "turkey-breast", icon: Drumstick, label: "Turkey Breast", href: "/turkey-breast-reservations" },
  { type: "turducken", icon: Utensils, label: "Turducken", href: "/turducken" },
] as const;

export default function ReservationNavigation({ current }: { current: ReservationType | "turducken" }) {
  return (
    <nav aria-label="Holiday reservations" className="mt-[2px] bg-brand-black px-5 sm:px-8">
      <ul className="mx-auto flex w-fit max-w-full overflow-x-auto">
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
    </nav>
  );
}
