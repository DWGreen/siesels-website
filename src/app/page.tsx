import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AboutIntro from "@/components/sections/AboutIntro";
import FeatureGrid from "@/components/sections/FeatureGrid";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutIntro />
        <FeatureGrid />
      </main>
      <Footer />
    </div>
  );
}
