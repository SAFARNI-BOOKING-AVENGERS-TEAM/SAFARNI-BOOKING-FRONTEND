"use client";

import { apiClient } from "./client";
import type { HotelListApiResponse, HotelDetailApiResponse, ApiResponse } from "@/types";

export interface HotelListParams {
  city?: string;
  name?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

export const hotelApi = {
  getHotels: async (params: HotelListParams = {}) => {
    const res = await apiClient.get<HotelListApiResponse>("/hotels", { params });
    return res.data;
  },

  getHotelDetails: async (hotelId: string) => {
    const res = await apiClient.get<HotelDetailApiResponse>(`/hotels/${hotelId}`);
    return res.data;
  },

  // ─── Provider/Admin management — wired up in Stage 5/6, kept here now
  // since the routes were already in front of us ───
  createHotel: async (payload: any) => {
    const res = await apiClient.post<ApiResponse<any>>("/hotels/admin/hotels", payload);
    return res.data;
  },

  updateHotel: async (hotelId: string, payload: any) => {
    const res = await apiClient.patch<ApiResponse<any>>(`/hotels/admin/hotels/${hotelId}`, payload);
    return res.data;
  },

  deleteHotel: async (hotelId: string) => {
    const res = await apiClient.delete<ApiResponse<any>>(`/hotels/admin/hotels/${hotelId}`);
    return res.data;
  },

  createRoom: async (hotelId: string, payload: any) => {
    const res = await apiClient.post<ApiResponse<any>>(`/hotels/admin/${hotelId}/rooms`, payload);
    return res.data;
  },

  updateRoom: async (roomId: string, payload: any) => {
    const res = await apiClient.patch<ApiResponse<any>>(`/hotels/admin/rooms/${roomId}`, payload);
    return res.data;
  },

  deleteRoom: async (roomId: string) => {
    const res = await apiClient.delete<ApiResponse<any>>(`/hotels/admin/rooms/${roomId}`);
    return res.data;
  },

  uploadHotelImages: async (hotelId: string, formData: FormData) => {
    const res = await apiClient.post<ApiResponse<any>>(`/hotels/admin/${hotelId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  updateHotelStatus: async (hotelId: string, status: "approved" | "rejected") => {
    const res = await apiClient.patch<ApiResponse<any>>(`/hotels/admin/hotels/${hotelId}/status`, {
      status,
    });
    return res.data;
  },
};
