"use client";

import { useQuery } from "@tanstack/react-query";
import { carApi, CarListParams } from "@/lib/api/cars";

// GET /cars has no status filtering on the backend — it returns
// pending/rejected cars to anyone. We defensively filter to "approved"
// here since this hook is for public browsing pages. (Provider/Admin
// management pages should call carApi.getCars() directly, unfiltered,
// once those are built in Stage 5/6.)
export function useCars(params: CarListParams = {}) {
  return useQuery({
    queryKey: ["cars", "list", params],
    queryFn: async () => {
      const res = await carApi.getCars(params);
      return { ...res, data: res.data.filter((c) => c.status === "approved") };
    },
    placeholderData: (prev) => prev,
  });
}

export function useCarDetails(id: string) {
  return useQuery({
    queryKey: ["cars", "detail", id],
    queryFn: () => carApi.getCarById(id),
    enabled: !!id,
  });
}
