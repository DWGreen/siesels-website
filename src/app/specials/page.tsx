export const metadata = { title: "Specials | Iowa Meat Farms & Siesel’s Meats" };

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import { specialsCategories } from "@/data/specials";
import SpecialsGallery from "@/components/specials/SpecialsGallery";

type SearchParams = {
  tab?: string;
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

const tabToCategoryId: Record<string, string> = {
  weekly: "weekly-specials",
  weekend: "weekend-two-day-only-specials",
};

export default async function SpecialsPage({ searchParams }: Props) {
  const params = await searchParams;
  const requestedTab = params?.tab?.toLowerCase();
  const initialCategoryId = requestedTab
    ? tabToCategoryId[requestedTab] ?? requestedTab
    : undefined;

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col bg-white text-neutral-950">
        <InteriorHero
          title="Specials"
          backgroundImage="/images/hero/butcher.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
          showMasterLogo={true}
        />
        <section className="px-5 pb-12 pt-12 sm:px-8 lg:pb-16 lg:pt-16" aria-labelledby="specials-title">
          <div className="mx-auto w-full max-w-6xl">
            <header className="mx-auto mb-8 max-w-3xl text-center">
              <p className="flex items-center justify-center gap-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-[#9d321e] sm:gap-4 sm:tracking-[0.24em]">
                <span aria-hidden="true" className="shrink-0 leading-none">★</span>
                <span>Quality cuts. Great value.</span>
                <span aria-hidden="true" className="shrink-0 leading-none">★</span>
              </p>
              <h2 id="specials-title" className="mt-4 font-heading text-4xl font-bold uppercase leading-tight tracking-[0.06em] sm:text-6xl">
                Fresh Finds &amp; Favorites
              </h2>
              <p className="mt-5 font-serif text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
                Explore the latest specials from Iowa Meat Farms and Siesel’s Meats.
                Browse our weekly and weekend ads to find something delicious for your table.
              </p>
              <span aria-hidden="true" className="mx-auto my-6 block h-0.5 w-12 bg-[#9d321e]" />
              <p className="font-serif text-base leading-7 text-neutral-700">Choose an ad below, then open the full viewer for a closer look.</p>
            </header>
            <SpecialsGallery
              categories={specialsCategories}
              initialCategoryId={initialCategoryId}
            />
          </div>
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
