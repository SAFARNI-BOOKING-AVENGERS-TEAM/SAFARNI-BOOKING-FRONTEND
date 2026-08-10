"use client";

import { apiClient } from "./client";
import type { ApiResponse, Flight } from "@/types";

export interface FlightListParams {
  departureAirport?: string;
  arrivalAirport?: string;
  date?: string;
  class?: string;
}

export const flightApi = {
  // Same status-filtering gap as cars — see useFlights().
  getFlights: async (params: FlightListParams = {}) => {
    const res = await apiClient.get<ApiResponse<Flight[]>>("/flights", { params });
    return res.data;
  },

  getFlightById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Flight>>(`/flights/${id}`);
    return res.data;
  },

  createFlight: async (payload: any) => {
    const res = await apiClient.post<ApiResponse<Flight>>("/flights/createFlight", payload);
    return res.data;
  },

  updateFlight: async (id: string, payload: any) => {
    const res = await apiClient.patch<ApiResponse<Flight>>(`/flights/updateFlight/${id}`, payload);
    return res.data;
  },

  deleteFlight: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<Flight>>(`/flights/deleteFlight/${id}`);
    return res.data;
  },

  updateFlightStatus: async (id: string, status: "approved" | "rejected") => {
    const res = await apiClient.patch<ApiResponse<Flight>>(`/flights/updateFlightStatus/${id}`, {
      status,
    });
    return res.data;
  },
};
