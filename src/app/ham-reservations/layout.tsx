import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export const dynamic = "force-dynamic";

export default function HamReservationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Holiday Hams"
          backgroundImage="/images/hero/ham-hero.webp"
          backgroundAlt="Holiday ham from Siesel's Meats"
          showMasterLogo={true}
        />
        {children}
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}