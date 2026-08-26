"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { useHotels } from "@/lib/hooks/use-hotels";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FormInput, Select, Pagination } from "@/components/ui";
import ListingGrid from "@/components/services/listing-grid";
import ListingCard from "@/components/services/listing-card";
import FilterBar from "@/components/services/filter-bar";
import FavoriteButton from "@/components/services/favorite-button";

const ratingOptions = [
  { value: "3", label: "3+ stars" },
  { value: "4", label: "4+ stars" },
  { value: "5", label: "5 stars" },
];

export default function HotelsPage() {
  const [city, setCity] = useState("");
  const [rating, setRating] = useState("");
  const [page, setPage] = useState(1);
  const debouncedCity = useDebounce(city);

  const { data, isLoading, isError } = useHotels({
    city: debouncedCity || undefined,
    rating: rating ? Number(rating) : undefined,
    page,
    limit: 9,
  });

  const hasActiveFilters = !!city || !!rating;
  const clearFilters = () => {
    setCity("");
    setRating("");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Hotels</h1>
      <p className="text-sm text-gray-500 mb-6">Find a place to stay, anywhere in the world</p>

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <div className="w-48">
          <FormInput
            label="City"
            placeholder="e.g. Cairo"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-40">
          <Select
            label="Rating"
            placeholder="Any rating"
            options={ratingOptions}
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </FilterBar>

      <ListingGrid
        items={data?.data}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(hotel) => hotel._id}
        emptyIcon={Building2}
        emptyTitle="No hotels found"
        emptyDescription="Try a different city or clear your filters."
        renderItem={(hotel, index) => (
          <ListingCard
            href={`/hotels/${hotel._id}`}
            image={hotel.gallery[0]?.url}
            title={hotel.name}
            subtitle={hotel.location?.city}
            rating={hotel.rating}
            priority={index === 0}
            favoriteButton={<FavoriteButton category="hotels" itemId={hotel._id} />}
          />
        )}
      />

      {data?.pagination && (
        <div className="mt-8">
          <Pagination
            page={data.pagination.page}
            pages={data.pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
