"use client";

import { useState } from "react";
import { useAccessibleModal } from "@/hooks/useAccessibleModal";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { SpecialImage } from "@/data/specials";

type Props = {
  image: SpecialImage | null;
  heading?: string;
  images?: SpecialImage[];
  onSelectImage?: (index: number) => void;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

const controlClass = "inline-flex min-h-11 items-center justify-center gap-2 border border-white/50 px-3 py-2 text-sm font-bold text-white hover:bg-white hover:text-black disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function SpecialsImageViewer({ image, heading, images, onSelectImage, onClose, onPrevious, onNext }: Props) {
  const [guided, setGuided] = useState(true);
  const [selection, setSelection] = useState({ src: "", index: 0 });
  const [aspectRatio, setAspectRatio] = useState(4 / 5);
  const [zoomed, setZoomed] = useState(false);
  const modalRef = useAccessibleModal<HTMLDivElement>(Boolean(image), onClose);

  if (!image) return null;

  const regionIndex = selection.src === image.src ? selection.index : 0;
  const steps = (images ?? [image]).flatMap((page, pageIndex) =>
    (page.guidedRegions ?? []).map((region, index) => ({ page, pageIndex, region, index }))
  );
  const stepIndex = steps.findIndex((step) => step.page.src === image.src && step.index === regionIndex);
  const moveItem = (direction: number) => {
    const step = steps[stepIndex + direction];
    if (!step) return;
    setSelection({ src: step.page.src, index: step.index });
    if (step.page.src !== image.src) onSelectImage?.(step.pageIndex);
  };
  const regions = image.guidedRegions ?? [];
  const region = regions[regionIndex];
  const isGuided = guided && Boolean(region);
  // SVG coordinates use a 100-unit-wide image; vertical percentages follow its aspect ratio.
  const crop = region ? `${region.x} ${region.y / aspectRatio} ${region.width} ${region.height / aspectRatio}` : undefined;

  return createPortal(
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label={heading ?? "Weekly Special"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 sm:p-4" onClick={onClose}>
      <div className="relative flex max-h-[96svh] w-full max-w-5xl flex-col overflow-auto border border-white/40 bg-[#1f1f1f] p-3 shadow-xl sm:p-4"
        onClick={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/25 pb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">Iowa Meat Farms & Siesel’s</p>
            <h2 className="mt-1 text-lg font-bold text-white">{image.title ?? heading ?? "Weekly Special"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close image viewer" className={controlClass}><X size={20} /></button>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 py-3">
          {regions.length > 0 ? (
            <button type="button" aria-pressed={isGuided} className={controlClass}
              onClick={() => { setGuided(!guided); setZoomed(false); }}>
              Guided view: {isGuided ? "On" : "Off"}
            </button>
          ) : <span className="text-sm text-white">Full ad</span>}
          {isGuided ? (
            <div className="flex gap-2" aria-label="Ad items">
              <button type="button" className={controlClass} aria-label="Previous item" disabled={stepIndex <= 0} onClick={() => moveItem(-1)}><ChevronLeft size={18} />Item</button>
              <button type="button" className={controlClass} aria-label="Next item" disabled={stepIndex >= steps.length - 1} onClick={() => moveItem(1)}>Item<ChevronRight size={18} /></button>
            </div>
          ) : <div className="flex gap-2" aria-label="Ad pages">
            {onPrevious ? <button type="button" onClick={onPrevious} className={controlClass} aria-label="Previous ad page"><ChevronLeft size={18} />Page</button> : null}
            {onNext ? <button type="button" onClick={onNext} className={controlClass} aria-label="Next ad page">Page<ChevronRight size={18} /></button> : null}
          </div>}
        </div>

        {isGuided && region ? (
          <div className="min-h-0 bg-white">
            <svg role="img" aria-label={`${region.label}, enlarged ad region`} viewBox={crop}
              className="h-[52svh] w-full" preserveAspectRatio="xMidYMid meet">
              <defs><clipPath id="special-region"><rect x={region.x} y={region.y / aspectRatio} width={region.width} height={region.height / aspectRatio} /></clipPath></defs>
              <g clipPath="url(#special-region)">
                <image href={image.src} width="100" height={100 / aspectRatio} preserveAspectRatio="none" />
              </g>
            </svg>
            {/* Load intrinsic dimensions without changing the crop's layout. */}
            <Image src={image.src} alt="" width={1} height={1} unoptimized className="hidden"
              onLoad={(event) => {
                const { naturalWidth, naturalHeight } = event.currentTarget;
                if (naturalWidth && naturalHeight) setAspectRatio(naturalWidth / naturalHeight);
              }} />
          </div>
        ) : (
          <div className="max-h-[60svh] overflow-auto overscroll-contain bg-[#e6e6e6]">
            <button type="button" onClick={() => setZoomed(!zoomed)} aria-label={zoomed ? "Fit image to screen" : "Zoom in on image"}
              className={`relative mx-auto block bg-white ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              style={{ aspectRatio, width: zoomed ? "250%" : "100%", maxWidth: zoomed ? "none" : undefined, maxHeight: zoomed ? "none" : "60svh" }}>
              <Image src={image.src} alt={image.alt} fill className="object-contain" sizes={zoomed ? "250vw" : "100vw"} priority
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  if (naturalWidth && naturalHeight) setAspectRatio(naturalWidth / naturalHeight);
                }} />
            </button>
          </div>
        )}

        <div className="mt-3 shrink-0 border-t border-white/25 pt-3">
          {isGuided && region ? (
            <>
              <p aria-live="polite" aria-atomic="true" className="mb-3 text-center text-white">
                <span className="block text-xs text-white/70">Item {stepIndex + 1} of {steps.length}</span>
                <span className="font-bold">{region.label}</span>
              </p>

            </>
          ) : (
            <button type="button" className={controlClass} onClick={() => setZoomed(!zoomed)}>
              {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{zoomed ? "Fit to screen" : "Tap image to zoom"}
            </button>
          )}
        </div>
      </div>
    </div>, document.body
  );
}
