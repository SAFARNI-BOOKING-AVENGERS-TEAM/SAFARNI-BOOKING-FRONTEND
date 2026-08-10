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
 * Used on any service detail page with a gallery array (Hotel.gallery,
 * Tour.gallery, Package.gallery). Handles the empty/missing-image case so
 * pages don't each need their own fallback UI.
 *
 * NOTE (Stage 2): the image domains (Cloudinary) will need to be added to
 * next.config.js images.remotePatterns for next/image to load them.
 */
export default function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "aspect-[16/10] bg-gray-100 rounded-xl flex items-center justify-center",
          className
        )}
      >
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
              <Image src={img} alt={`${alt} thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
