"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { MenuIcon } from "@/components/ui/Icons";
import CookieConsent from "react-cookie-consent";
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-wood-texture bg-brand-dark text-brand-white lg:border-b-8 lg:border-white">
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
      <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
    </header>
  );
}
