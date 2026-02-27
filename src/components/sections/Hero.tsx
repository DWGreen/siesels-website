import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden lg:h-[650px]">
      {/* Hero background image */}
      <Image
        src="/images/hero/hero_image.png"
        alt="Siesel's Meats butcher shop"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for extra contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* "EXPERT" row with logo and flanking lines */}
        <div className="relative flex items-center justify-center gap-3 lg:gap-5">
          {/* Logo positioned absolutely so it doesn't affect centering */}
          <Image
            src="/images/logos/logo_master-cutter.png"
            alt="Master Meat Cutters — I.M.S. — San Diego — Est 1968"
            width={160}
            height={160}
            className="absolute bottom-0 right-full mr-3 size-[80px] shrink-0 lg:mr-5 lg:size-[160px]"
          />
          <span className="hidden h-[2px] w-20 bg-white/80 sm:block lg:w-32" />
          <span className="font-heading text-2xl font-bold tracking-[0.3em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] sm:text-3xl lg:text-5xl">
            EXPERT
          </span>
          <span className="hidden h-[2px] w-20 bg-white/80 sm:block lg:w-32" />
        </div>

        {/* "BUTCHER SHOP" */}
        <h1 className="mt-3 font-heading text-5xl font-bold uppercase leading-none tracking-[0.15em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] sm:text-6xl lg:mt-4 lg:text-8xl">
          BUTCHER SHOP
        </h1>

        {/* Subheading */}
        <p className="mt-5 font-body text-lg font-bold tracking-[0.2em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] lg:mt-6 lg:text-2xl">
          SERVING SAN DIEGO SINCE 1968
        </p>
      </div>
    </section>
  );
}
