import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteriorHero from "@/components/sections/InteriorHero";

export const metadata: Metadata = {
  title: "Events | Siesel's Meats",
  description:
    "Join Siesel's Meats for tastings, butcher demonstrations, and seasonal events in San Diego.",
};

type EventItem = {
  eyebrow?: string;
  title: string;
  date?: string;
  time?: string;
  schedules?: {
    date: string;
    time: string;
    location: string;
  }[];
  description: string;
  image: string;
  imageAlt: string;
};

const events: EventItem[] = [
  {
    eyebrow: "Tasting 1",
    title: "TURDUCKEN TASTING",
    date: "Saturday, November 7th, 2026",
    time: "11:00 AM - 3:00 PM",
    description:
      "Our turducken roll layers boneless chicken, duck, and turkey into one delicious holiday centerpiece. Handmade in-house by our skilled butchers, it brings together three savory favorites in every deli gravy and mashed potatoes!",
    image: "/images/events/turducken_1.jpg",
    imageAlt: "Siesel's butcher preparing a cut of meat",
  },
  {
    eyebrow: "Tasting 2",
    title: "SIESEL’S DOUBLE SMOKED HAM TASTING",
    date: "Sunday, November 8th, 2026",
    time: "11:00 AM - 3:00 PM",
    description:
      "Our Siesel’s Signature Double Smoked Ham starts with a premium bone-in Kruse ham, hand-scored and slow-smoked in our in-house smoker. The result is a juicy interior and a smoky, naturally glazed exterior. We’ll sample it with our famous homemade potato salad. Bring home this delicious centerpiece for your holiday table!",
    image: "/images/events/smoked_ham.jpg",
    imageAlt: "Steak cooking on a hot grill",
  },
  {
    eyebrow: "Tasting 3",
    title: "DIESTEL TURKEY SAMPLING",
    date: "Saturday ,November 14, 2026",
    time: "11:00 AM - 3:00 PM",
    description:
      "Join us for a taste of tender, juicy Diestel turkey, roasted to a beautiful golden brown and served with creamy garlic mashed potatoes and rich, savory gravy. It’s a delicious preview of your holiday feast!",
    image: "/images/events/smoked_ham.jpg",
    imageAlt: "Premium meat prepared for a special gathering",
  },
   {
    eyebrow: "Tasting 4",
    title: "CHARCUTERIE FOR THE HOLIDAYS!",
    schedules: [
      {
        date: "Saturday, November 21, 2026",
        time: "11:00 AM - 3:00 PM",
        location: "Iowa Meat Farms",
      },
      {
        date: "Sunday, November 22, 2026",
        time: "11:00 AM - 3:00 PM",
        location: "Siesel's Meats",
      },
    ],
    description:
      "Join us for a festive sampling of everything you need to create an amazing holiday board: artisan cheeses, premium cured meats, an olive medley, dried fruit, gourmet jams, and more. Discover your favorites and make holiday entertaining delicious!",
    image: "/images/events/charcuterie_1.jpg",
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
          backgroundImage="/images/hero/events_new.jpg"
          backgroundAlt="Butcher at work at Siesel's Meats"
          showMasterLogo={true}
          overlayOpacity={0}
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
                      {event.schedules && event.schedules.length > 0 ? (
                        <div className="mb-6 space-y-4 font-heading text-sm font-bold uppercase tracking-[0.12em] text-brand-wood">
                          {event.schedules.map((schedule) => (
                            <div key={`${schedule.date}-${schedule.location}`}>
                              <div className="flex flex-wrap gap-x-6 gap-y-2">
                                <span className="flex items-center gap-2">
                                  <CalendarDays aria-hidden="true" className="size-5" />
                                  {schedule.date}
                                </span>
                                <span className="flex items-center gap-2">
                                  <Clock aria-hidden="true" className="size-5" />
                                  {schedule.time}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <MapPin aria-hidden="true" className="size-5" />
                                {schedule.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-3 font-heading text-sm font-bold uppercase tracking-[0.12em] text-brand-wood">
                          {event.date ? (
                            <span className="flex items-center gap-2">
                              <CalendarDays aria-hidden="true" className="size-5" />
                              {event.date}
                            </span>
                          ) : null}
                          {event.time ? (
                            <span className="flex items-center gap-2">
                              <Clock aria-hidden="true" className="size-5" />
                              {event.time}
                            </span>
                          ) : null}
                        </div>
                      )}
                      {event.eyebrow ? (
                        <p className="mb-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-brand-wood sm:text-sm">
                          {event.eyebrow}
                        </p>
                      ) : null}
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