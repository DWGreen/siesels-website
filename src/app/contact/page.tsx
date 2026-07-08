import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Contact"
          backgroundImage="/images/hero/butcher.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
        />

        <section className="bg-white px-5 py-16 md:px-10 lg:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <p className="mb-3 font-heading text-xs font-bold tracking-[0.2em] text-brand-wood uppercase">
                Talk To The Team
              </p>
              <h2 className="mb-6 font-barlow text-4xl leading-[1.05] font-bold uppercase tracking-[0.05em] text-brand-black md:text-5xl">
                Questions, Catering Requests, or Product Availability?
              </h2>
              <p className="mb-5 max-w-xl font-body text-base leading-relaxed text-black/80">
                Send us a note and we will route it to the right location team.
                If your request is urgent, call the shop directly and we can help
                right away.
              </p>
              <div className="space-y-2 font-body text-sm text-black/75">
                <p>Iowa Meat Farms: (619) 281-5766</p>
                <p>Siesel&apos;s Meats: (619) 275-1234</p>
                <p>Email: info@bestmeatssandiego.com</p>
              </div>
            </div>

            <div className="border border-black/10 bg-[#f8f6f0] p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}
