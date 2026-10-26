import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { deliPlatters } from "@/data/deliPlatters";
import { reservationStoreLocations } from "@/data/storeLocations";
import InteriorHero from "@/components/sections/InteriorHero";

export const metadata: Metadata = {
  title: "Deli Meats & Gourmet Party Trays | Iowa Meat Farms & Siesel's Meats",
  description: "Make entertaining easy with deli sandwiches, premium meat and cheese platters, and veggie trays. Call Iowa Meat Farms or Siesel's Meats to order with 48 hours’ notice.",
};

const orderingStores = [
  { id: "iowa-meat-farms", phone: "(619) 281-5766", telephone: "+16192815766" },
  { id: "siesels-meats", phone: "(619) 275-1234", telephone: "+16192751234" },
];

export default function DeliMeatsPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex-1 bg-white text-neutral-950">
          <InteriorHero
                title="Party Platters"
                backgroundImage="/images/hero/platters_party.webp"
                backgroundAlt="Gourmet party trays from Siesel's Meats"
                showMasterLogo={true}
                mobileObjectPosition="20% center"
              />
        <section className="px-5 pb-10 pt-12 sm:px-8 lg:pb-12 lg:pt-16" aria-labelledby="platters-title">
          <div className="mx-auto max-w-3xl text-center">
            <p className="flex items-center justify-center gap-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-brand-black sm:gap-4 sm:tracking-[0.24em]">
              <span aria-hidden="true" className="shrink-0 leading-none">★</span>
              <span>Good food. Great company.</span>
              <span aria-hidden="true" className="shrink-0 leading-none">★</span>
            </p>
            <h2 id="platters-title" className="mt-4 font-heading text-4xl font-bold uppercase leading-tight tracking-[0.06em] sm:text-6xl">Gourmet Party Trays</h2>
            <p className="mt-5 font-serif text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              Make your next gathering delicious with party trays from Iowa Meat Farms and Siesel’s Meats.
              Our deli platters feature premium meats and artisan cheeses from Dietz &amp; Watson,
              a family-owned company crafting flavorful deli favorites since 1939. From savory deli meats
              and cheeses to brioche sandwiches and colorful vegetables, our platters make entertaining
              easy for family celebrations, office lunches and holiday get-togethers.
            </p>
            <span aria-hidden="true" className="mx-auto my-6 block h-0.5 w-12 bg-[#9d321e]" />
            <p className="font-serif text-base text-neutral-700">Choose your favorites below, then call your store to place an order.</p>
            <a href="#order" className="mt-5 inline-flex min-h-11 items-center justify-center bg-brand-black px-6 py-3 font-heading text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9d321e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e]">
              Call to Order <span aria-hidden="true" className="ml-3">↓</span>
            </a>
          </div>
        </section>

        <section aria-label="Party tray menu" className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 lg:pb-16">
          <ul className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {deliPlatters.map((platter, index) => (
              <li key={platter.slug}>
                <article aria-labelledby={`${platter.slug}-title`} className="flex h-full flex-col overflow-hidden border border-[#b8aa97] bg-[#faf8f3] p-3 transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none">
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <Image
                      src={`/images/platters/${platter.slug}.webp`}
                      alt={platter.title}
                      fill
                      sizes="(min-width: 1152px) 520px, (min-width: 768px) 50vw, 100vw"
                      className="object-contain"
                      priority={index < 2}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <h2 id={`${platter.slug}-title`} className="font-heading text-2xl font-bold uppercase tracking-[0.08em] text-brand-black">{platter.title}</h2>
                      <p className="font-heading text-xl font-bold text-[#9d321e]">{platter.price}</p>
                    </div>
                    <span aria-hidden="true" className="mb-4 mt-3 block h-0.5 w-10 bg-[#9d321e]" />
                    <p className="mb-6 font-serif text-base leading-7 text-brand-black">{platter.description}</p>
                    <div className="mt-auto">
                      <p className="mb-4 font-heading text-xs font-bold uppercase tracking-[0.12em] text-[#9d321e]">48-hour preorder required</p>
                      <a href="#order" aria-label={`Call store to order the ${platter.title}`} className="inline-flex min-h-11 items-center justify-center gap-3 bg-brand-black px-5 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#9d321e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e]">
                        Call Store to Place Order <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section id="order" aria-labelledby="order-title" className="relative isolate scroll-mt-8 overflow-hidden bg-[#422b1f] bg-[url('/images/textures/footer-bg.png')] bg-cover bg-center px-5 py-12 text-center text-white sm:px-8 lg:py-16">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/65" />
          <div className="mx-auto max-w-4xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#e4c791] sm:text-sm">Let us help with your next gathering</p>
            <h2 id="order-title" className="mt-4 font-heading text-3xl font-bold uppercase leading-tight tracking-[0.06em] sm:text-5xl">Call Your Store to Place an Order</h2>
            <p className="mt-4 font-heading text-base font-bold uppercase tracking-[0.12em]">Ask for the Deli Department</p>
            <div className="my-8 grid gap-5 sm:grid-cols-2">
              {orderingStores.map(store => {
                const location = reservationStoreLocations.find(location => location.id === store.id)!;
                return (
                  <section key={store.id} aria-label={location.name} className="border border-white/40 bg-black/15 px-4 py-7 sm:px-6">
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-[0.08em]">{location.name}</h3>
                    <a href={`tel:${store.telephone}`} className="mt-3 inline-flex min-h-11 items-center font-heading text-3xl font-bold tracking-wide underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{store.phone}</a>
                    <p className="mt-3 font-serif text-base leading-7">{location.address}<br />{location.cityStateZip}</p>
                  </section>
                );
              })}
            </div>
            <p className="font-serif text-lg font-bold">All party trays require a 48-hour preorder.</p>
          </div>
        </section>
      </main>
      <div className="bg-footer-texture"><Footer /></div>
    </div>
  );
}
