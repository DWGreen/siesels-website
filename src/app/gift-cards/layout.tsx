export const metadata = { title: "Gift Cards | Iowa Meat Farms & Siesel’s Meats" };

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export default function GiftCardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Gift Cards"
          backgroundImage="/images/hero/gift-cards.jpg"
          backgroundAlt="Siesel's gift cards"
        />
        {children}
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}