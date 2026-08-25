"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Skeleton } from "@/components/ui";
import { adminApi, type AdminBooking } from "@/lib/api/admin";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";

export default function AdminBookingsPage() {
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({ queryKey: ["admin", "bookings", category, status], queryFn: () => adminApi.getBookings({ category, status }), staleTime: 10_000 });
  const bookings = query.data?.data?.items ?? [];
  const total = query.data?.data?.pagination.total ?? 0;

  const mutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: AdminBooking["status"] }) => adminApi.updateBookingStatus(id, nextStatus),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] }); queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] }); toast.success("Booking status updated"); },
    onError: (error) => toast.error("Couldn't update booking", getApiErrorMessage(error)),
  });

  return <div>
    <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Bookings</h1><p className="text-sm text-gray-500 mt-1">Monitor reservations across SAFARNI and intervene when a booking needs operational handling.</p></div>
    <Card className="mb-5"><div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3"><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"><option value="">All categories</option><option value="hotels">Hotels</option><option value="flights">Flights</option><option value="cars">Cars</option><option value="tours">Tours</option></select><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"><option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select><span className="sm:ml-auto text-sm text-gray-500">{total} bookings</span></div></Card>
    {query.isLoading ? <Skeleton className="h-80 w-full rounded-xl" /> : <Card><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="px-5 py-3 text-left font-medium">Traveler</th><th className="px-5 py-3 text-left font-medium">Service</th><th className="px-5 py-3 text-left font-medium">Dates</th><th className="px-5 py-3 text-left font-medium">Total</th><th className="px-5 py-3 text-left font-medium">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{bookings.map((booking) => {
      const traveler = typeof booking.userId === "object" ? booking.userId : undefined;
      return <tr key={booking._id}><td className="px-5 py-4"><p className="font-medium text-gray-900">{traveler?.name || "Traveler"}</p><p className="text-xs text-gray-500">{traveler?.email || `Booking ${booking._id.slice(-6)}`}</p></td><td className="px-5 py-4"><span className="capitalize font-medium text-gray-800">{booking.category}</span><p className="text-xs text-gray-400 mt-0.5">{booking.itemId.slice(-10)}</p></td><td className="px-5 py-4 text-gray-600">{new Date(booking.startDate).toLocaleDateString()}<span className="text-gray-400"> → </span>{new Date(booking.endDate).toLocaleDateString()}</td><td className="px-5 py-4 font-medium text-gray-900">{formatPrice(booking.totalPrice)}</td><td className="px-5 py-4"><select value={booking.status} disabled={mutation.isPending} onChange={(e) => mutation.mutate({ id: booking._id, nextStatus: e.target.value as AdminBooking["status"] })} className={`h-9 px-2 rounded-lg border text-xs font-medium capitalize bg-white ${booking.status === "confirmed" ? "border-emerald-200 text-emerald-700" : booking.status === "cancelled" ? "border-red-200 text-red-700" : "border-amber-200 text-amber-700"}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></td></tr>;
    })}{!bookings.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-500">No bookings match these filters.</td></tr>}</tbody></table></div></Card>}
  </div>;
}