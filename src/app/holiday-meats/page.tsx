import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export const metadata: Metadata = {
  title: "Holiday Meats | Siesel's Meats",
  description: "Reserve your holiday turkey, ham, turkey breast, or standing rib roast at Siesel's Meats.",
};

const holidayMeats = [
  {
    title: "Turkey",
    href: "/turkey-reservations",
    image: "/images/holiday-meats/turkey.webp",
    description: "Whole turkeys, fresh and premium quality, perfect for your holiday table.",
  },
  {
    title: "Ham",
    href: "/ham-reservations",
    image: "/images/holiday-meats/ham.webp",
    description: "Traditional and specialty hams, ready to make your holiday meal special.",
  },
  {
    title: "Turkey Breast",
    href: "/turkey-breast-reservations",
    image: "/images/holiday-meats/breast.webp",
    description: "Tender and flavorful turkey breasts, a delicious option for smaller gatherings.",
  },
  {
    title: "Standing Rib Roast",
    href: "/roast-reservations",
    image: "/images/holiday-meats/roast.webp",
    description: "Premium bone-in rib roasts for an impressive and unforgettable holiday meal.",
  },
];

export default function HolidayMeatsPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Holiday Meats"
          backgroundImage="/images/hero/holiday-meats.webp"
          backgroundAlt="Holiday meats from Siesel's Meats"
          showMasterLogo={true}
        />
        <div className="bg-white px-5 py-10 text-neutral-950 sm:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <header className="mb-8 text-center">
              <p className="flex items-center justify-center gap-4 font-heading text-xs font-bold uppercase tracking-[0.24em] text-[#9d321e]">
                <span aria-hidden="true" className="h-px w-12 bg-[#9d321e] sm:w-24" />
                Reserve Your Holiday Favorites
                <span aria-hidden="true" className="h-px w-12 bg-[#9d321e] sm:w-24" />
              </p>
              <h2 className="mt-3 font-heading text-4xl font-bold uppercase tracking-[0.08em] sm:text-5xl">The Holiday Table</h2>
              <p className="mx-auto mt-3 max-w-xl font-serif text-base leading-6 text-neutral-700 sm:text-lg">
                From whole turkeys to premium roasts, reserve the perfect centerpiece for your holiday meal.
              </p>
            </header>
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {holidayMeats.map((meat) => (
                <li key={meat.href}>
                  <Link
                    href={meat.href}
                    className="group flex h-full flex-col overflow-hidden border border-[#b8aa97] bg-[#faf8f3] p-3 transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg focus-visible:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9d321e] motion-reduce:transition-none motion-reduce:hover:scale-100"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={meat.image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5 text-sm font-medium text-gray-700">
                      <h3 className="mb-2 font-heading text-xl font-bold uppercase tracking-[0.1em] text-brand-black">{meat.title}</h3>
                      <span aria-hidden="true" className="mb-3 block h-0.5 w-10 bg-[#9d321e]" />
                      <p className="mb-5 font-serif text-base leading-6 text-brand-black">{meat.description}</p>
                      <span className="mt-auto inline-flex min-h-11 items-center self-start bg-brand-black px-5 font-heading text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors group-hover:bg-[#9d321e]">
                        Order Now &gt;
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
