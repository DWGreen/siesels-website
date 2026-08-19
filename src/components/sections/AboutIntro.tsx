import Link from "next/link";

interface AboutIntroProps {
  hideButton?: boolean;
}

export default function AboutIntro({ hideButton = false }: AboutIntroProps) {
  return (
    <section className="bg-white px-4 py-12 md:py-20">
      <div className="mx-auto max-w-[840px] text-center">
        {/* Decorative stars */}
    <h2 className="mx-auto mt-6 flex items-center justify-center gap-3 max-w-[700px] font-barlow text-[40px] font-bold uppercase leading-tight tracking-[0.15em] text-brand-black md:text-[45px]">
  <span className="text-2xl leading-none">★</span>
  <span>Since 1968</span>
  <span className="text-2xl leading-none">★</span>
</h2>

        {/* Heading */}
        <h2 className="mx-auto mt-6 max-w-[700px] font-barlow text-[40px] font-bold uppercase leading-tight tracking-[0.15em] text-brand-black md:text-[60px]">
          Where San Diego&apos;s Serious Cooks Shop
        </h2>

        {/* Body text */}
        <p className="mt-6 font-zilla text-[18px] font-medium leading-[1.5] text-[#333]">
          Since debuting in San Diego&apos;s Bay Park community in 1968, Siesel&apos;s Old Fashioned Meats, alongside our sister store Iowa Meat Farms, are well known throughout San Diego for carrying the “Best Meats in San Diego”. True to the core Butcher shops, with real butchers who take pride in their craft. We hand-cut steaks, prepare roasts, make specialty items, and provide the personalized service that only a true butcher shop can offer.
<br></br><br></br>
We also boast an award-winning deli providing gourmet sandwiches, our “Signature Famous”, handmade from scratch potato salad and baked beans,  gourmet sliced meats and a large variety of artisanal specialty cheese. Add farm-fresh produce, specialty grocery and an impressive wine selection, and you're sure to have everything you need for an overall gourmet experience.
    
        </p>

        {/* CTA Button */}
        {!hideButton && (
          <div className="mt-8">
            <Link
              href="/about"
              className="btn-outline-black"
            >
              About Us &gt;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
