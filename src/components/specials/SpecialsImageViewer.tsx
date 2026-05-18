"use client";

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SpecialImage } from "@/data/specials";

type Props = {
  image: SpecialImage | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export default function SpecialsImageViewer({
  image,
  onClose,
  onPrevious,
  onNext,
}: Props) {
  if (!image) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/85
        px-4
        py-6
      "
      onClick={onClose}
    >
      {/* subtle site-style texture layer */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-25
          [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.18)_1px,transparent_1px)]
          [background-size:18px_18px]
        "
      />

      <div
        className="
          relative
          w-full
          max-w-4xl
          border
          border-white/40
          bg-[#1f1f1f]
          p-4
          shadow-[0_0_0_6px_rgba(255,255,255,0.06)]
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* top label bar */}
        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            border-b
            border-white/25
            pb-3
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.35em]
                text-white/60
              "
            >
              Iowa Meat Farms
            </p>

            <h2
              className="
                mt-1
                text-lg
                font-black
                uppercase
                tracking-[0.28em]
                text-white
                sm:text-xl
              "
            >
              Weekly Special
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              border
              border-white/60
              bg-transparent
              text-white
              transition
              hover:bg-white
              hover:text-black
            "
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* image frame */}
        <div
          className="
            relative
            border
            border-white/30
            bg-[#e6e6e6]
            p-3
          "
        >
          <div
            className="
              relative
              mx-auto
              aspect-[4/5]
              max-h-[72vh]
              w-full
              bg-white
            "
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              aria-label="Previous special"
              className="
                absolute
                left-3
                top-1/2
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                border
                border-white
                bg-black/85
                text-white
                transition
                hover:bg-white
                hover:text-black
              "
            >
              <ChevronLeft size={25} strokeWidth={2.5} />
            </button>
          ) : null}

          {onNext ? (
            <button
              type="button"
              onClick={onNext}
              aria-label="Next special"
              className="
                absolute
                right-3
                top-1/2
                flex
                h-11
                w-11
                -translate-y-1/2
                items-center
                justify-center
                border
                border-white
                bg-black/85
                text-white
                transition
                hover:bg-white
                hover:text-black
              "
            >
              <ChevronRight size={25} strokeWidth={2.5} />
            </button>
          ) : null}
        </div>

        {/* bottom caption */}
        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-white/25
            pt-3
          "
        >
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.3em]
              text-white/60
            "
          >
            Click outside image to close
          </p>

          {image.title ? (
            <p
              className="
                text-right
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-white
              "
            >
              {image.title}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}