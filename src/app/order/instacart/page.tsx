import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

const instacartUrl =
  process.env.NEXT_PUBLIC_INSTACART_STORE_URL ?? "https://www.instacart.com/store/siesels-meats-and-deli/storefront";

export default function InstacartOrderPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Order Online"
          backgroundImage="/images/hero/butcher.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
        />

        <section className="flex flex-1 bg-white px-4 py-20 lg:py-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8 text-center">
              <h2 className="font-barlow text-[36px] font-bold uppercase tracking-[0.12em] text-brand-black md:text-[44px]">
                Shop Siesel&apos;s On Instacart
              </h2>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-600">
                If the embedded view does not load, open Instacart in a new tab.
              </p>
            </div>

            <div className="border-2 border-neutral-900 bg-white p-3 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <div className="relative h-[70vh] min-h-[560px] w-full overflow-hidden border border-neutral-300 bg-neutral-100">
                <iframe
                  src={instacartUrl}
                  title="Siesel's Meats Instacart storefront"
                  className="h-full w-full"
                  loading="lazy"
                  allow="fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <div className="mt-4 flex justify-center">
                <a
                  href={instacartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-neutral-950 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                >
                  Open Instacart In New Tab
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
