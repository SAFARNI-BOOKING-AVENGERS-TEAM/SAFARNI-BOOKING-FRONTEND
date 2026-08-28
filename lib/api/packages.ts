"use client";

import { apiClient } from "./client";
import type {
  ApiResponse,
  Package,
  PackageDetailsData,
  PackageBookingResult,
  BookingCategory,
} from "@/types";

type PackageWritePayload = Record<string, unknown>;

export interface PackageBookingItemInput {
  category: BookingCategory;
  itemId: string;
  startDate: string;
  endDate: string;
  details?: Record<string, unknown>;
}

export const packageApi = {
  getPackages: async () => {
    const res = await apiClient.get<ApiResponse<Package[]>>("/packages");
    return res.data;
  },

  getPackageDetails: async (id: string) => {
    const res = await apiClient.get<ApiResponse<PackageDetailsData>>(`/packages/${id}`);
    return res.data;
  },

  createPackage: async (payload: PackageWritePayload) => {
    const res = await apiClient.post<ApiResponse<Package>>("/packages", payload);
    return res.data;
  },

  updatePackageStatus: async (id: string, status: "approved" | "rejected") => {
    const res = await apiClient.patch<ApiResponse<Package>>(`/packages/${id}/status`, { status });
    return res.data;
  },

  updatePackageFeatured: async (id: string, featured: boolean) => {
    const res = await apiClient.patch<ApiResponse<Package>>(`/packages/${id}/featured`, {
      featured,
    });
    return res.data;
  },

  bookPackage: async (id: string, items: PackageBookingItemInput[]) => {
    const res = await apiClient.post<ApiResponse<PackageBookingResult>>(`/packages/${id}/book`, {
      items,
    });
    return res.data;
  },
};
