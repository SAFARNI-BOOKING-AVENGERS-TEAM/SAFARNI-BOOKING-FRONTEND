"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { useTours } from "@/lib/hooks/use-tours";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FormInput, Select, Pagination } from "@/components/ui";
import ListingGrid from "@/components/services/listing-grid";
import ListingCard from "@/components/services/listing-card";
import FilterBar from "@/components/services/filter-bar";
import FavoriteButton from "@/components/services/favorite-button";
import { formatPrice } from "@/lib/utils";

const difficultyOptions = ["Easy", "Moderate", "Challenging"].map((d) => ({ value: d, label: d }));

export default function ToursPage() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const debouncedTitle = useDebounce(title);

  const { data, isLoading, isError } = useTours({ title: debouncedTitle || undefined, city: city || undefined, difficulty: difficulty || undefined, page, limit: 9 });
  const hasActiveFilters = !!title || !!city || !!difficulty;
  const clearFilters = () => { setTitle(""); setCity(""); setDifficulty(""); setPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Tours & activities</h1>
      <p className="text-sm text-gray-500 mb-6">Guided experiences from local providers</p>

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <div className="w-56"><FormInput label="Search" placeholder="Search tours" value={title} onChange={(e) => { setTitle(e.target.value); setPage(1); }} /></div>
        <div className="w-44"><FormInput label="City" placeholder="e.g. Luxor" value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} /></div>
        <div className="w-44"><Select label="Difficulty" placeholder="Any" options={difficultyOptions} value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} /></div>
      </FilterBar>

      <ListingGrid
        items={data?.data}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(tour) => tour._id}
        emptyIcon={MapPin}
        emptyTitle="No tours found"
        emptyDescription="Try a different search or clear your filters."
        renderItem={(tour, index) => {
          const avgRating = tour.reviews.length > 0 ? tour.reviews.reduce((s, r) => s + r.rating, 0) / tour.reviews.length : 0;
          return (
            <ListingCard
              href={`/tours/${tour._id}`}
              image={tour.mainImage}
              title={tour.title}
              subtitle={tour.locations[0]?.name}
              rating={avgRating}
              reviewCount={tour.reviews.length}
              price={formatPrice(tour.priceTiers[0]?.price ?? 0)}
              priceLabel="From"
              priority={index === 0}
              favoriteButton={<FavoriteButton category="tours" itemId={tour._id} />}
            />
          );
        }}
      />

      {data?.pagination && <div className="mt-8"><Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} /></div>}
    </div>
  );
}
