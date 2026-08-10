"use client";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { addToast } from "@/store/slices/uiSlice";

/**
 * Call this from any React Query mutation's onSuccess/onError instead of
 * dispatching addToast directly — keeps the action-shape detail out of
 * every page. e.g.:
 *
 *   const toast = useToast();
 *   const createBooking = useMutation({
 *     mutationFn: bookingApi.create,
 *     onSuccess: () => toast.success("Booking confirmed"),
 *     onError: (err) => toast.error("Booking failed", getApiErrorMessage(err)),
 *   });
 */
export function useToast() {
  const dispatch = useDispatch<AppDispatch>();

  return {
    success: (message: string, description?: string) =>
      dispatch(addToast({ type: "success", message, description })),
    error: (message: string, description?: string) =>
      dispatch(addToast({ type: "error", message, description })),
    info: (message: string, description?: string) =>
      dispatch(addToast({ type: "info", message, description })),
    warning: (message: string, description?: string) =>
      dispatch(addToast({ type: "warning", message, description })),
  };
}
