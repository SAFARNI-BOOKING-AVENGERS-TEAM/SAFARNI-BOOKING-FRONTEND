import Link from "next/link";
import Image from "next/image";
import { ImageOff, MapPin } from "lucide-react";
import { Card } from "@/components/ui";
import StarRating from "@/components/ui/star-rating";

interface ListingCardProps {
  href: string;
  image?: string;
  badge?: React.ReactNode;
  favoriteButton?: React.ReactNode;
  title: string;
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
  priceLabel?: string;
  price?: string;
  priceSuffix?: string;
  originalPrice?: string;
  footer?: React.ReactNode;
  priority?: boolean;
}

/**
 * One image-card layout shared by hotels, tours, and packages (and eSIM's
 * icon variant is intentionally separate — different enough visually that
 * forcing it in here would mean more optional props than real reuse).
 *
 * favoriteButton is an opt-in slot rather than baked in, since packages
 * aren't favoritable — callers decide whether to pass one.
 */
export default function ListingCard({
  href,
  image,
  badge,
  favoriteButton,
  title,
  subtitle,
  rating,
  reviewCount,
  priceLabel,
  price,
  priceSuffix,
  originalPrice,
  footer,
  priority = false,
}: ListingCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-8 h-8 text-gray-300" />
            </div>
          )}
          {badge && <div className="absolute top-3 left-3">{badge}</div>}
          {favoriteButton && <div className="absolute top-3 right-3">{favoriteButton}</div>}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
          {subtitle && (
            <p className="flex items-center gap-1 text-sm text-gray-500 mt-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {subtitle}
            </p>
          )}

          {rating !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <StarRating rating={rating} size={14} />
              <span className="text-xs text-gray-500">
                {rating.toFixed(1)}
                {reviewCount !== undefined && ` (${reviewCount})`}
              </span>
            </div>
          )}

          {(price || footer) && (
            <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-100">
              <div>
                {price && (
                  <div className="flex items-baseline gap-1.5">
                    {originalPrice && (
                      <span className="text-xs text-gray-400 line-through">{originalPrice}</span>
                    )}
                    <span className="text-base font-semibold text-gray-900">{price}</span>
                    {priceSuffix && <span className="text-xs text-gray-500">{priceSuffix}</span>}
                  </div>
                )}
                {priceLabel && <p className="text-xs text-gray-400">{priceLabel}</p>}
              </div>
              {footer}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
