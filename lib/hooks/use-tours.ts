"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tourApi, TourListParams } from "@/lib/api/tours";

export function useTours(params: TourListParams = {}) {
  return useQuery({
    queryKey: ["tours", "list", params],
    queryFn: () => tourApi.getTours(params),
    placeholderData: (prev) => prev,
  });
}

export function useTourDetails(id: string) {
  return useQuery({
    queryKey: ["tours", "detail", id],
    queryFn: () => tourApi.getTourById(id),
    enabled: !!id,
  });
}

export function useTourReviews(id: string) {
  return useQuery({
    queryKey: ["tours", "reviews", id],
    queryFn: () => tourApi.getTourReviews(id),
    enabled: !!id,
  });
}

// Built now (not deferred) since the tour detail page can use it
// immediately — the backend already enforces "confirmed booking required"
// and returns a clear error otherwise, which the page surfaces via toast.
export function useAddTourReview(tourId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rating, comment }: { rating: number; comment?: string }) =>
      tourApi.addOrUpdateReview(tourId, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours", "reviews", tourId] });
    },
  });
}
