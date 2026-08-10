"use client";

import { useQuery } from "@tanstack/react-query";
import { esimApi, ESIMListParams } from "@/lib/api/esim";

export function useESIMPlans(params: ESIMListParams = {}) {
  return useQuery({
    queryKey: ["esim", "list", params],
    queryFn: () => esimApi.getPlans(params),
    placeholderData: (prev) => prev,
  });
}

export function useESIMPlanDetails(id: string) {
  return useQuery({
    queryKey: ["esim", "detail", id],
    queryFn: () => esimApi.getPlanDetails(id),
    enabled: !!id,
  });
}
