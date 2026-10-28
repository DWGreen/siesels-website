import Image from "next/image";
import Link from "next/link";

export default function FeatureGrid() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Row 1 - Left: Sandwich photo */}
        <div className="relative order-1 md:order-none aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/ad-images/2026-10-28.webp"
            alt="Flanken Style Short Ribs weekly special"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Row 1 - Right: Order Online CTA */}
        <div
          className="relative order-2 md:order-none flex aspect-[3/2] md:aspect-[4/3] items-center bg-[#6B4226] bg-cover bg-center px-6 py-12 md:px-[60px] md:py-14"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="mx-auto max-w-[600px] text-center text-white">
            <p className="font-barlow text-sm font-semibold uppercase tracking-[0.14em] md:text-xl">
               100% Midwestern Beef, USDA Choice
            </p>
            <p className="mt-2 font-barlow text-xs font-semibold uppercase tracking-[0.11em] text-white/85 md:mt-3 md:text-base">
             Korean Style or Maui Marinated
            </p>
            <h2 className="mt-3 font-zilla text-[42px] font-semibold leading-[1.02] text-white md:text-[62px]">
              Flanken Style Short Ribs
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
          className="relative order-4 md:order-none flex aspect-[3/2] md:aspect-[4/3] items-center bg-[#8B6914] bg-cover bg-center px-6 py-12 md:px-[60px] md:py-14"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="mx-auto w-full max-w-[600px] text-center text-white">
             <p className="font-barlow text-sm font-semibold uppercase tracking-[0.14em] md:text-xl">
              Now Available
            </p>
            <h2 className="font-zilla text-[42px] font-semibold leading-[1.02] text-white md:text-[58px]">
              Reserve Your<br/> Holiday Meats Online!
            </h2>
              <p className="mx-auto mt-4 max-w-[38ch] font-body text-base leading-relaxed text-white/90 md:max-w-[42ch] md:text-lg">
              Reserve your holiday meats in advance to ensure you have the perfect centerpiece for your festive meals.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-8">
              <Link href="/holiday-meats" className="btn-outline-white px-10 py-3 text-[1.05rem] md:text-[1.15rem]">
              Holiday Meats &gt;
              </Link>
             
            </div>
          </div>
        </div>

        {/* Row 2 - Right: Steak photo (on mobile this comes BEFORE specials) */}
        <div className="relative order-3 md:order-none aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/features/holiday_meats_bonein.webp"
            alt="Holiday turkey on a wooden cutting board with festive decorations"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
     
      {/* Row 3 - Left: Sandwich photo */}
        <div className="relative order-5 md:order-none aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/events/charcuterie_1.jpg"
            alt="Charcuterie selection for our November events"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Row 3 - Right: Order Online CTA */}
        <div
          className="relative order-6 md:order-none flex aspect-[3/2] md:aspect-[4/3] items-center bg-[#6B4226] bg-cover bg-center px-6 py-12 md:px-[60px] md:py-14"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
         <div className="mx-auto max-w-[600px] text-center text-white">
            <p className="font-barlow text-sm font-semibold uppercase tracking-[0.14em] md:text-xl">
              Siesels & Iowa
            </p>
            <h2 className="mt-3 font-zilla text-[42px] font-semibold leading-[1.02] text-white md:text-[62px]">
              November Events
            </h2>
            <p className="mx-auto mt-4 max-w-[38ch] font-body text-base leading-relaxed text-white/90 md:max-w-[42ch] md:text-lg">
              Join us for a sampling of our curated charcuterie boards and delicious holiday meats!
            </p>
            <div className="mt-6 md:mt-8">
              <Link href="/events" className="btn-outline-white px-10 py-3 text-[1.05rem] md:text-[1.15rem]">
                Events &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Row 4 - Left: Specials CTA (on mobile this comes AFTER blueberries) */}
        <div
          className="relative order-8 md:order-none flex aspect-[3/2] md:aspect-[4/3] items-center bg-[#8B6914] bg-cover bg-center px-6 py-12 md:px-[60px] md:py-14"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="mx-auto w-full max-w-[600px] text-center text-white">
             <p className="font-barlow text-sm font-semibold uppercase tracking-[0.14em] md:text-xl">
             Good food. Great company.
            </p>
            <h2 className="font-zilla text-[42px] font-semibold leading-[1.02] text-white md:text-[58px]">
              Party Platters!
            </h2>
              <p className="mx-auto mt-4 max-w-[38ch] font-body text-base leading-relaxed text-white/90 md:max-w-[42ch] md:text-lg">
              We carry a variety of gourmet party trays, including deli sandwiches, Italian platters, and veggie assortments.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:mt-8">
              <Link href="/party-platters" className="btn-outline-white px-10 py-3 text-[1.05rem] md:text-[1.15rem]">
              Party Platters &gt;
              </Link>
             
            </div>
          </div>
        </div>

        {/* Row 2 - Right: Steak photo (on mobile this comes BEFORE specials) */}
        <div className="relative order-7 md:order-none aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/features/party-platters.webp"
            alt="Gourmet party trays from Siesel's Meats"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
 </div>

    </section>
  );
}
