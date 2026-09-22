import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export const metadata: Metadata = {
  title: "Events | Siesel's Meats",
  description:
    "Join Siesel's Meats for tastings, butcher demonstrations, and seasonal events in San Diego.",
};

const events = [
  {
    title: "Steak 101: Meet the Butcher",
    date: "October 10, 2026",
    time: "11:00 AM - 1:00 PM",
    description:
      "Spend the morning at the butcher counter learning how to choose the right cut, what marbling really means, and how to get steakhouse results at home. Our butchers will share preparation tips and answer your questions along the way.",
    image: "/images/events/event1.jpg",
    imageAlt: "Siesel's butcher preparing a cut of meat",
  },
  {
    title: "Game Day Grill Tasting",
    date: "October 24, 2026",
    time: "11:00 AM - 2:00 PM",
    description:
      "Stop by for a taste of our game day favorites fresh off the grill. Sample house-made sausages, marinated meats, and crowd-ready sides while our team shares easy ideas for your next watch party.",
    image: "/images/events/event2.jpg",
    imageAlt: "Steak cooking on a hot grill",
  },
  {
    title: "Holiday Prime Rib Preview",
    date: "November 14, 2026",
    time: "12:00 PM - 2:00 PM",
    description:
      "Get a head start on holiday hosting with a guided prime rib tasting. Learn how much to order, how to season your roast, and the simple timing that delivers a memorable centerpiece every time.",
    image: "/images/events/event3.jpg",
    imageAlt: "Premium meat prepared for a special gathering",
  },
];

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex flex-1 flex-col">
        <InteriorHero
          title="Events"
          backgroundImage="/images/hero/events.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
          showMasterLogo={true}
          overlayOpacity={40}
        />

        <section aria-labelledby="events-heading" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-20">
            <div className="mb-4 flex justify-center">
              <CalendarDays aria-hidden="true" className="size-10 text-brand-black" />
            </div>
            <h2
              id="events-heading"
              className="text-center font-barlow text-[40px] font-bold uppercase leading-tight tracking-[0.12em] text-brand-black md:text-[50px]"
            >
              Upcoming Events
            </h2>
          </div>

          <div className="grid gap-2 bg-white px-2 pb-2">
            {events.map((event, index) => (
              <article key={event.title}>
                <div className="grid w-full items-stretch gap-2 lg:min-h-[430px] lg:grid-cols-2">
                  <div
                    className={`relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-full ${
                      index % 2 === 1 ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={event.image}
                      alt={event.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                  </div>

                  <div
                    className={`flex items-center px-6 py-12 sm:px-10 lg:px-16 lg:py-16 ${
                      index % 2 === 0 ? "bg-[#f4f1eb]" : "bg-white"
                    }`}
                  >
                    <div className="max-w-xl">
                      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-brand-wood">
                        <span className="flex items-center gap-2">
                          <CalendarDays aria-hidden="true" className="size-5" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock aria-hidden="true" className="size-5" />
                          {event.time}
                        </span>
                      </div>
                      <h3 className="font-barlow text-4xl font-bold uppercase leading-tight text-brand-black sm:text-5xl">
                        {event.title}
                      </h3>
                      <div className="my-6 h-0.5 w-16 bg-brand-wood" />
                      <p className="font-body text-base leading-8 text-brand-black/75 sm:text-lg">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <div className="bg-footer-texture">
        <Footer />
      </div>
    </div>
  );
}