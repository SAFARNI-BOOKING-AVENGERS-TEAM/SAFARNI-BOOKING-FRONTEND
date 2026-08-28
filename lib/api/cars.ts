"use client";

import { apiClient } from "./client";
import type { ApiResponse, Car } from "@/types";

export interface CarListParams {
  city?: string;
  type?: string;
  available?: boolean;
}

type CarWritePayload = Record<string, unknown>;

export const carApi = {
  // NOTE: backend applies no status filtering here — see useCars() for the
  // client-side safety net used on public pages.
  getCars: async (params: CarListParams = {}) => {
    const res = await apiClient.get<ApiResponse<Car[]>>("/cars", { params });
    return res.data;
  },

  getCarById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Car>>(`/cars/${id}`);
    return res.data;
  },

  createCar: async (payload: CarWritePayload) => {
    const res = await apiClient.post<ApiResponse<Car>>("/cars/createCar", payload);
    return res.data;
  },

  updateCar: async (id: string, payload: CarWritePayload) => {
    const res = await apiClient.patch<ApiResponse<Car>>(`/cars/updateCar/${id}`, payload);
    return res.data;
  },

  deleteCar: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<Car>>(`/cars/deleteCar/${id}`);
    return res.data;
  },

  updateCarStatus: async (id: string, status: "approved" | "rejected") => {
    const res = await apiClient.patch<ApiResponse<Car>>(`/cars/admin/${id}/status`, { status });
    return res.data;
  },
};
