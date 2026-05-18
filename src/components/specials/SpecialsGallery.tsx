"use client";

import { useState } from "react";
import Image from "next/image";
import SpecialsImageViewer from "./SpecialsImageViewer";
import { SpecialImage } from "@/data/specials";

type Props = {
  images: SpecialImage[];
};

export default function SpecialsGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedImage =
    selectedIndex !== null ? images[selectedIndex] : null;

  if (images.length === 0) {
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
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
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
            <div className="">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="
                    object-cover
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
              </div>
            </div>

            {image.title ? (
              <div className="mt-4">
                <h2 className="mb-2 font-heading text-xl font-bold uppercase tracking-[0.1em] text-brand-black">
                  {image.title}
                </h2>
              </div>
            ) : null}
          </button>
        ))}
      </div>

      <SpecialsImageViewer
        image={selectedImage}
        onClose={() => setSelectedIndex(null)}
        onPrevious={
          selectedIndex !== null && images.length > 1
            ? () =>
                setSelectedIndex(
                  selectedIndex === 0
                    ? images.length - 1
                    : selectedIndex - 1
                )
            : undefined
        }
        onNext={
          selectedIndex !== null && images.length > 1
            ? () =>
                setSelectedIndex(
                  selectedIndex === images.length - 1
                    ? 0
                    : selectedIndex + 1
                )
            : undefined
        }
      />
    </>
  );
}