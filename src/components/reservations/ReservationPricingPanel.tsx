import Image from "next/image";

type Props = {
  title: string;
  brand?: string;
  unit?: "LB" | "EA";
  price?: string;
  prices?: Array<{ label: string; price: string }>;
  image: string;
  imageAlt: string;
  imageSide?: "left" | "right";
};

export default function ReservationPricingPanel({ title, brand, price, prices, image, imageAlt, imageSide = "left", unit = "LB" }: Props) {
  return (
    <section aria-label={`${title} pricing`} className="col-span-full grid overflow-hidden sm:h-[280px] sm:grid-cols-2">
      <div className={`relative h-48 sm:h-full ${imageSide === "right" ? "sm:order-2" : ""}`}>
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 576px" className="object-cover object-top" />
      </div>
      <div
        className="flex h-[280px] items-center justify-center bg-[#6B4226] bg-cover bg-center px-6 py-4 text-center text-white sm:h-full"
        style={{ backgroundImage: "url('/images/textures/wood-dark.optimized-911ef429f4.webp')" }}
      >
        <div className="w-full">
          {brand && <p className="font-barlow text-[1.05rem] font-semibold uppercase tracking-[0.2em] text-white/85">{brand}</p>}
          <h2 className="mt-1 font-zilla text-[2.25rem] font-semibold leading-tight sm:text-[2.7rem]">{title}</h2>
          {prices ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {prices.map(option => (
                <div key={option.label}>
                  <p className="font-barlow text-sm font-semibold uppercase tracking-[0.08em] text-white/85 lg:text-base">{option.label}</p>
                  <p className="mt-2 whitespace-nowrap font-heading text-[1.8rem] font-bold text-[#f6e3b0] lg:text-[2.4rem]">{option.price}<span className="ml-1 text-sm">{unit}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 font-heading text-[2.7rem] font-bold uppercase tracking-[0.08em] text-[#f6e3b0]">{price}<span className="ml-2 text-[1.5rem]">{unit}</span></p>
          )}
          <p className="mt-3 font-body text-[0.9rem] text-white/90">Payment is handled at pickup.</p>
        </div>
      </div>
    </section>
  );
}
