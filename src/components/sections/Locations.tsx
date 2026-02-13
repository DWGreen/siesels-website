const locations = [
  {
    name: "Iowa Meat Farms",
    address: "6041 Mission Gorge Rd, San Diego, CA 92120",
    phone: "(619) 281-5766",
    hours: "Mon-Sat 9am-6pm, Sun 9am-5pm",
    mapQuery: "6041+Mission+Gorge+Rd,San+Diego,CA+92120",
  },
  {
    name: "Siesel's Meats",
    address: "4131 Ashton Street, San Diego, CA 92109",
    phone: "(619) 275-1234",
    hours: "Mon-Sat 9am-7pm, Sun 9am-6pm",
    mapQuery: "4131+Ashton+Street,San+Diego,CA+92109",
  },
];

export default function Locations() {
  return (
    <section className="bg-brand-gray py-20">
      <div className="mx-auto max-w-[1100px] px-4">
        {/* Pin icon */}
        <div className="mb-4 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-8 w-8 text-brand-black"
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="mb-10 text-center font-serif text-[28px] font-bold uppercase leading-tight text-brand-black">
          Visit One of Our Two Locations
        </h2>

        {/* Location cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {locations.map((loc) => (
            <div
              key={loc.name}
              className="overflow-hidden rounded bg-white shadow-sm ring-1 ring-gray-200"
            >
              <iframe
                title={`Map of ${loc.name}`}
                src={`https://www.google.com/maps?q=${loc.mapQuery}&output=embed`}
                className="h-[200px] w-full md:h-[250px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="p-5 text-sm text-gray-700">
                <h3 className="mb-2 font-heading text-base font-bold uppercase tracking-wide text-brand-black">
                  {loc.name}
                </h3>
                <p>{loc.address}</p>
                <p>
                  Tel:{" "}
                  <a
                    href={`tel:${loc.phone.replace(/[^+\d]/g, "")}`}
                    className="underline hover:text-brand-black"
                  >
                    {loc.phone}
                  </a>
                </p>
                <p>Hours: {loc.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
