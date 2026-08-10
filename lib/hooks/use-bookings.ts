"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "@/lib/api/bookings";
import type { BookingInput, BookingStatus } from "@/types";

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "my-bookings"],
    queryFn: () => bookingApi.getMyBookings(),
  });
}

export function useBookingDetails(bookingId: string) {
  return useQuery({
    queryKey: ["bookings", "detail", bookingId],
    queryFn: () => bookingApi.getBookingDetails(bookingId),
    enabled: !!bookingId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingInput) => bookingApi.createBooking(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // Flights have a live availableSeats count that the backend just
      // decremented — refresh so the detail/list pages reflect it.
      if (variables.category === "flights") {
        queryClient.invalidateQueries({ queryKey: ["flights"] });
      }
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // A cancelled flight booking releases its seat back.
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}

// Provider/Admin — wired into UI in Stage 5/6
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: BookingStatus }) =>
      bookingApi.updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
