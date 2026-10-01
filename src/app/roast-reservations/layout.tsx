import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export const dynamic = "force-dynamic";

export default function RoastReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main
        id="main-content"
        className="flex flex-1 flex-col"
      >
         <InteriorHero
                title="Roasts"
                backgroundImage="/images/hero/rib-roasts.jpg"
                backgroundAlt="Butcher at work at Siesel's Meats"
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