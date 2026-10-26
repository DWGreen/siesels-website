import Image from "next/image";

const logos = {
  diestel: { src: "/images/logos/diestel_logo.png", alt: "Diestel Family Ranch", width: 720, height: 426 },
  kruse: { src: "/images/logos/kruse.webp", alt: "Kruse", width: 1254, height: 1254 },
  siesels: { src: "/images/logos/logo_older.png", alt: "Iowa Meat Farms & Siesel’s Meats", width: 800, height: 575 },
};

export default function MeatArticleLogo({ brand }: { brand: keyof typeof logos }) {
  return (
    <div className="mb-6 flex justify-center">
      <Image {...logos[brand]} alt={logos[brand].alt} sizes="180px" className="h-24 w-44 object-contain" />
    </div>
  );
}
