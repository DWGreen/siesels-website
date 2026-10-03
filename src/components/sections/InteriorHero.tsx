import Image from "next/image";

interface InteriorHeroProps {
  title: string;
  backgroundImage: string;
  backgroundAlt: string;
  showMasterLogo?: boolean;
  overlayOpacity?: number;
}

export default function InteriorHero({
  title,
  backgroundImage,
  backgroundAlt,
  showMasterLogo = false,
  overlayOpacity = 20,
}: InteriorHeroProps) {
  const normalizedOverlayOpacity = Math.min(Math.max(overlayOpacity, 0), 100);

  return (
    <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden lg:h-[650px]">
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt={backgroundAlt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: normalizedOverlayOpacity / 100 }}
      />

      {/* Title with decorative lines — always centered */}
      <div className="relative z-10 flex flex-col items-center px-4">
        <div className="relative mb-3 ml-4 sm:ml-6 lg:mb-4 lg:ml-8">
          {/* Mobile: logo sits beside the top line, mirroring the home hero's "EXPERT" row */}
          {showMasterLogo && (
            <Image
              src="/images/logos/logo_master-cutter.png"
              alt="Master Meat Cutters — I.M.S. — San Diego — Est 1968"
              width={160}
              height={160}
              className="absolute bottom-0 right-full mr-3 size-16 min-[360px]:mr-2 min-[360px]:size-20 lg:hidden"
            />
          )}
          <span className="block h-[2px] w-[11rem] bg-white/80 sm:w-60 lg:w-[22rem]" />
        </div>
        <div className="relative">
          {showMasterLogo && (
            <Image
              src="/images/logos/logo_master-cutter.png"
              alt="Master Meat Cutters — I.M.S. — San Diego — Est 1968"
              width={160}
              height={160}
              className="absolute bottom-0 right-full hidden lg:mr-5 lg:block lg:size-[192px]"
            />
          )}
          <h1 className="font-heading text-5xl font-bold uppercase leading-none tracking-[0.15em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] sm:text-6xl lg:text-8xl">
            {title}
          </h1>
        </div>
        <span className="mt-3 h-[2px] w-48 bg-white/80 sm:w-64 lg:mt-4 lg:w-96" />
      </div>
    </section>
  );
}
