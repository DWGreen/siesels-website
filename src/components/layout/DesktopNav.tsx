import Link from "next/link";
import Image from "next/image";
import { leftNavItems, rightNavItems, socialLinks } from "@/lib/navigation";
import {
  InstagramIcon,
  FacebookIcon,
  ChevronDownIcon,
} from "@/components/ui/Icons";

const iconMap = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
} as const;

export default function DesktopNav() {
  return (
    <nav className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-6 lg:flex">
      {/* Left nav group */}
      <ul className="flex flex-1 items-center gap-8">
        {leftNavItems.map((item) => (
          <li
            key={item.label}
            className={item.children ? "group relative" : ""}
          >
            {item.children ? (
              <>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 font-heading text-[15px] font-bold uppercase tracking-[0.13em] text-brand-white transition-colors hover:text-[#f8f0c6]"
                >
                  {item.label}
                  <ChevronDownIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                {/* Dropdown */}
                <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded bg-brand-dark py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 font-body text-sm text-brand-white transition-colors hover:bg-brand-wood hover:text-brand-white"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Link
                href={item.href}
                className="font-heading text-[15px] font-bold uppercase tracking-[0.13em] text-brand-white transition-colors hover:text-[#f8f0c6]"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Center logo */}
      <Link href="/" className="relative z-10 -mb-24 flex-shrink-0">
        <div className="relative">
          <Image
            src="/images/logos/logo-background.png"
            alt=""
            width={140}
            height={140}
            className="absolute inset-0 h-full w-full scale-110 object-contain"
            aria-hidden="true"
          />
          <Image
            src="/images/logos/logo.png"
            alt="Siesel's Meats"
            width={140}
            height={140}
            className="relative z-10 h-32 w-auto object-contain lg:h-36"
            priority
          />
        </div>
      </Link>

      {/* Right nav group + social icons */}
      <ul className="flex flex-1 items-center justify-end gap-8">
        {rightNavItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="font-heading text-[15px] font-bold uppercase tracking-[0.13em] text-brand-white transition-colors hover:text-[#f8f0c6]"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="flex items-center gap-3">
          {socialLinks.map((social) => {
            const Icon = iconMap[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-brand-white transition-colors hover:text-[#f8f0c6]"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </li>
      </ul>
    </nav>
  );
}
