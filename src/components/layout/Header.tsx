"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { MenuIcon } from "@/components/ui/Icons";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-wood-texture bg-brand-dark text-brand-white">
      {/* Desktop navigation */}
      <DesktopNav />

      {/* Mobile header bar */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <Link href="/">
          <Image
            src="/images/logos/siesels-logo.png"
            alt="Siesel's Meats"
            width={50}
            height={50}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-brand-white transition-colors hover:text-brand-wood"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
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
