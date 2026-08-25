"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, Plane, Smartphone } from "lucide-react";
import { Card, CardContent, Skeleton, EmptyState } from "@/components/ui";
import { dashboardApi } from "@/lib/api/dashboard";
import { formatPrice } from "@/lib/utils";

export default function ProviderEarningsPage() {
  const statsQuery = useQuery({
    queryKey: ["provider", "dashboard", "stats"],
    queryFn: dashboardApi.getProviderStats,
  });
  const stats = statsQuery.data?.data;

  if (statsQuery.isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (statsQuery.isError || !stats) return <EmptyState title="Couldn't load earnings" description="Please try again." />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Earnings</h1>
      <p className="text-sm text-gray-500 mb-6">Confirmed travel revenue and paid, fulfilled eSIM revenue from your own inventory.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <RevenueCard icon={<DollarSign className="w-5 h-5 text-gray-600" />} label="Total revenue" value={stats.revenue.total} />
        <RevenueCard icon={<Plane className="w-5 h-5 text-gray-600" />} label="Travel revenue" value={stats.revenue.travel} />
        <RevenueCard icon={<Smartphone className="w-5 h-5 text-gray-600" />} label="eSIM revenue" value={stats.revenue.esim} />
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold text-gray-900">Revenue rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Travel</p>
              <p className="text-gray-500 mt-1">Only confirmed bookings are included. Stripe payment is required before a booking can be confirmed.</p>
              <p className="text-lg font-bold text-gray-900 mt-3">{stats.bookings.byStatus.confirmed}</p>
              <p className="text-xs text-gray-500">confirmed bookings</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">eSIM</p>
              <p className="text-gray-500 mt-1">Revenue is counted only after payment succeeds and the eSIM order reaches completed provisioning.</p>
              <p className="text-lg font-bold text-gray-900 mt-3">{stats.esim.completedOrders}</p>
              <p className="text-xs text-gray-500">completed eSIM orders</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RevenueCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
        <div><p className="text-xl font-bold text-gray-900">{formatPrice(value)}</p><p className="text-xs text-gray-500">{label}</p></div>
      </CardContent>
    </Card>
  );
}
