"use client";

import { Package as PackageIcon } from "lucide-react";
import { usePackages } from "@/lib/hooks/use-packages";
import { Badge } from "@/components/ui";
import ListingGrid from "@/components/services/listing-grid";
import ListingCard from "@/components/services/listing-card";
import { formatPrice } from "@/lib/utils";

export default function PackagesPage() {
  const { data, isLoading, isError } = usePackages();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Packages</h1>
      <p className="text-sm text-gray-500 mb-6">
        Bundled deals across hotels, tours, cars, and flights
      </p>

      <ListingGrid
        items={data?.data}
        isLoading={isLoading}
        isError={isError}
        keyExtractor={(pkg) => pkg._id}
        emptyIcon={PackageIcon}
        emptyTitle="No packages available"
        emptyDescription="Check back soon for new deals."
        renderItem={(pkg) => {
          const savings = Math.round(pkg.estimatedOriginalPrice * (pkg.discountPercentage / 100));
          const finalPrice = pkg.estimatedOriginalPrice - savings;
          return (
            <ListingCard
              href={`/packages/${pkg._id}`}
              image={pkg.coverImage}
              title={pkg.title}
              subtitle={[pkg.durationLabel, pkg.country].filter(Boolean).join(" · ")}
              badge={<Badge variant="danger">-{pkg.discountPercentage}%</Badge>}
              price={formatPrice(finalPrice)}
              originalPrice={formatPrice(pkg.estimatedOriginalPrice)}
              priceLabel="Estimated total"
              footer={
                pkg.sourceType === "curated" ? <Badge variant="info">Safarni pick</Badge> : undefined
              }
            />
          );
        }}
      />
    </div>
  );
}
