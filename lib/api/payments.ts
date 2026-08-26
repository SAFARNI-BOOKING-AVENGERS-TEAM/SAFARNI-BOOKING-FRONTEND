"use client";

import { apiClient } from "./client";
import type { ApiResponse } from "@/types";

export type PaymentTarget = {
  bookingId?: string;
  packageBookingId?: string;
  esimOrderId?: string;
};

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
  amount: number;
  currency: string;
  bookingsIncluded: number;
}

export interface CheckoutVerification {
  sessionId: string;
  sessionStatus: string | null;
  paymentStatus: string;
  paymentRecordStatus: "pending" | "succeeded" | "failed";
  fulfillmentStatus: string;
  amount: number;
  currency: string;
  bookingId?: string;
  packageBookingId?: string;
  esimOrderId?: string;
}

export const paymentsApi = {
  createCheckoutSession: async (target: PaymentTarget) => {
    const res = await apiClient.post<ApiResponse<CheckoutSessionResult>>("/payments/checkout-session", target);
    return res.data;
  },

  verifyCheckoutSession: async (sessionId: string) => {
    const res = await apiClient.get<ApiResponse<CheckoutVerification>>(
      `/payments/checkout-session/${encodeURIComponent(sessionId)}`,
      { timeout: 20000 }
    );
    return res.data;
  },
};
