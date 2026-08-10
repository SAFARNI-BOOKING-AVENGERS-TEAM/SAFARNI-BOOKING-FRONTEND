"use client";

import { useState } from "react";
import Link from "next/link";
import { Smartphone } from "lucide-react";
import { useESIMPlans } from "@/lib/hooks/use-esim";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FormInput, Pagination, Card, CardContent } from "@/components/ui";
import ListingGrid from "@/components/services/listing-grid";
import FilterBar from "@/components/services/filter-bar";
import { formatPrice } from "@/lib/utils";

export default function ESIMPage() {
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const debouncedCountry = useDebounce(country);

  const { data, isLoading, isError } = useESIMPlans({
    country: debouncedCountry || undefined,
    page,
    limit: 12,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">eSIM plans</h1>
      <p className="text-sm text-gray-500 mb-6">Stay connected wherever you travel</p>

      <FilterBar
        onClear={() => {
          setCountry("");
          setPage(1);
        }}
        hasActiveFilters={!!country}
      >
        <div className="w-56">
          <FormInput
            label="Country"
            placeholder="e.g. France"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </FilterBar>

      <ListingGrid
        items={data?.data}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(plan) => plan._id}
        emptyIcon={Smartphone}
        emptyTitle="No eSIM plans found"
        emptyDescription="Try a different country."
        columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        renderItem={(plan) => (
          <Link href={`/esim/${plan._id}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {plan.country}
                  {plan.region ? ` · ${plan.region}` : ""}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {plan.dataAmount} {plan.dataUnit} · {plan.validityDays}d
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
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
