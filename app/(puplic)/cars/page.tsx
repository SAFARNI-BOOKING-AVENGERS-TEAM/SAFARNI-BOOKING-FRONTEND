"use client";

import { useState } from "react";
import { Car as CarIcon } from "lucide-react";
import { useCars } from "@/lib/hooks/use-cars";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FormInput, Select } from "@/components/ui";
import ListingGrid from "@/components/services/listing-grid";
import ListingCard from "@/components/services/listing-card";
import FilterBar from "@/components/services/filter-bar";
import FavoriteButton from "@/components/services/favorite-button";
import { formatPrice } from "@/lib/utils";

const typeOptions = ["SUV", "Sedan", "Hatchback", "Convertible", "Luxury"].map((t) => ({
  value: t,
  label: t,
}));

export default function CarsPage() {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const debouncedCity = useDebounce(city);

  const { data, isLoading, isError } = useCars({
    city: debouncedCity || undefined,
    type: type || undefined,
  });

  const hasActiveFilters = !!city || !!type;
  const clearFilters = () => {
    setCity("");
    setType("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Car rentals</h1>
      <p className="text-sm text-gray-500 mb-6">Pick up a car wherever you land</p>

      <FilterBar onClear={clearFilters} hasActiveFilters={hasActiveFilters}>
        <div className="w-48">
          <FormInput
            label="City"
            placeholder="e.g. Cairo"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="w-44">
          <Select
            label="Type"
            placeholder="Any type"
            options={typeOptions}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
      </FilterBar>

      <ListingGrid
        items={data?.data}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(car) => car._id}
        emptyIcon={CarIcon}
        emptyTitle="No cars found"
        emptyDescription="Try a different city or type."
        renderItem={(car) => (
          <ListingCard
            href={`/cars/${car._id}`}
            image={car.image}
            title={`${car.brand} ${car.model}`}
            subtitle={car.location?.city}
            price={formatPrice(car.pricePerDay)}
            priceSuffix="/day"
            favoriteButton={<FavoriteButton category="cars" itemId={car._id} />}
            footer={
              <span className="text-xs text-gray-500">
                {car.type} · {car.transmission}
              </span>
            }
          />
        )}
      />
    </div>
  );
}
