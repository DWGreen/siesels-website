import Image from "next/image";

export default function AboutFeatureGrid() {
  return (
    <section>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {/* Top-left: Dining image */}
        <div className="relative aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/features/dinning.png"
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
            <h2 className="font-barlow text-xl font-bold uppercase leading-tight tracking-[0.08em] text-white md:text-2xl">
              Personal service&mdash; we know our customers by name
            </h2>
            <p className="mt-4 font-zilla text-sm font-medium leading-relaxed text-white/90 md:text-base">
              Here, our butchers know our many regulars by name and are always
              ready to put their encyclopedic knowledge of cuts and cooking
              techniques to work&mdash;but it&apos;s not all about the meat.
              Both venues feature thousands of square feet of retail space
              stocked to the rafters with top-notch produce, artisanal cheeses,
              gourmet condiments, old fashioned sodas, and the finest
              hard-to-find specialty items plucked from the local scene and
              beyond. Our stores regularly offer the ultimate culinary experience
              to every type of epicurean&mdash;from San Diego&apos;s premier
              professional chefs to the backyard BBQ masters.
            </p>
          </div>
        </div>

        {/* Bottom-left: Master Meat Cutters copy */}
        <div
          className="relative flex min-h-[250px] items-center justify-center bg-[#8B6914] bg-cover bg-center px-8 py-10 md:aspect-[4/3] md:min-h-0 md:px-[60px]"
          style={{ backgroundImage: "url('/images/textures/wood-dark.jpg')" }}
        >
          <div className="text-center">
            <h2 className="font-barlow text-xl font-bold uppercase leading-tight tracking-[0.08em] text-white md:text-2xl">
              Master Meat Cutters Since 1968
            </h2>
            <p className="mt-4 font-zilla text-sm font-medium leading-relaxed text-white/90 md:text-base">
              Both shops offer 300 various cuts of beef, Berkshire pork,
              free-range poultry, veal and lamb as well as fresh seafood and
              wild game. From hand-selected USDA Prime and Choice Midwestern
              beef to whole pigs, lambs and even rarer gems including alligator,
              rabbit, pheasant, wild boar, antelope, ostrich, venison, elk and
              American Style Kobe Beef&mdash; patrons will find one of the
              widest and most diverse selections of exotic meats available in
              San Diego.
            </p>
          </div>
        </div>

        {/* Bottom-right: Meat image */}
        <div className="relative aspect-[3/2] md:aspect-[4/3]">
          <Image
            src="/images/features/meat.png"
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
