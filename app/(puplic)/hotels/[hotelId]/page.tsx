"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Star, MapPin, Users, BedDouble } from "lucide-react";
import { useHotelDetails } from "@/lib/hooks/use-hotels";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, Badge, Button, Skeleton, EmptyState, ImageGallery } from "@/components/ui";
import FavoriteButton from "@/components/services/favorite-button";
import HotelBookingModal from "@/components/services/hotel-booking-modal";
import { formatPrice } from "@/lib/utils";
import type { Room } from "@/types";

export default function HotelDetailPage() {
  const params = useParams();
  const hotelId = params.hotelId as string;

  const { data, isLoading, isError } = useHotelDetails(hotelId);
  const { isAuthenticated } = useAuth();
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);

  const handleReserve = (room: Room) => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/hotels/${hotelId}`;
      return;
    }
    setBookingRoom(room);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState
          title="Hotel not found"
          description="This hotel may have been removed or isn't available."
        />
      </div>
    );
  }

  const { hotel, rooms } = data.data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4" />
            {[hotel.location?.address, hotel.location?.city].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton category="hotels" itemId={hotel._id} />
          <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-lg">
            <Star className="w-4 h-4 fill-white" />
            <span className="text-sm font-medium">{hotel.rating?.toFixed(1) ?? "New"}</span>
          </div>
        </div>
      </div>

      <ImageGallery images={hotel.gallery.map((g) => g.url)} alt={hotel.name} className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {hotel.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About this hotel</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>
          )}

          {hotel.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((a) => (
                  <Badge key={a} variant="default">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(hotel.policies?.checkIn || hotel.policies?.checkOut || hotel.policies?.cancellation) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Policies</h2>
              <ul className="text-sm text-gray-600 space-y-1">
                {hotel.policies.checkIn && <li>Check-in: {hotel.policies.checkIn}</li>}
                {hotel.policies.checkOut && <li>Check-out: {hotel.policies.checkOut}</li>}
                {hotel.policies.cancellation && <li>Cancellation: {hotel.policies.cancellation}</li>}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Rooms</h2>
          <div className="space-y-3">
            {rooms.length === 0 && (
              <p className="text-sm text-gray-500">No rooms have been added to this hotel yet.</p>
            )}
            {rooms.map((room) => (
              <Card key={room._id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{room.name}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Users className="w-3.5 h-3.5" />
                        {room.occupancy.adults} adults
                        {room.occupancy.children ? `, ${room.occupancy.children} children` : ""}
                      </p>
                      {room.refundable && (
                        <Badge variant="success" className="mt-2">
                          Refundable
                        </Badge>
                      )}
                    </div>
                    <BedDouble className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-base font-semibold text-gray-900">
                        {formatPrice(room.pricePerNight)}
                      </span>
                      <span className="text-xs text-gray-500"> /night</span>
                    </div>
                    <Button size="sm" onClick={() => handleReserve(room)}>
                      Reserve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {bookingRoom && (
        <HotelBookingModal
          isOpen={!!bookingRoom}
          onClose={() => setBookingRoom(null)}
          room={bookingRoom}
          hotelName={hotel.name}
        />
      )}
    </div>
  );
}
