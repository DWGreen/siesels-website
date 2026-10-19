import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export default function TurkeyBreastReservationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero title="Turkey Breast" backgroundImage="/images/hero/turkey-breast-hero.jpg" backgroundAlt="Holiday turkey reservations" showMasterLogo={true} />
        {children}
      </main>
      <div className="bg-footer-texture"><Footer /></div>
    </div>
  );
}