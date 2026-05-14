import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import Locations from "@/components/sections/Locations";

export default function LocationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Locations"
          backgroundImage="/images/hero/butcher.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
        />
        <section className="flex flex-1 items-center justify-center bg-brand-gray px-4 py-20 lg:py-32">
          <Locations />
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
