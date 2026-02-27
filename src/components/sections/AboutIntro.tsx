import Link from "next/link";

export default function AboutIntro() {
  return (
    <section className="bg-brand-gray px-4 py-12 md:py-20">
      <div className="mx-auto max-w-[840px] text-center">
        {/* Decorative stars */}
        <div
          className="flex items-center justify-center gap-1.5 text-brand-black"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-2xl">
              &#9733;
            </span>
          ))}
        </div>

        {/* Heading */}
        <h2 className="mx-auto mt-6 max-w-[700px] font-barlow text-[40px] font-bold uppercase leading-tight tracking-[0.15em] text-brand-black md:text-[60px]">
          Where San Diego&apos;s Serious Cooks Shop
        </h2>

        {/* Body text */}
        <p className="mt-6 font-zilla text-[18px] font-medium leading-[1.5] text-[#333]">
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
            className="btn-outline-black"
          >
            About Us &gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
