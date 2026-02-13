import Link from "next/link";

export default function AboutIntro() {
  return (
    <section className="bg-brand-gray px-4 py-12 md:py-20">
      <div className="mx-auto max-w-[700px] text-center">
        {/* Decorative stars */}
        <div
          className="flex items-center justify-center gap-1.5 text-brand-black"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-xl">
              &#9733;
            </span>
          ))}
        </div>

        {/* Heading */}
        <h2 className="mt-6 font-serif text-2xl font-bold uppercase leading-tight text-brand-black md:text-4xl">
          Where San Diego&apos;s Serious Cooks Shop
        </h2>

        {/* Body text */}
        <p className="mt-6 font-body text-[15px] leading-[1.7] text-[#333]">
          Since debuting in San Diego&apos;s Bay Park community in 1968,
          Siesel&apos;s Old Fashioned Meats, alongside sister space Iowa Meat
          Farms, have catered to generations of home-cooking foodies and local
          gourmands for over 70 years combined. As two of San Diego&apos;s
          best-kept foodie secrets, our shops have earned a stout cult following
          by offering a familiar and friendly environment catering to all the
          senses.
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <Link
            href="/about"
            className="inline-block border-2 border-brand-black px-8 py-3 font-heading text-sm font-semibold uppercase tracking-widest text-brand-black transition-colors duration-200 hover:bg-brand-black hover:text-brand-white"
          >
            About Us &gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
