import Image from "next/image";

export default function AboutFeatureGrid() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Top-left: Dining image */}
        <div className="relative aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/features/family.png"
            alt="Fine dining table setting"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Top-right: Personal service copy */}
        <div
          className="relative flex min-h-[250px] items-center justify-center bg-[#6B4226] bg-cover bg-center px-8 py-10 md:aspect-[4/3] md:min-h-0 md:px-[60px]"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="text-center">
            <h2 className="font-barlow text-[1.4625rem] font-bold uppercase leading-tight tracking-[0.08em] text-white md:text-[1.755rem]">
              Locally Owned & Family Operated
            </h2>
            <p className="mt-4 font-zilla text-[1.17rem] font-medium leading-relaxed text-white/90">
            The Cohn Family began their success in San Diego, opening Iowa Meat Farms in 1982 and later purchasing Siesel's Meats. Their father, Phil Cohn, owned and ran grocery stores in the Midwest, and following in his footsteps, Ron, David, Aaron, and Helene Cohn opened Iowa Meat Farms and worked side by side. Through hard work, dedication, and a commitment to quality, they built a loyal customer base and a reputation for excellence.

That success became the foundation for creating and growing several outstanding businesses throughout San Diego. While they have expanded over the years, they have never forgotten their roots, working together as a family and taking pride in these great markets.
            </p>
          </div>
        </div>

        {/* Bottom-left: Master Meat Cutters copy */}
        <div
          className="relative flex min-h-[250px] items-center justify-center bg-[#8B6914] bg-cover bg-center px-8 py-10 md:aspect-[4/3] md:min-h-0 md:px-[60px]"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="text-center">
            <h2 className="font-barlow text-[1.4625rem] font-bold uppercase leading-tight tracking-[0.08em] text-white md:text-[1.755rem]">
              Master Meat Cutters Since 1968
            </h2><br />
            <h3 className="font-barlow text-[1.31625rem] font-bold  leading-tight tracking-[0.08em] text-white">
                 Real butchers, Real Service, Real Quality
            </h3>
            <p className="mt-4 font-zilla text-[1.17rem] font-medium leading-relaxed text-white/90">
           
Offering 100% Midwestern beef, USDA Prime and USDA upper two thirds Choice beef marbled to perfection.<br /><br />
At our markets, you&apos;ll find real butchers who take pride in their craft. We hand-cut steaks, prepare roasts, make specialty items, and provide the personalized service that only a true butcher shop can offer. Our experienced butchers are here to answer questions, offer cooking advice and custom cut your meat exactly the way you want it. It&apos;s the old fashioned quality, knowledge, and service that&apos;s becoming harder to find. Because we&apos;re not just selling the best meat you can buy, we&apos;re practicing the craft of butchery everyday.

            </p>
          </div>
        </div>

        {/* Bottom-right: Meat image */}
        <div className="relative aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/features/butcher.jpg"
            alt="Premium cuts of meat"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
