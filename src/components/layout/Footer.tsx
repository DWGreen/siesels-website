import Link from "next/link";
import { footerNavItems, socialLinks } from "@/lib/navigation";
import { InstagramIcon, FacebookIcon } from "@/components/ui/Icons";

const iconMap = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

export default function Footer() {
  return (
    <footer className="text-brand-white">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-16 md:pt-12 md:pb-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left column — social + nav links */}
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            {/* Social icons */}
            <div className="flex gap-5">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.icon];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-brand-white transition-opacity hover:opacity-60"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>

            {/* Navigation links */}
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col items-center gap-3 md:items-start">
                {footerNavItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-brand-white transition-opacity hover:opacity-60"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right column — newsletter signup */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-6 max-w-lg text-center font-barlow text-[30px] leading-snug font-bold uppercase tracking-[0.08em] text-brand-white md:text-left md:text-[34px]">
              Sign Up to Receive Weekly Specials, Promotions and More!
            </h3>

            <form className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                type="email"
                required
                placeholder="Enter Your Email Address"
                className="h-12 flex-1 border border-brand-white bg-transparent px-4 font-body text-sm text-brand-white placeholder:text-gray-400 focus:outline-none sm:rounded-none"
              />
              <button
                type="submit"
                className="h-12 bg-brand-white px-6 font-heading text-sm font-bold uppercase tracking-wider text-brand-black transition-opacity hover:opacity-80 sm:border-l sm:border-gray-300"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-center font-body text-[11px] text-[#999]">
          &copy;{new Date().getFullYear()} Iowa Meat Farms, Siesel&apos;s
          Meats, all rights reserved. Website by DW Green Company.
        </p>
      </div>
    </footer>
  );
}
