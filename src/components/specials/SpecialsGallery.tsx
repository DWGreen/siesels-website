"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SpecialsImageViewer from "./SpecialsImageViewer";
import SpecialsTextAlternative from "./SpecialsTextAlternative";
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
      <div className="border border-[#b8aa97] bg-[#faf8f3] p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
          No specials available right now.
        </p>
      </div>
    );
  }

  return (
    <>
      <nav
        className="mx-auto mb-8 w-full max-w-5xl border-y border-[#b8aa97] py-4"
        aria-label="Specials categories"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
          {categories.map((category, index) => {
            const isActive = index === activeCategoryIndex;

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActiveCategoryIndex(index);
                  setActiveImageIndex(0);
                }}
                className={`min-h-11 border px-5 py-3 font-heading text-sm font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e] motion-reduce:transition-none ${
                  isActive
                    ? "border-brand-black bg-brand-black text-white"
                    : "border-[#b8aa97] bg-[#faf8f3] text-brand-black hover:border-[#9d321e] hover:bg-[#9d321e] hover:text-white"
                }`}
              >
                {category.title}
              </button>
            );
          })}
        </div>
      </nav>

      {activeCategory ? (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="font-heading text-3xl font-bold uppercase tracking-[0.06em] text-brand-black md:text-4xl">
                {activeCategory.title}
              </h3>
              <p className="mt-2 font-heading text-xs font-bold uppercase tracking-[0.15em] text-[#9d321e]">
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
                className="flex h-12 w-12 items-center justify-center border border-[#b8aa97] bg-[#faf8f3] text-brand-black transition-colors hover:border-[#9d321e] hover:bg-[#9d321e] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
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
                className="flex h-12 w-12 items-center justify-center border border-[#b8aa97] bg-[#faf8f3] text-brand-black transition-colors hover:border-[#9d321e] hover:bg-[#9d321e] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                disabled={activeImages.length <= 1}
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {activeImage ? (
            <div className="border border-[#b8aa97] bg-[#faf8f3] p-3 sm:p-5">
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(true);
                }}
                className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e]"
              >
                <div
                  className="relative w-full overflow-hidden bg-white"
                  style={{
                    aspectRatio: `${activeImageAspectRatio}`,
                    maxHeight: "72vh",
                  }}
                >
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    className="object-contain transition duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
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

              <div className="mt-4 flex flex-col gap-4 border-t border-[#b8aa97] pt-4 md:flex-row md:items-center md:justify-between">
                <div className="text-left">
                  {activeImage.title ? (
                    <p className="font-heading text-xl font-bold uppercase tracking-[0.1em] text-brand-black">
                      {activeImage.title}
                    </p>
                  ) : null}
                  <p className="mt-1 font-body text-base leading-7 text-neutral-700">
                    Click the page to open the full viewer
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsLightboxOpen(true);
                  }}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center bg-brand-black px-6 py-3 font-heading text-sm font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#9d321e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d321e] motion-reduce:transition-none"
                >
                  View Full Ad
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-[#b8aa97] bg-[#faf8f3] p-8 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
                No specials available in this category.
              </p>
            </div>
          )}
          {activeImage ? <SpecialsTextAlternative image={activeImage} /> : null}
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
