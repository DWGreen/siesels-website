"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  leftNavItems,
  rightNavItems,
  socialLinks,
  type NavItem,
} from "@/lib/navigation";
import {
  InstagramIcon,
  FacebookIcon,
  CloseIcon,
} from "@/components/ui/Icons";

const iconMap = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const allNavItems: NavItem[] = [...leftNavItems, ...rightNavItems];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-brand-black transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="text-brand-white transition-colors hover:text-brand-wood"
            aria-label="Close menu"
          >
            <CloseIcon className="h-7 w-7" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-6">
          <ul className="space-y-1">
            {allNavItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block py-3 font-heading text-xl uppercase tracking-widest text-brand-white transition-colors hover:text-brand-wood"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-4 border-l border-brand-wood/30 pl-4">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="block py-2 font-body text-base text-brand-white/80 transition-colors hover:text-brand-wood"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Social icons */}
          <div className="mt-8 flex gap-6 border-t border-brand-white/10 pt-8">
            {socialLinks.map((social) => {
              const Icon = iconMap[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-brand-white transition-colors hover:text-brand-wood"
                >
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
