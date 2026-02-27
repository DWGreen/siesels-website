import Link from "next/link";

const instagramPhotos = [
  {
    id: 1,
    alt: "Holiday ham dinner spread",
    color: "from-amber-900 to-amber-800",
    label: "Holiday Ham",
  },
  {
    id: 2,
    alt: "Prime rib rack of lamb dinner",
    color: "from-red-900 to-red-800",
    label: "Prime Rib",
  },
  {
    id: 3,
    alt: "Iowa Meat Farms gift cards",
    color: "from-yellow-800 to-yellow-700",
    label: "Gift Cards",
  },
  {
    id: 4,
    alt: "Store interior and staff",
    color: "from-stone-700 to-stone-600",
    label: "Our Team",
  },
  {
    id: 5,
    alt: "Fresh cuts display",
    color: "from-rose-900 to-rose-800",
    label: "Fresh Cuts",
  },
];

export default function InstagramGallery() {
  return (
    <section className="bg-brand-dark py-12 md:py-20">
      <div>
        {/* Heading */}
        <h2 className="mb-8 px-4 text-center font-barlow text-lg font-bold tracking-[0.15em] text-brand-white md:mb-12 md:text-xl">
          FOLLOW US{" "}
          <Link
            href="https://www.instagram.com/bestmeatssandiego/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition-colors duration-200 hover:text-brand-wood"
          >
            @BESTMEATSSANDIEGO
          </Link>
        </h2>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5">
          {instagramPhotos.map((photo) => (
            <Link
              key={photo.id}
              href="https://www.instagram.com/bestmeatssandiego/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden"
            >
              {/* Placeholder gradient — replace with real images later */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${photo.color}`}
              />

              {/* Placeholder label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-xs uppercase tracking-widest text-white/40">
                  {photo.label}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40">
                <svg
                  className="h-8 w-8 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
