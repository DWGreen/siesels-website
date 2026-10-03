"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { SpecialImage } from "@/data/specials";

type Props = {
  image: SpecialImage | null;
  heading?: string;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export default function SpecialsImageViewer({
  image,
  heading,
  onClose,
  onPrevious,
  onNext,
}: Props) {
  const [imageAspectRatios, setImageAspectRatios] = useState<
    Record<string, number>
  >({});
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null);
  const isOpen = Boolean(image);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!image) {
    return null;
  }

  const imageAspectRatio = imageAspectRatios[image.src] ?? 4 / 5;
  const isZoomed = zoomedSrc === image.src;
  const toggleZoom = () => setZoomedSrc(isZoomed ? null : image.src);

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/85
        px-2
        py-2
        sm:px-4
        sm:py-6
      "
      role="dialog"
      aria-modal="true"
      aria-label={heading ?? "Weekly Special"}
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
          p-3
          shadow-[0_0_0_6px_rgba(255,255,255,0.06)]
          sm:p-4
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
              {heading ?? "Weekly Special"}
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
            p-1
            sm:p-3
          "
        >
          <div
            className="max-h-[72svh] overflow-auto overscroll-contain"
          >
          <button
            type="button"
            onClick={toggleZoom}
            aria-label={isZoomed ? "Fit image to screen" : "Zoom in on image"}
            className={`
              relative
              mx-auto
              block
              bg-white
              ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}
            `}
            style={{
              aspectRatio: `${imageAspectRatio}`,
              width: isZoomed ? "250%" : "100%",
              maxWidth: isZoomed ? "none" : undefined,
              maxHeight: isZoomed ? "none" : "72svh",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain"
              sizes={isZoomed ? "250vw" : "100vw"}
              priority
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;

                if (naturalWidth > 0 && naturalHeight > 0) {
                  const aspectRatio = naturalWidth / naturalHeight;

                  setImageAspectRatios((currentRatios) => {
                    if (currentRatios[image.src] === aspectRatio) {
                      return currentRatios;
                    }

                    return {
                      ...currentRatios,
                      [image.src]: aspectRatio,
                    };
                  });
                }
              }}
            />
          </button>
          </div>

          {onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              aria-label="Previous special"
              className="
                absolute
                left-1
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
                sm:left-3
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
                right-1
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
                sm:right-3
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
          <button
            type="button"
            onClick={toggleZoom}
            className="
              flex
              min-h-11
              items-center
              gap-2
              text-[10px]
              font-black
              uppercase
              tracking-[0.3em]
              text-white/80
              hover:text-white
            "
          >
            {isZoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
            {isZoomed ? "Fit to screen" : "Tap image to zoom"}
          </button>

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
    </div>,
    document.body
  );
}