import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import AboutIntro from "@/components/sections/AboutIntro";
import AboutFeatureGrid from "@/components/sections/AboutFeatureGrid";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col gap-2">
        <InteriorHero
          title="About"
          backgroundImage="/images/hero/butcher.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
          showMasterLogo
        />
        <AboutIntro hideButton />
        <AboutFeatureGrid />
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
