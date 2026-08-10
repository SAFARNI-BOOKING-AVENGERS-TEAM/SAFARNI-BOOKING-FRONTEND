"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packageApi } from "@/lib/api/packages";
import type { BookingCategory } from "@/types";

export function usePackages() {
  return useQuery({
    queryKey: ["packages", "list"],
    queryFn: () => packageApi.getPackages(),
  });
}

export function usePackageDetails(id: string) {
  return useQuery({
    queryKey: ["packages", "detail", id],
    queryFn: () => packageApi.getPackageDetails(id),
    enabled: !!id,
  });
}

// Reuses the same cached list query for the home page's "Featured" rail
// instead of firing a second request for what's really a client-side filter.
export function useFeaturedPackages(limit = 4) {
  const query = usePackages();
  return {
    ...query,
    data: query.data
      ? { ...query.data, data: query.data.data.filter((p) => p.featured).slice(0, limit) }
      : undefined,
  };
}

export function useBookPackage(packageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      items: {
        category: BookingCategory;
        itemId: string;
        startDate: string;
        endDate: string;
        details?: any;
      }[]
    ) => packageApi.bookPackage(packageId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // A package can include flights, which have live seat counts.
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}
