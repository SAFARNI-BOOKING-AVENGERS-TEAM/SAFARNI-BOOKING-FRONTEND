"use client";

import Link from "next/link";
import { Building2, Car as CarIcon, Plane, MapPin, X, Calendar, CreditCard } from "lucide-react";
import { useMyBookings, useCancelBooking } from "@/lib/hooks/use-bookings";
import { useBookingItem } from "@/lib/hooks/use-booking-item";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { Card, CardContent, Badge, Button, Skeleton, EmptyState } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Booking, BookingCategory } from "@/types";

const categoryIcon: Record<BookingCategory, typeof Building2> = {
  hotels: Building2,
  cars: CarIcon,
  flights: Plane,
  tours: MapPin,
};

function bookingTitle(booking: Booking, item: ReturnType<typeof useBookingItem>["data"]) {
  if (!item || !item.data) return booking.category === "hotels" ? "Hotel room booking" : "Item unavailable";
  if (item.kind === "tours") return item.data.title;
  if (item.kind === "cars") return `${item.data.brand} ${item.data.model}`;
  if (item.kind === "flights") return `${item.data.airline} ${item.data.flightNumber}`;
  return "Booking";
}

function bookingHref(booking: Booking, item: ReturnType<typeof useBookingItem>["data"]) {
  if (item?.kind === "tours") return `/tours/${booking.itemId}`;
  if (item?.kind === "cars") return `/cars/${booking.itemId}`;
  if (item?.kind === "flights") return `/flights/${booking.itemId}`;
  return null;
}

function BookingCard({ booking }: { booking: Booking }) {
  const { data: item, isLoading } = useBookingItem(booking.category, booking.itemId);
  const cancelBooking = useCancelBooking();
  const toast = useToast();

  const Icon = categoryIcon[booking.category];
  const title = isLoading ? "Loading…" : bookingTitle(booking, item);
  const href = bookingHref(booking, item);
  const canCancel = booking.status !== "cancelled";
  const checkoutHref = booking.packageBookingId
    ? `/checkout?packageBookingId=${encodeURIComponent(booking.packageBookingId)}`
    : `/checkout?bookingId=${encodeURIComponent(booking._id)}`;

  const handleCancel = () => {
    cancelBooking.mutate(booking._id, {
      onSuccess: () => toast.success("Booking cancelled"),
      onError: (err) => toast.error("Couldn't cancel booking", getApiErrorMessage(err)),
    });
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
          <div className="min-w-0">
            {href ? (
              <Link href={href} className="text-sm font-medium text-gray-900 hover:underline">{title}</Link>
            ) : (
              <p className="text-sm font-medium text-gray-900">{title}</p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">{formatDate(booking.startDate)} — {formatDate(booking.endDate)}</p>
            {booking.packageBookingId && <p className="text-xs text-gray-400 mt-0.5">Part of a package booking</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Badge status={booking.status}>{booking.status}</Badge>
          <span className="text-sm font-semibold text-gray-900 mx-1">{formatPrice(booking.totalPrice)}</span>
          {booking.status === "pending" && (
            <Link href={checkoutHref}>
              <Button size="sm" leftIcon={<CreditCard className="w-3.5 h-3.5" />}>Pay now</Button>
            </Link>
          )}
          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              isLoading={cancelBooking.isPending}
              leftIcon={<X className="w-3.5 h-3.5" />}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function BookingsPage() {
  const { data, isLoading, isError } = useMyBookings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Bookings</h1>
      <p className="text-sm text-gray-500 mb-6">Everything you&apos;ve booked, in one place</p>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : isError ? (
        <EmptyState title="Couldn't load your bookings" description="Please try again." />
      ) : !data?.data.length ? (
        <EmptyState icon={Calendar} title="No bookings yet" description="Once you book a hotel, tour, car, or flight, it'll show up here." />
      ) : (
        <div className="space-y-3">
          {data.data
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((booking) => <BookingCard key={booking._id} booking={booking} />)}
        </div>
      )}
    </div>
  );
}
