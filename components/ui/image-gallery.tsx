"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

/**
 * Used on service detail pages with a gallery array. The active hero image is
 * above the fold, so it is prioritized; thumbnails stay lazy-loaded.
 */
export default function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn("aspect-[16/10] bg-gray-100 rounded-xl flex items-center justify-center", className)}>
        <ImageOff className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={images[active]}
          alt={`${alt} ${active + 1}`}
          fill
          sizes="(max-width: 1024px) calc(100vw - 2rem), 1024px"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((p) => (p === 0 ? images.length - 1 : p - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActive((p) => (p === images.length - 1 ? 0 : p + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className={cn(
                "relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-opacity",
                active === idx ? "border-gray-900" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
