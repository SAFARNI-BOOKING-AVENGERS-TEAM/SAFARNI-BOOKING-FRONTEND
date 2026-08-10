"use client";

import { apiClient } from "./client";
import type { PaginatedResponse, ApiResponse, ESIMPlan } from "@/types";

export interface ESIMListParams {
  country?: string;
  region?: string;
  page?: number;
  limit?: number;
}

export const esimApi = {
  getPlans: async (params: ESIMListParams = {}) => {
    const res = await apiClient.get<PaginatedResponse<ESIMPlan>>("/esim/plans", { params });
    return res.data;
  },

  getPlanDetails: async (id: string) => {
    const res = await apiClient.get<ApiResponse<ESIMPlan>>(`/esim/plans/${id}`);
    return res.data;
  },

  createPlan: async (payload: any) => {
    const res = await apiClient.post<ApiResponse<ESIMPlan>>("/esim/plans", payload);
    return res.data;
  },

  updatePlan: async (id: string, payload: any) => {
    const res = await apiClient.patch<ApiResponse<ESIMPlan>>(`/esim/plans/${id}`, payload);
    return res.data;
  },

  deletePlan: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<ESIMPlan>>(`/esim/plans/${id}`);
    return res.data;
  },

  updatePlanStatus: async (id: string, status: "approved" | "rejected") => {
    const res = await apiClient.patch<ApiResponse<ESIMPlan>>(`/esim/plans/${id}/status`, {
      status,
    });
    return res.data;
  },
};
