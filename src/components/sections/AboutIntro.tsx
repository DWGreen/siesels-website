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
          Iowa Meat Farms was opened in 1982 by the Cohn Family, who then purchased it’s sister store Siesels Old Fashioned Meats, which has been in the San Diego Bay Park Community since 1968. Both stores are well known for carrying the “Best Meats in San Diego”, and being true to the core butcher shops, with real butchers who take pride in their craft. We hand-cut steaks, prepare roasts, make specialty items, and provide the personalized service that only a true butcher shop can offer. We carry 100% Midwestern USDA Prime and USDA Choice Beef, prized for its exceptional quality, amazing marbling, and rich beef flavor. 

<br></br><br></br>
We also boast an award-winning deli providing gourmet sandwiches, our “Signature Famous”, handmade from scratch potato salad, baked beans, and gourmet dips. Our boneless netted turkey breast is roasted in our ovens for tender, juicy flavor, and our roast beef is smoked in our in-house smoker for a rich, smoky taste, both sliced fresh at our deli and packed with amazing flavor in every bite.
Add farm-fresh produce, specialty grocery and an impressive wine selection, and you're sure to have everything you need for an overall gourmet experience.
    
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
