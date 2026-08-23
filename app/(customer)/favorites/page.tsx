"use client";

import Link from "next/link";
import { Heart, Building2, Car as CarIcon, Plane, MapPin } from "lucide-react";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { Card, CardContent, Skeleton, EmptyState } from "@/components/ui";
import FavoriteButton from "@/components/services/favorite-button";
import { formatDate } from "@/lib/utils";
import type { FavoriteListItem, FavoriteCategory } from "@/types";

const categoryMeta: Record<FavoriteCategory, { icon: typeof Building2; href: (id: string) => string }> = {
  hotels: { icon: Building2, href: (id) => `/hotels/${id}` },
  cars: { icon: CarIcon, href: (id) => `/cars/${id}` },
  flights: { icon: Plane, href: (id) => `/flights/${id}` },
  tours: { icon: MapPin, href: (id) => `/tours/${id}` },
};

function favoriteLabel(fav: FavoriteListItem): string {
  if (!fav.item) return "This item is no longer available";
  const item = fav.item as any;
  if (fav.category === "hotels") return item.name;
  if (fav.category === "cars") return `${item.brand} ${item.model}`;
  if (fav.category === "flights") return `${item.airline} ${item.flightNumber}`;
  return item.title;
}

export default function FavoritesPage() {
  const { data, isLoading, isError } = useFavorites();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Favorites</h1>
      <p className="text-sm text-gray-500 mb-6">Hotels, tours, cars, and flights you&apos;ve saved</p>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Couldn't load favorites" description="Please try again." />
      ) : !data?.data.length ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart icon on any hotel, tour, car, or flight to save it here."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((fav) => {
            const meta = categoryMeta[fav.category];
            const Icon = meta.icon;
            return (
              <Card key={fav.favoriteId}>
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="min-w-0">
                      {fav.item ? (
                        <Link
                          href={meta.href(fav.itemId)}
                          className="text-sm font-medium text-gray-900 hover:underline line-clamp-1"
                        >
                          {favoriteLabel(fav)}
                        </Link>
                      ) : (
                        <p className="text-sm text-gray-400 italic line-clamp-1">
                          {favoriteLabel(fav)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1 capitalize">
                        {fav.category} · saved {formatDate(fav.addedAt)}
                      </p>
                    </div>
                  </div>
                  <FavoriteButton
                    category={fav.category}
                    itemId={fav.itemId}
                    className="bg-gray-100 hover:bg-gray-200 flex-shrink-0"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
