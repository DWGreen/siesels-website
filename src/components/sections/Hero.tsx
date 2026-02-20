import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex h-[40vh] w-full items-center justify-center overflow-hidden lg:h-[50vh]">
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
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 lg:flex-row lg:gap-12">
        {/* Master Meat Cutters badge */}
        <Image
          src="/images/logos/logo_master-cutter.png"
          alt="Master Meat Cutters — I.M.S. — San Diego — Est 1968"
          width={120}
          height={120}
          className="size-[60px] shrink-0 lg:size-[120px]"
        />

        {/* Text block */}
        <div className="flex flex-col items-center text-center">
          {/* "EXPERT" with flanking lines */}
          <div className="flex w-full items-center justify-center gap-3 lg:gap-5">
            <span className="hidden h-px w-10 bg-white/70 sm:block lg:w-16" />
            <span className="font-heading text-sm tracking-[0.3em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] lg:text-lg">
              EXPERT
            </span>
            <span className="hidden h-px w-10 bg-white/70 sm:block lg:w-16" />
          </div>

          {/* "BUTCHER SHOP" */}
          <h1 className="mt-1 font-heading text-4xl font-bold uppercase leading-none tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] sm:text-5xl lg:mt-2 lg:text-7xl">
            BUTCHER SHOP
          </h1>

          {/* Subheading */}
          <p className="mt-3 font-body text-xs tracking-[0.2em] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] lg:mt-4 lg:text-sm">
            SERVING SAN DIEGO SINCE 1968
          </p>
        </div>
      </div>
    </section>
  );
}
