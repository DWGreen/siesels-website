"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SpecialsImageViewer from "./SpecialsImageViewer";
import { SpecialsCategory } from "@/data/specials";

type Props = {
  categories: SpecialsCategory[];
  initialCategoryId?: string;
};

export default function SpecialsGallery({
  categories,
  initialCategoryId,
}: Props) {
  const resolveCategoryIndex = (categoryId?: string) => {
    if (!categoryId) {
      return 0;
    }

    const matchingIndex = categories.findIndex(
      (category) => category.id === categoryId
    );

    return matchingIndex >= 0 ? matchingIndex : 0;
  };

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(() =>
    resolveCategoryIndex(initialCategoryId)
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    setActiveCategoryIndex(resolveCategoryIndex(initialCategoryId));
    setActiveImageIndex(0);
  }, [categories, initialCategoryId]);

  const activeCategory = categories[activeCategoryIndex] ?? null;
  const activeImages = activeCategory?.images ?? [];
  const activeImage = activeImages[activeImageIndex] ?? null;
  const activeImageAspectRatio = activeImage
    ? imageAspectRatios[activeImage.src] ?? 4 / 5
    : 4 / 5;

  const selectedImage =
    isLightboxOpen && activeImage
      ? activeImage
      : null;

  if (categories.length === 0) {
    return (
      <div className="border-2 border-neutral-900 bg-neutral-100 p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
          No specials available right now.
        </p>
      </div>
    );
  }

  return (
    <>
      <nav
        className="mx-auto mb-10 w-full max-w-5xl border-y border-neutral-950 py-4"
        aria-label="Specials categories"
      >
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((category, index) => {
            const isActive = index === activeCategoryIndex;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setActiveCategoryIndex(index);
                  setActiveImageIndex(0);
                }}
                className={`
                  shrink-0
                  border
                  border-neutral-950
                  px-5
                  py-3
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.22em]
                  transition
                  ${
                    isActive
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-950 hover:bg-neutral-950 hover:text-white"
                  }
                `}
              >
                {category.title}
              </button>
            );
          })}
        </div>
      </nav>

      {activeCategory ? (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-heading text-3xl font-bold uppercase tracking-[0.1em] text-brand-black md:text-4xl">
                {activeCategory.title}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-600">
                {activeImageIndex + 1} of {activeImages.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveImageIndex(
                    activeImageIndex === 0
                      ? activeImages.length - 1
                      : activeImageIndex - 1
                  );
                }}
                aria-label="Previous special"
                className="flex h-12 w-12 items-center justify-center border border-neutral-950 bg-white text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                disabled={activeImages.length <= 1}
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveImageIndex(
                    activeImageIndex === activeImages.length - 1
                      ? 0
                      : activeImageIndex + 1
                  );
                }}
                aria-label="Next special"
                className="flex h-12 w-12 items-center justify-center border border-neutral-950 bg-white text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                disabled={activeImages.length <= 1}
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {activeImage ? (
            <div className="border-2 border-neutral-900 bg-white p-3">
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(true);
                }}
                className="group block w-full text-left"
              >
                <div
                  className="relative w-full overflow-hidden bg-neutral-200"
                  style={{
                    aspectRatio: `${activeImageAspectRatio}`,
                    maxHeight: "72vh",
                  }}
                >
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    className="object-contain transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 80rem"
                    onLoad={(event) => {
                      const { naturalWidth, naturalHeight } = event.currentTarget;

                      if (naturalWidth > 0 && naturalHeight > 0) {
                        const aspectRatio = naturalWidth / naturalHeight;

                        setImageAspectRatios((currentRatios) => {
                          if (currentRatios[activeImage.src] === aspectRatio) {
                            return currentRatios;
                          }

                          return {
                            ...currentRatios,
                            [activeImage.src]: aspectRatio,
                          };
                        });
                      }
                    }}
                  />
                </div>
              </button>

              <div className="mt-4 flex flex-col gap-4 border-t border-neutral-200 pt-4 md:flex-row md:items-center md:justify-between">
                <div className="text-left">
                  {activeImage.title ? (
                    <p className="font-heading text-xl font-bold uppercase tracking-[0.1em] text-brand-black">
                      {activeImage.title}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-neutral-600">
                    Click the page to open the full viewer
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(true);
                  }}
                  className="shrink-0 border border-neutral-950 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                >
                  View Full Ad
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-neutral-900 bg-neutral-100 p-8 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
                No specials available in this category.
              </p>
            </div>
          )}
        </div>
      ) : null}

      <SpecialsImageViewer
        image={selectedImage}
        heading={activeCategory?.title}
        onClose={() => {
          setIsLightboxOpen(false);
        }}
        onPrevious={
          activeImages.length > 1
            ? () =>
                setActiveImageIndex(
                  activeImageIndex === 0
                    ? activeImages.length - 1
                    : activeImageIndex - 1
                )
            : undefined
        }
        onNext={
          activeImages.length > 1
            ? () =>
                setActiveImageIndex(
                  activeImageIndex === activeImages.length - 1
                    ? 0
                    : activeImageIndex + 1
                )
            : undefined
        }
      />
    </>
  );
}