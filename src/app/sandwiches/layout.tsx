import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export const dynamic = "force-dynamic";

export default function SandwichesLayout({
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
                title="Sandwiches"
                backgroundImage="/images/hero/butcher.jpg"
                backgroundAlt="Butcher at work at Siesel's Meats"
              />
        {children}

      </main>

      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}