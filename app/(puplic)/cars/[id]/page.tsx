"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Fuel, Settings2, MapPin, ImageOff } from "lucide-react";
import { useCarDetails } from "@/lib/hooks/use-cars";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, Badge, Button, Skeleton, EmptyState } from "@/components/ui";
import FavoriteButton from "@/components/services/favorite-button";
import CarBookingModal from "@/components/services/car-booking-modal";
import { formatPrice } from "@/lib/utils";

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError } = useCarDetails(id);
  const { isAuthenticated, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const car = data?.data;
  // Backend doesn't restrict GET /cars/:id by status/ownership, so we
  // apply the same "approved, unless you're the owner or an admin" rule
  // here that hotels/tours enforce server-side.
  const canView =
    car && (car.status === "approved" || user?.role === "admin" || car.createdBy === user?._id);

  if (isError || !car || !canView) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState title="Car not found" description="This listing may have been removed." />
      </div>
    );
  }

  const handleReserve = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/cars/${id}`);
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-6">
        {car.image ? (
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {car.status !== "approved" && <Badge status={car.status}>{car.status}</Badge>}
        </div>
        <div className="absolute top-3 right-3">
          <FavoriteButton category="cars" itemId={car._id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {car.brand} {car.model}
          </h1>
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4" />
            {[car.location?.address, car.location?.city].filter(Boolean).join(", ")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Settings2 className="w-4 h-4 text-gray-400" /> {car.type}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-gray-400" /> {car.seats} seats
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Settings2 className="w-4 h-4 text-gray-400" /> {car.transmission}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Fuel className="w-4 h-4 text-gray-400" /> {car.fuelType}
            </div>
          </div>
        </div>

        <Card className="h-fit">
          <CardContent className="p-5">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(car.pricePerDay)}</span>
              <span className="text-sm text-gray-500">/day</span>
            </div>
            <Button className="w-full" onClick={handleReserve} disabled={!car.available}>
              {car.available ? "Reserve this car" : "Currently unavailable"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <CarBookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} car={car} />
    </div>
  );
}
