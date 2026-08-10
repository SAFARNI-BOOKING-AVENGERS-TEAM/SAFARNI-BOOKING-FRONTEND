"use client";

import { apiClient } from "./client";
import type { ApiResponse, Booking, BookingInput, BookingStatus } from "@/types";

export const bookingApi = {
  createBooking: async (payload: BookingInput) => {
    const res = await apiClient.post<ApiResponse<Booking>>("/bookings", payload);
    return res.data;
  },

  getMyBookings: async () => {
    const res = await apiClient.get<ApiResponse<Booking[]>>("/bookings/my-bookings");
    return res.data;
  },

  getBookingDetails: async (bookingId: string) => {
    const res = await apiClient.get<ApiResponse<Booking>>(`/bookings/${bookingId}`);
    return res.data;
  },

  cancelBooking: async (bookingId: string) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${bookingId}/cancel`);
    return res.data;
  },

  // Provider/Admin only — wired into UI in Stage 5/6
  updateBookingStatus: async (bookingId: string, status: BookingStatus) => {
    const res = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${bookingId}/status`, {
      status,
    });
    return res.data;
  },

  // Admin stats — wired into UI in Stage 6
  getBookingsByCategory: async () => {
    const res = await apiClient.get<ApiResponse<{ _id: string; totalBookings: number }[]>>(
      "/bookings/admin/stats/by-category"
    );
    return res.data;
  },

  getRevenueByCategory: async () => {
    const res = await apiClient.get<
      ApiResponse<{ _id: string; totalRevenue: number; totalBookings: number }[]>
    >("/bookings/admin/stats/revenue");
    return res.data;
  },

  getBookingsByStatus: async () => {
    const res = await apiClient.get<ApiResponse<{ _id: string; count: number }[]>>(
      "/bookings/admin/stats/by-status"
    );
    return res.data;
  },
};
