"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { RecipeSlide } from "@/types/recipeSlide";

type Props = {
  slides: RecipeSlide[];
};

export default function RecipeFeaturedSlideshow({
  slides,
}: Props) {
  const activeSlides = useMemo(
    () =>
      slides
        .filter(slide => slide.status !== "inactive")
        .sort(
          (a, b) =>
            (a.sortOrder ?? 999) -
            (b.sortOrder ?? 999)
        ),
    [slides]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (!activeSlides.length) {
    return null;
  }

  const activeSlide =
    activeSlides[activeIndex] ?? activeSlides[0];

  return (
    <section
      className="
        border-2
        border-neutral-900
        bg-white
      "
    >
      <div className="relative">
        <Link href={activeSlide.linkHref}>
          <img
            src={activeSlide.image}
            alt={
              activeSlide.imageAlt ??
              activeSlide.title
            }
            className="
              h-[360px]
              w-full
              object-cover
              md:h-[460px]
            "
          />
        </Link>

        {activeSlides.length > 1 && (
          <div
            className="
              absolute
              right-3
              top-3
              flex
              gap-1
            "
          >
            {activeSlides.map((slide, index) => {
              const isActive =
                index === activeIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() =>
                    setActiveIndex(index)
                  }
                  className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    border
                    border-neutral-900
                    text-xs
                    font-black
                    ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "bg-white text-neutral-900"
                    }
                  `}
                  aria-label={`Show slide ${
                    index + 1
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="
          grid
          border-t-2
          border-neutral-900
          md:grid-cols-[1fr_220px]
        "
      >
        <div
          className="
            bg-neutral-900
            p-5
            text-white
          "
        >
          {activeSlide.eyebrow && (
            <div
              className="
                mb-2
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-neutral-300
              "
            >
              {activeSlide.eyebrow}
            </div>
          )}

          <h2
            className="
              max-w-xl
              text-2xl
              font-black
              uppercase
              leading-tight
              tracking-wide
            "
          >
            {activeSlide.title}
          </h2>

          {(activeSlide.subtitle ||
            activeSlide.description) && (
            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-relaxed
                text-neutral-300
              "
            >
              {activeSlide.subtitle}
              {activeSlide.subtitle &&
                activeSlide.description &&
                " "}
              {activeSlide.description}
            </p>
          )}

          <Link
            href={activeSlide.linkHref}
            className="
              mt-4
              inline-block
              text-xs
              font-black
              uppercase
              tracking-[0.2em]
              underline
            "
          >
            {activeSlide.ctaLabel ?? "View More"}
          </Link>
        </div>

        <div
          className="
            bg-neutral-200
            p-4
            text-neutral-950
          "
        >
          <h3
            className="
              mb-3
              text-xs
              font-black
              uppercase
              tracking-[0.2em]
            "
          >
            {activeSlide.alsoNewTitle ??
              "Also New This Week"}
          </h3>

          {activeSlide.alsoNewLinks?.length ? (
            <ul className="space-y-2">
              {activeSlide.alsoNewLinks.map(link => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="
                      text-xs
                      font-bold
                      leading-tight
                      hover:underline
                    "
                  >
                    +{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-neutral-600">
              Check back soon for more featured
              recipes.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}