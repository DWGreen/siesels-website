export default function Hero() {
  return (
    <section className="relative flex h-[60vh] w-full items-center justify-center overflow-hidden lg:h-[85vh]">
      {/* Dark placeholder background — replace with next/image once asset is ready */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-dark to-brand-black" />

      {/* Overlay for extra contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 lg:flex-row lg:gap-12">
        {/* Master Meat Cutters badge */}
        <div className="flex size-[60px] shrink-0 items-center justify-center rounded-full border-2 border-white/80 lg:size-[120px] lg:border-[3px]">
          <div className="flex size-[50px] items-center justify-center rounded-full border border-white/40 lg:size-[100px]">
            <svg
              viewBox="0 0 200 200"
              className="size-[46px] lg:size-[94px]"
              aria-label="Master Meat Cutters — I.M.S. — San Diego — Est 1968"
            >
              {/* Circular text path */}
              <defs>
                <path
                  id="badge-circle"
                  d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
                />
              </defs>
              <text
                fill="white"
                fontSize="15"
                fontWeight="600"
                letterSpacing="3"
                className="uppercase"
              >
                <textPath href="#badge-circle" startOffset="0%">
                  MASTER MEAT CUTTERS • I.M.S. • SAN DIEGO • EST 1968 •
                </textPath>
              </text>
              {/* Center star/dot */}
              <text
                x="100"
                y="108"
                textAnchor="middle"
                fill="white"
                fontSize="28"
                fontWeight="bold"
              >
                ★
              </text>
            </svg>
          </div>
        </div>

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
