"use client";

import { LucideIcon } from "lucide-react";
import { Skeleton, EmptyState } from "@/components/ui";

interface ListingGridProps<T> {
  items?: T[];
  isLoading: boolean;
  isError?: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  skeletonCount?: number;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: string;
}

/**
 * Every listing page (hotels/cars/tours/packages/esim) needs the same three
 * states: skeleton grid while loading, real cards once loaded, EmptyState
 * if nothing matches. One component, so that logic isn't rewritten 5 times.
 */
export default function ListingGrid<T>({
  items,
  isLoading,
  isError,
  renderItem,
  keyExtractor,
  skeletonCount = 6,
  emptyIcon,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Try adjusting your filters.",
  columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: ListingGridProps<T>) {
  if (isLoading && !items) {
    return (
      <div className={`grid ${columns} gap-5`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Couldn't load results"
        description="Something went wrong fetching this data. Please try again."
      />
    );
  }

  if (!items || items.length === 0) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={`grid ${columns} gap-5`}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
}
