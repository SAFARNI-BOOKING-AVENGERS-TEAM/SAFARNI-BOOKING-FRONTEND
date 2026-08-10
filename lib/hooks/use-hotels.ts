"use client";

import { useQuery } from "@tanstack/react-query";
import { hotelApi, HotelListParams } from "@/lib/api/hotels";

export function useHotels(params: HotelListParams = {}) {
  return useQuery({
    queryKey: ["hotels", "list", params],
    queryFn: () => hotelApi.getHotels(params),
    // v5's replacement for keepPreviousData — keeps the last page's cards on
    // screen (instead of flashing the skeleton grid) while the next page loads.
    placeholderData: (prev) => prev,
  });
}

export function useHotelDetails(hotelId: string) {
  return useQuery({
    queryKey: ["hotels", "detail", hotelId],
    queryFn: () => hotelApi.getHotelDetails(hotelId),
    enabled: !!hotelId,
  });
}
