import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import SteakGrid from "@/components/steak-101/SteakGrid";

export default function Steak101Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Steak 101"
          backgroundImage="/images/hero/steak-101.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
        />
        <section className="flex flex-1 bg-white px-4 py-20 lg:py-32">
          <SteakGrid />
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
