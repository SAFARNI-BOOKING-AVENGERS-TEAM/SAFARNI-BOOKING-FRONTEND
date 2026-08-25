"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Smartphone } from "lucide-react";
import { Card, CardContent, Skeleton, EmptyState } from "@/components/ui";
import { providerApi, type ProviderCustomer } from "@/lib/api/provider";
import { formatDate, formatPrice } from "@/lib/utils";

const badgeClass: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  cancelled: "bg-gray-100 text-gray-600",
  failed: "bg-red-50 text-red-700",
};

const customerLabel = (user: ProviderCustomer | string) =>
  typeof user === "string" ? "Customer" : user.name || user.email || "Customer";

export default function ProviderBookingsPage() {
  const operationsQuery = useQuery({
    queryKey: ["provider", "operations"],
    queryFn: providerApi.getOperations,
  });

  const bookings = operationsQuery.data?.data.bookings ?? [];
  const esimOrders = operationsQuery.data?.data.esimOrders ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Bookings & Orders</h1>
      <p className="text-sm text-gray-500 mb-6">Travel reservations and eSIM orders connected to your own SAFARNI inventory.</p>

      {operationsQuery.isLoading ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : operationsQuery.isError ? (
        <EmptyState title="Couldn't load provider operations" description="Please try again." />
      ) : (
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Travel bookings</h2>
              <span className="text-xs text-gray-500">{bookings.length}</span>
            </div>
            {!bookings.length ? (
              <Card><CardContent className="p-6 text-sm text-gray-500">No travel bookings for your inventory yet.</CardContent></Card>
            ) : (
              <Card><div className="overflow-x-auto"><table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500"><tr><th className="px-5 py-3 text-left font-medium">Customer</th><th className="px-5 py-3 text-left font-medium">Category</th><th className="px-5 py-3 text-left font-medium">Dates</th><th className="px-5 py-3 text-left font-medium">Amount</th><th className="px-5 py-3 text-left font-medium">Status</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-5 py-4"><p className="font-medium text-gray-900">{customerLabel(booking.userId)}</p>{typeof booking.userId !== "string" && booking.userId.email && <p className="text-xs text-gray-500">{booking.userId.email}</p>}</td>
                      <td className="px-5 py-4 capitalize text-gray-600">{booking.category}</td>
                      <td className="px-5 py-4 text-gray-600">{formatDate(booking.startDate)} — {formatDate(booking.endDate)}</td>
                      <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(booking.totalPrice)}</td>
                      <td className="px-5 py-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${badgeClass[booking.status] ?? badgeClass.cancelled}`}>{booking.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table></div></Card>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">eSIM orders</h2>
              <span className="text-xs text-gray-500">{esimOrders.length}</span>
            </div>
            {!esimOrders.length ? (
              <Card><CardContent className="p-6 text-sm text-gray-500">No eSIM orders for your plans yet.</CardContent></Card>
            ) : (
              <Card><div className="overflow-x-auto"><table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500"><tr><th className="px-5 py-3 text-left font-medium">Customer</th><th className="px-5 py-3 text-left font-medium">Plan</th><th className="px-5 py-3 text-left font-medium">Amount</th><th className="px-5 py-3 text-left font-medium">Status</th><th className="px-5 py-3 text-left font-medium">Created</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {esimOrders.map((order) => {
                    const plan = typeof order.planId === "string" ? null : order.planId;
                    return (
                      <tr key={order._id}>
                        <td className="px-5 py-4"><p className="font-medium text-gray-900">{customerLabel(order.userId)}</p>{typeof order.userId !== "string" && order.userId.email && <p className="text-xs text-gray-500">{order.userId.email}</p>}</td>
                        <td className="px-5 py-4"><p className="font-medium text-gray-900">{plan?.name ?? "eSIM plan"}</p><p className="text-xs text-gray-500">{plan?.country ?? ""}</p></td>
                        <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(order.price, order.currency)}</td>
                        <td className="px-5 py-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${badgeClass[order.status] ?? badgeClass.cancelled}`}>{order.status}</span></td>
                        <td className="px-5 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div></Card>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
