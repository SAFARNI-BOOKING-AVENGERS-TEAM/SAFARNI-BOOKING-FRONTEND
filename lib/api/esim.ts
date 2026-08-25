"use client";

import { apiClient } from "./client";
import type { PaginatedResponse, ApiResponse, ESIMPlan, ESIMOrder } from "@/types";

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
    const res = await apiClient.patch<ApiResponse<ESIMPlan>>(`/esim/plans/${id}/status`, { status });
    return res.data;
  },

  createOrder: async (planId: string, packageBookingId?: string) => {
    const res = await apiClient.post<ApiResponse<ESIMOrder>>("/esim/orders", {
      planId,
      ...(packageBookingId && { packageBookingId }),
    });
    return res.data;
  },

  getMyOrders: async () => {
    const res = await apiClient.get<ApiResponse<ESIMOrder[]>>("/esim/orders/my-orders");
    return res.data;
  },

  getOrderDetails: async (id: string) => {
    const res = await apiClient.get<ApiResponse<ESIMOrder>>(`/esim/orders/${id}`);
    return res.data;
  },

  retryProvision: async (id: string) => {
    const res = await apiClient.post<ApiResponse<ESIMOrder>>(`/esim/orders/${id}/retry-provision`);
    return res.data;
  },

  activateOrder: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<ESIMOrder>>(`/esim/orders/${id}/activate`);
    return res.data;
  },
};
