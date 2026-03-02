import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AboutIntro from "@/components/sections/AboutIntro";
import FeatureGrid from "@/components/sections/FeatureGrid";
import Locations from "@/components/sections/Locations";
import InstagramGallery from "@/components/sections/InstagramGallery";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col gap-2">
        <Hero />
        <AboutIntro />
        <FeatureGrid />
        <Locations />
      </main>
      <div className="bg-footer-texture">
        <InstagramGallery />
        <Footer />
      </div>
    </div>
  );
}
