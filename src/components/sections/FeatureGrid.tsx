import Image from "next/image";
import Link from "next/link";

export default function FeatureGrid() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Row 1 - Left: Sandwich photo */}
        <div className="relative aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/ad-images/2026-09-11.jpg"
            alt="Roast beef deli sandwich with greens on artisan bread, served on a wooden cutting board"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Row 1 - Right: Order Online CTA */}
        <div
          className="relative flex aspect-[3/2] md:aspect-[4/3] items-center bg-[#6B4226] bg-cover bg-center px-6 py-12 md:px-[60px] md:py-14"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="mx-auto max-w-[600px] text-center text-white">
            <p className="font-barlow text-sm font-semibold uppercase tracking-[0.14em] md:text-xl">
              Hawaiian &amp; Assorted Flavors
            </p>
            <p className="mt-2 font-barlow text-xs font-semibold uppercase tracking-[0.11em] text-white/85 md:mt-3 md:text-base">
              USDA Choice, 100% Midwestern Angus Beef
            </p>
            <h2 className="mt-3 font-zilla text-[42px] font-semibold leading-[1.02] text-white md:text-[62px]">
              Marinated Tri-Tip
            </h2>
            <p className="mt-2 font-heading text-[38px] font-bold uppercase tracking-[0.08em] text-[#f6e3b0] md:mt-3 md:text-[50px]">
              $15.99 LB
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 md:mt-8">
              <Link href="/specials?tab=weekly" className="btn-outline-white px-10 py-3 text-[1.05rem] md:text-[1.15rem]">
                View Weekly Specials &gt;
              </Link>
              <Link href="/specials?tab=weekend" className="btn-outline-white px-10 py-3 text-[1.05rem] md:text-[1.15rem]">
                View Weekend Specials &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 - Left: Specials CTA (on mobile this comes AFTER blueberries) */}
        <div
          className="relative order-4 flex aspect-[3/2] md:aspect-[4/3] items-center bg-[#8B6914] bg-cover bg-center px-6 py-12 md:order-none md:px-[60px] md:py-14"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="mx-auto max-w-[600px] text-center text-white">
            <p className="font-barlow text-sm font-semibold uppercase tracking-[0.14em] md:text-xl">
              Charcuterie Tasting
            </p>
            <h2 className="mt-3 font-zilla text-[42px] font-semibold leading-[1.02] text-white md:text-[62px]">
              September 29th, 7PM
            </h2>
            <p className="mx-auto mt-4 max-w-[38ch] font-body text-base leading-relaxed text-white/90 md:max-w-[42ch] md:text-lg">
              Sip, sample, and savor handcrafted pairings from our butcher and deli teams. Expect house-cured favorites, artisan cheeses, and fresh seasonal bites.
            </p>
            <div className="mt-6 md:mt-8">
              <Link href="/events" className="btn-outline-white px-10 py-3 text-[1.05rem] md:text-[1.15rem]">
                Events &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 - Right: Steak photo (on mobile this comes BEFORE specials) */}
        <div className="relative order-3 aspect-[3/2] md:aspect-[4/3] md:order-none">
          <Image
            src="/images/events/charcuterie_1.jpg"
            alt="Assorted charcuterie board with meats, cheeses, and accompaniments"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
