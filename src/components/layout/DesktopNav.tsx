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
    <nav className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 lg:flex">
      {/* Left nav group */}
      <ul className="flex items-center gap-8">
        {leftNavItems.map((item) => (
          <li
            key={item.label}
            className={item.children ? "group relative" : ""}
          >
            {item.children ? (
              <>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 font-heading text-sm uppercase tracking-widest text-brand-white transition-colors hover:text-brand-wood"
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
                className="font-heading text-sm uppercase tracking-widest text-brand-white transition-colors hover:text-brand-wood"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Center logo */}
      <Link href="/" className="relative z-10 -mb-8 flex-shrink-0">
        <Image
          src="/images/logos/logo.png"
          alt="Siesel's Meats"
          width={100}
          height={100}
          className="h-20 w-auto object-contain lg:h-24"
          priority
        />
      </Link>

      {/* Right nav group + social icons */}
      <ul className="flex items-center gap-8">
        {rightNavItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="font-heading text-sm uppercase tracking-widest text-brand-white transition-colors hover:text-brand-wood"
            >
              {item.label}
            </Link>
          </li>
        ))}
        {socialLinks.map((social) => {
          const Icon = iconMap[social.icon];
          return (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-brand-white transition-colors hover:text-brand-wood"
              >
                <Icon className="h-5 w-5" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
