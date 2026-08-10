"use client";

import { apiClient } from "./client";
import type {
  ApiResponse,
  PaginatedResponse,
  Tour,
  TourReviewsData,
  RawTourReview,
} from "@/types";

export interface TourListParams {
  title?: string;
  city?: string;
  difficulty?: string;
  recommended?: boolean;
  page?: number;
  limit?: number;
  status?: string;
}

export const tourApi = {
  getTours: async (params: TourListParams = {}) => {
    const res = await apiClient.get<PaginatedResponse<Tour>>("/tours", { params });
    return res.data;
  },

  getTourById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Tour>>(`/tours/${id}`);
    return res.data;
  },

  createTour: async (payload: any) => {
    const res = await apiClient.post<ApiResponse<Tour>>("/tours/createTour", payload);
    return res.data;
  },

  updateTour: async (id: string, payload: any) => {
    const res = await apiClient.patch<ApiResponse<Tour>>(`/tours/updateTour/${id}`, payload);
    return res.data;
  },

  deleteTour: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<Tour>>(`/tours/deleteTour/${id}`);
    return res.data;
  },

  updateTourStatus: async (tourId: string, status: "approved" | "rejected") => {
    const res = await apiClient.patch<ApiResponse<Tour>>(`/tours/admin/tours/${tourId}/status`, {
      status,
    });
    return res.data;
  },

  getTourReviews: async (id: string) => {
    const res = await apiClient.get<ApiResponse<TourReviewsData>>(`/tours/${id}/reviews`);
    return res.data;
  },

  addOrUpdateReview: async (id: string, rating: number, comment?: string) => {
    const res = await apiClient.post<ApiResponse<RawTourReview[]>>(`/tours/${id}/reviews`, {
      rating,
      comment,
    });
    return res.data;
  },

  deleteReview: async (id: string, reviewUserId: string) => {
    const res = await apiClient.delete<ApiResponse<RawTourReview[]>>(
      `/tours/${id}/reviews/${reviewUserId}`
    );
    return res.data;
  },
};
