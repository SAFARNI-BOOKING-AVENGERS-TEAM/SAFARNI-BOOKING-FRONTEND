"use client";

import { useQuery } from "@tanstack/react-query";
import { flightApi, FlightListParams } from "@/lib/api/flights";

// Same backend gap as cars — see use-cars.ts.
export function useFlights(params: FlightListParams = {}) {
  return useQuery({
    queryKey: ["flights", "list", params],
    queryFn: async () => {
      const res = await flightApi.getFlights(params);
      return { ...res, data: res.data.filter((f) => f.status === "approved") };
    },
    placeholderData: (prev) => prev,
  });
}

export function useFlightDetails(id: string) {
  return useQuery({
    queryKey: ["flights", "detail", id],
    queryFn: () => flightApi.getFlightById(id),
    enabled: !!id,
  });
}
