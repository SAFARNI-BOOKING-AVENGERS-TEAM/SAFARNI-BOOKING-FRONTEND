"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Building2, Car, Plane, MapPin } from "lucide-react";
import { usePackageDetails } from "@/lib/hooks/use-packages";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, Badge, Button, Skeleton, EmptyState } from "@/components/ui";
import PackageBookingModal from "@/components/services/package-booking-modal";
import { formatPrice } from "@/lib/utils";

const categoryIcon: Record<string, typeof Building2> = {
  hotels: Building2,
  cars: Car,
  flights: Plane,
  tours: MapPin,
};

export default function PackageDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = usePackageDetails(id);
  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState
          title="Package not found"
          description="This package may have been removed or isn't available."
        />
      </div>
    );
  }

  const { package: pkg, items, pricing } = data.data;

  const handleBook = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/packages/${id}`;
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="danger">-{pkg.discountPercentage}%</Badge>
          {pkg.featured && <Badge variant="info">Featured</Badge>}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{pkg.title}</h1>
        {pkg.description && <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>}
      </div>

      {pkg.coverImage && (
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-100 mb-8">
          <Image src={pkg.coverImage} alt={pkg.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What&apos;s included</h2>
          {items.map((entry, i) => {
            const Icon = categoryIcon[entry.category] ?? MapPin;
            const label =
              entry.category === "hotels"
                ? `${entry.hotel?.name ?? "Hotel"} — ${entry.room?.name ?? ""}`
                : (entry.item as any)?.title ||
                  (entry.item as any)?.brand ||
                  (entry.item as any)?.flightNumber ||
                  "Item";
            return (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 capitalize">{entry.category}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit">
          <CardContent className="p-5">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Original estimate</span>
                <span className="line-through">{formatPrice(pricing.estimatedOriginalPrice)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>You save ({pricing.discountPercentage}%)</span>
                <span>-{formatPrice(pricing.estimatedSavings)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                <span>Estimated total</span>
                <span>{formatPrice(pricing.estimatedFinalPrice)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={handleBook}>
              Book this package
            </Button>
            <p className="text-xs text-gray-400 mt-3">{pricing.note}</p>
          </CardContent>
        </Card>
      </div>

      <PackageBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        packageId={id}
        packageTitle={pkg.title}
        items={items}
        estimatedFinalPrice={pricing.estimatedFinalPrice}
      />
    </div>
  );
}
