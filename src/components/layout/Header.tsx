"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { MenuIcon } from "@/components/ui/Icons";
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const revealFocus = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = document.activeElement;
        const header = headerRef.current;
        if (!(element instanceof HTMLElement) || !header ||
            header.contains(element) || element.closest('[role="dialog"], dialog') ||
            !element.matches(":focus-visible")) return;
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const top = Math.max(0, header.getBoundingClientRect().bottom) + 8;
        const banner = document.querySelector<HTMLElement>("#cc-main .cm");
        const bottom = Math.min(window.innerHeight,
          banner && banner.getClientRects().length
            ? banner.getBoundingClientRect().top : window.innerHeight) - 8;
        if (bottom <= top) return;
        // Scroll only; preserve the banner, page layout, and current focus.
        const delta = rect.top < top ? rect.top - top
          : rect.bottom > bottom ? Math.min(rect.bottom - bottom, rect.top - top) : 0;
        if (delta) window.scrollBy({ top: delta, behavior: "instant" });
      });
    };
    document.addEventListener("focusin", revealFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("focusin", revealFocus);
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-wood-texture bg-brand-dark text-brand-white lg:border-b-8 lg:border-white">
      {/* Desktop navigation */}
      <DesktopNav />

      {/* Mobile header bar */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <Link href="/">
          <div className="relative">
            <Image
              src="/images/logos/logo-background.png"
              alt=""
              width={70}
              height={70}
              className="absolute inset-0 h-full w-full scale-110 object-contain"
              aria-hidden="true"
            />
            <Image
              src="/images/logos/logo.png"
              alt="Siesel's Meats"
              width={70}
              height={70}
              className="relative z-10 h-16 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="-mr-2 flex size-11 items-center justify-center text-brand-white transition-colors hover:text-brand-wood"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <MenuIcon className="h-7 w-7" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
