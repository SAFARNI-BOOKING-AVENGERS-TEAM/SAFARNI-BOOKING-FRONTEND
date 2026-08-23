"use client";

import { useQuery } from "@tanstack/react-query";
import { tourApi } from "@/lib/api/tours";
import { carApi } from "@/lib/api/cars";
import { flightApi } from "@/lib/api/flights";
import type { BookingCategory, Tour, Car, Flight } from "@/types";

export type BookingItemResult =
  | { kind: "tours"; data: Tour }
  | { kind: "cars"; data: Car }
  | { kind: "flights"; data: Flight }
  | { kind: "hotels"; data: null };

/**
 * GET /bookings/my-bookings returns raw bookings — itemId, category, dates,
 * price — with nothing resolved. For tours/cars/flights we can look the
 * item up with endpoints that already exist. For hotels, booking.itemId is
 * a Room ID, and there's no GET /hotels/rooms/:roomId (or similar) endpoint
 * to resolve it back to a room + hotel name — that's a real backend gap,
 * not something fixable from here. We degrade gracefully instead of
 * guessing.
 */
export function useBookingItem(category: BookingCategory, itemId: string) {
  return useQuery({
    queryKey: ["booking-item", category, itemId],
    queryFn: async (): Promise<BookingItemResult> => {
      if (category === "tours") {
        const res = await tourApi.getTourById(itemId);
        return { kind: "tours", data: res.data };
      }
      if (category === "cars") {
        const res = await carApi.getCarById(itemId);
        return { kind: "cars", data: res.data };
      }
      if (category === "flights") {
        const res = await flightApi.getFlightById(itemId);
        return { kind: "flights", data: res.data };
      }
      return { kind: "hotels", data: null };
    },
    enabled: !!itemId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
