"use client";

import { useState } from "react";
import Image from "next/image";
import SpecialsImageViewer from "./SpecialsImageViewer";
import { SpecialImage } from "@/data/specials";

type SpecialsCategory = {
  id: string;
  title: string;
  images: SpecialImage[];
};

type Props = {
  categories: SpecialsCategory[];
};

export default function SpecialsGallery({ categories }: Props) {
  const [activeCategoryIndex, setActiveCategoryIndex] =
    useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const activeCategory =
    activeCategoryIndex !== null
      ? categories[activeCategoryIndex]
      : null;
  const activeImages = activeCategory?.images ?? [];

  const selectedImage =
    selectedIndex !== null && activeImages[selectedIndex]
      ? activeImages[selectedIndex]
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {categories.map((category, index) => {
          const previewImage = category.images[0];

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setActiveCategoryIndex(index);
                setSelectedIndex(category.images.length > 0 ? 0 : null);
              }}
              className="
                group
                border-2
                border-neutral-900
                bg-white
                p-3
                text-left
                transition
                hover:-translate-y-1
                hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]
              "
            >
              <div>
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-200">
                  {previewImage ? (
                    <Image
                      src={previewImage.src}
                      alt={previewImage.alt}
                      fill
                      className="
                        object-contain
                        transition
                        duration-300
                        group-hover:scale-105
                      "
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        33vw
                      "
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200 px-6 text-center">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
                        No images available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h2 className="mb-1 font-heading text-xl font-bold uppercase tracking-[0.1em] text-brand-black">
                  {category.title}
                </h2>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-600">
                  {category.images.length} image{category.images.length === 1 ? "" : "s"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <SpecialsImageViewer
        image={selectedImage}
        heading={activeCategory?.title}
        onClose={() => {
          setSelectedIndex(null);
          setActiveCategoryIndex(null);
        }}
        onPrevious={
          selectedIndex !== null && activeImages.length > 1
            ? () =>
                setSelectedIndex(
                  selectedIndex === 0
                    ? activeImages.length - 1
                    : selectedIndex - 1
                )
            : undefined
        }
        onNext={
          selectedIndex !== null && activeImages.length > 1
            ? () =>
                setSelectedIndex(
                  selectedIndex === activeImages.length - 1
                    ? 0
                    : selectedIndex + 1
                )
            : undefined
        }
      />
    </>
  );
}