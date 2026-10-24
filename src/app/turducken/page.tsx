import ReservationNavigation from "@/components/reservations/ReservationNavigation";
import type { Metadata } from "next";
import Image from "next/image";
import { House } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import { reservationStoreLocations } from "@/data/storeLocations";

export const metadata: Metadata = {
  title: "Turducken | Iowa Meat Farms & Siesel's Meats",
  description: "Make turducken the centerpiece of your holiday table. Call Iowa Meat Farms or Siesel's Meats for availability, pricing, and pickup arrangements.",
};

const storePhones: Record<string, { display: string; href: string }> = {
  "siesels-meats": { display: "(619) 275-1234", href: "tel:+16192751234" },
  "iowa-meat-farms": { display: "(619) 281-5766", href: "tel:+16192815766" },
};

export default function TurduckenPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col bg-white">
        <InteriorHero title="Turducken" backgroundImage="/images/hero/turducken.webp" backgroundAlt="Holiday turkey centerpiece" showMasterLogo />
        <ReservationNavigation current="turducken" />
        <div className="relative flex-1 overflow-hidden bg-white px-5 py-10 text-neutral-950 sm:px-8 lg:py-14">
          <div className="relative mx-auto max-w-6xl">
            <header className="mb-7 border-b-2 border-[#2d2d2d] pb-6">
              <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
                <div>
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.24em] text-[#9d321e]">Holiday Orders</p>
                  <h2 className="mt-2 font-heading text-[35px] font-bold uppercase leading-tight sm:text-[41px]">Turducken Orders</h2>
                  <p className="mt-3 max-w-2xl font-serif text-sm leading-6 text-neutral-700">Bring something special to your holiday table. Call either store to ask about turducken availability, pricing, and pickup arrangements.</p>
                  <p className="mt-4 font-heading text-sm font-bold text-[#9d321e]">Turducken orders are taken by phone. Online reservations are not available.</p>
                </div>
                <Image src="/images/hand-drawn/turducken.webp" alt="Hand-drawn turkey illustration" width={520} height={300} className="mx-auto w-full max-w-sm object-contain md:justify-self-end" />
              </div>
              <ol className="mt-6 grid gap-4 border-t border-[#b8aa97] pt-5 sm:grid-cols-3">
                {[
                  ["01", "Choose your store", "Iowa Meat Farms or Siesel’s Meats"],
                  ["02", "Call to order", "Ask about availability and pricing"],
                  ["03", "Arrange your pickup", "Confirm the details with your store"],
                ].map(([number, title, caption]) => (
                  <li key={number} className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#9d321e] font-heading text-xs font-bold text-white">{number}</span>
                    <span><strong className="block font-heading text-xs font-bold uppercase tracking-[0.12em]">{title}</strong><span className="mt-1 block font-serif text-xs text-neutral-600">{caption}</span></span>
                  </li>
                ))}
              </ol>
            </header>
            <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
              <section aria-labelledby="turducken-details" className="border border-[#b8aa97] bg-[#faf8f3] p-4 sm:p-6">
                <h2 id="turducken-details" className="border-b border-[#b8aa97] pb-3 font-heading text-lg font-bold uppercase tracking-[0.12em]">Your Holiday Centerpiece</h2>
                <div className="mt-4 overflow-hidden">
                  <Image src="/images/holiday-meats/turducken-article-feature.webp" alt="Turducken for your holiday table" width={1232} height={928} sizes="(min-width: 1024px) 650px, 100vw" className="h-auto max-h-80 w-full object-contain object-top sm:max-h-96" />
                </div>
                <article className="space-y-7 pt-5">
                  <section>
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-[0.08em]">Handcrafted Turduckens</h3>
                    <span aria-hidden="true" className="mb-4 mt-2 block h-0.5 w-10 bg-[#9d321e]" />
                    <p className="font-serif text-base leading-7 text-neutral-700">Our turduckens are prepared by hand by our skilled butchers, who carefully nest a boneless chicken inside a boneless duck, then tuck both inside a turkey with layers of savory stuffing. Each one is assembled and tied with care, creating a mouthwatering holiday centerpiece filled with rich flavor and true butcher shop craftsmanship.</p>
                  </section>
                  <section>
                    <h3 className="font-heading text-2xl font-bold uppercase tracking-[0.08em]">Handcrafted Turducken Roll</h3>
                    <span aria-hidden="true" className="mb-4 mt-2 block h-0.5 w-10 bg-[#9d321e]" />
                    <p className="font-serif text-base leading-7 text-neutral-700">Our turducken roll brings together turkey, duck, chicken and savory stuffing in a convenient boneless roast, carefully rolled and tied by hand by our skilled butchers. Easy to carve and beautiful to serve, each slice delivers a delicious combination of flavors for a memorable holiday meal.</p>
                  </section>
                </article>
              </section>
              <aside aria-labelledby="call-store-title" className="border border-[#b8aa97] bg-[#faf8f3] p-5 sm:p-6">
                <h2 id="call-store-title" className="font-heading text-lg font-bold uppercase tracking-[0.12em]">Call Your Store</h2>
                <p className="mt-2 font-serif text-sm leading-6 text-neutral-700">Our staff can help with availability, pricing, and pickup details.</p>
                <div className="mt-5 space-y-5">
                  {reservationStoreLocations.map(store => (
                    <section key={store.id} aria-label={store.name} className="border border-[#d8cec0] bg-white p-5 text-center shadow-sm">
                      <House aria-hidden="true" strokeWidth={1.5} className="mx-auto mb-3 h-8 w-8 text-[#9d321e]" />
                      <h3 className="font-heading text-base font-bold uppercase tracking-[0.08em]">{store.name}</h3>
                      <p className="mt-2 font-serif text-sm leading-6 text-neutral-700">{store.address}<br />{store.cityStateZip}</p>
                      <a href={storePhones[store.id].href} aria-label={`Call ${store.name} at ${storePhones[store.id].display}`} className="mt-4 flex min-h-11 items-center justify-center bg-[#9d321e] px-4 py-3 font-heading text-lg font-bold tracking-wide text-white transition-colors hover:bg-[#762415] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e]">{storePhones[store.id].display}</a>
                    </section>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <div className="bg-footer-texture"><Footer /></div>
    </div>
  );
}
