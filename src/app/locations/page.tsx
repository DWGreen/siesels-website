import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function LocationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <section className="flex flex-1 items-center justify-center bg-brand-gray px-4 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="font-heading text-5xl font-bold uppercase tracking-[0.15em] text-brand-black sm:text-6xl lg:text-8xl">
              Locations
            </h1>
            <p className="mt-6 font-body text-lg tracking-[0.2em] text-brand-dark lg:text-xl">
              Location details are coming soon. Check back for store hours and directions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
