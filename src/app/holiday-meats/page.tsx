import type { Metadata } from "next";
import HolidayMeatCards from "@/components/holiday-meats/HolidayMeatCards";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export const metadata: Metadata = {
  title: "Holiday Meats | Siesel's Meats",
  description: "Explore holiday turkey, ham, turkey breast, standing rib roast, and turducken at Siesel's Meats.",
};

const holidayMeats = [
  {
    title: "Turkey",
    href: "/turkey-reservations",
    image: "/images/holiday-meats/turkey_with_logo.webp",
    description: "Whole turkeys, fresh and premium quality, perfect for your holiday table.",
  },
  {
    title: "Ham",
    href: "/ham-reservations",
    image: "/images/holiday-meats/ham_with_logo.webp",
    description: "Traditional and specialty hams, ready to make your holiday meal special.",
  },
  {
    title: "Standing Rib Roast",
    href: "/roast-reservations",
    image: "/images/holiday-meats/roast_with_logo.webp",
    description: "Premium bone-in rib roasts for an impressive and unforgettable holiday meal.",
  },
  {
    title: "Turkey Breast",
    href: "/turkey-breast-reservations",
    image: "/images/holiday-meats/breast_with_logo.webp",
    description: "Tender and flavorful turkey breasts, a delicious option for smaller gatherings.",
  },
  {
    title: "Turducken",
    href: "/turducken",
    image: "/images/holiday-meats/turducken_logo.webp",
    description: "A turkey, duck, and chicken centerpiece for your holiday table. Call your store to order.",
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
            <HolidayMeatCards meats={holidayMeats} />
          </div>
        </div>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
