import Image from "next/image";
import Link from "next/link";

export default function FeatureGrid() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Row 1 - Left: Sandwich photo */}
        <div className="relative aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/features/sandwich.png"
            alt="Roast beef deli sandwich with greens on artisan bread, served on a wooden cutting board"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Row 1 - Right: Order Online CTA */}
        <div
          className="relative flex aspect-[3/2] md:aspect-[4/3] items-center justify-center bg-[#6B4226] bg-cover bg-center px-8 py-16 md:px-[60px]"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="text-center">
            <h2 className="font-barlow text-3xl font-bold uppercase leading-tight tracking-[0.1em] text-white md:text-[34px] md:leading-snug">
              Craving a Fresh-Prepared Deli Sandwich? Order Online for In-Store
              Pickup
            </h2>
            <div className="mt-8">
              <Link
                href="/order-online"
                className="btn-outline-white"
              >
                Order Online &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 - Left: Specials CTA (on mobile this comes AFTER blueberries) */}
        <div
          className="relative order-4 flex aspect-[3/2] md:aspect-[4/3] items-center justify-center bg-[#8B6914] bg-cover bg-center px-8 py-16 md:order-none md:px-[60px]"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="text-center">
            <h2 className="font-barlow text-3xl font-bold uppercase leading-tight tracking-[0.1em] text-white md:text-[34px] md:leading-snug">
              We&apos;ve Got Lots of Deals on Your Favorite Items!
            </h2>
            <div className="mt-8">
              <Link
                href="/specials"
                className="btn-outline-white"
              >
                View Specials &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 - Right: Blueberries photo (on mobile this comes BEFORE specials) */}
        <div className="relative order-3 aspect-[3/2] md:aspect-[4/3] md:order-none">
          <Image
            src="/images/features/blueberries.png"
            alt="Child's hands holding fresh blueberries over green grass"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
