"use client";

import { apiClient } from "./client";
import type { ApiResponse, BookingCategory, BookingStatus, ESIMOrderStatus } from "@/types";

export interface ProviderCustomer {
  _id?: string;
  name?: string;
  email?: string;
}

export interface ProviderBooking {
  _id: string;
  userId: ProviderCustomer | string;
  category: BookingCategory;
  itemId: string;
  packageBookingId?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface ProviderESIMOrder {
  _id: string;
  userId: ProviderCustomer | string;
  planId: {
    _id?: string;
    name?: string;
    country?: string;
    region?: string;
    dataAmount?: number;
    dataUnit?: string;
    validityDays?: number;
  } | string;
  status: ESIMOrderStatus;
  price: number;
  currency: string;
  createdAt: string;
}

export interface ProviderOperations {
  bookings: ProviderBooking[];
  esimOrders: ProviderESIMOrder[];
}

export const providerApi = {
  getOperations: async () => {
    const res = await apiClient.get<ApiResponse<ProviderOperations>>("/provider/operations");
    return res.data;
  },
};
