import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import SteakGrid from "@/components/steak-101/SteakGrid";
import Image from "next/image";

export default function Steak101Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Steak 101"
          backgroundImage="/images/hero/tri-tip-black.png"
          backgroundAlt="Butcher at work at Siesel's Meats"
        />
        
        <section className="flex flex-1 bg-white px-4 py-20 lg:py-32">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
            <div className="mb-10 w-full max-w-[840px] border-8 border-brand-gray bg-white p-2">
              <Image
                src="/images/features/cow.png"
                alt="Decorative cow illustration"
                width={520}
                height={180}
                className="h-auto w-full"
                sizes="(max-width: 840px) 100vw, 840px"
                priority
              />
            </div>
            <SteakGrid />
          </div>
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
