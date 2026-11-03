import ReservationNavigation from "@/components/reservations/ReservationNavigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export default function TurkeyBreastReservationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col bg-white">
        <InteriorHero title="Turkey Breast" backgroundImage="/images/hero/turkey-breast-hero.optimized-d930f98ca1.webp" backgroundAlt="Holiday turkey reservations" showMasterLogo={true} />
        <ReservationNavigation current="turkey-breast" />
        {children}
      </main>
      <div className="bg-footer-texture"><Footer /></div>
    </div>
  );
}