import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export default function CookingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Cooking"
          backgroundImage="/images/hero/butcher.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
        />
        <section className="flex flex-1 items-center justify-center bg-brand-gray px-4 py-20 lg:py-32">
          <div className="text-center">
            <p className="font-body text-lg tracking-[0.2em] text-brand-dark lg:text-xl">
              Cooking content is coming soon. Check back for recipes and tips.
            </p>
          </div>
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
