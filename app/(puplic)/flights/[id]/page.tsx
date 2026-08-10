"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plane, Clock } from "lucide-react";
import { useFlightDetails } from "@/lib/hooks/use-flights";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, Badge, Button, Skeleton, EmptyState } from "@/components/ui";
import FavoriteButton from "@/components/services/favorite-button";
import FlightBookingModal from "@/components/services/flight-booking-modal";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";

export default function FlightDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useFlightDetails(id);
  const { isAuthenticated, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const flight = data?.data;
  const canView =
    flight &&
    (flight.status === "approved" || user?.role === "admin" || flight.createdBy === user?._id);

  if (isError || !flight || !canView) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState title="Flight not found" description="This flight may have been removed." />
      </div>
    );
  }

  const handleReserve = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/flights/${id}`;
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Plane className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{flight.airline}</p>
                <p className="text-sm text-gray-500">{flight.flightNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info">{flight.class}</Badge>
              <FavoriteButton category="flights" itemId={flight._id} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-6 border-y border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{flight.departureAirport}</p>
              <p className="text-sm text-gray-500 mt-1">{formatTime(flight.departureTime)}</p>
              <p className="text-xs text-gray-400">{formatDate(flight.departureTime)}</p>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <Clock className="w-4 h-4 text-gray-300 mb-1" />
              <div className="w-full h-px bg-gray-200" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{flight.arrivalAirport}</p>
              <p className="text-sm text-gray-500 mt-1">{formatTime(flight.arrivalTime)}</p>
              <p className="text-xs text-gray-400">{formatDate(flight.arrivalTime)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(flight.price)}</p>
              <p className="text-sm text-gray-500">{flight.availableSeats} seats available</p>
            </div>
            <Button onClick={handleReserve} disabled={flight.availableSeats === 0}>
              {flight.availableSeats === 0 ? "Sold out" : "Reserve this flight"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <FlightBookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} flight={flight} />
    </div>
  );
}
