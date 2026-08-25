"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Calendar, DollarSign, ArrowRight, ShieldCheck, Clock3 } from "lucide-react";
import { Card, CardContent, Skeleton } from "@/components/ui";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatPrice } from "@/lib/utils";

const serviceLabels: Record<string, string> = {
  hotels: "Hotels",
  cars: "Cars",
  flights: "Flights",
  tours: "Tours",
  packages: "Packages",
  esimPlans: "eSIM plans",
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: dashboardApi.getAdminStats,
    staleTime: 60_000,
  });

  const stats = response?.data;
  const services = stats?.services ? Object.entries(stats.services) : [];
  const pendingServices = services.reduce((sum, [, value]) => sum + value.pending, 0);
  const totalBookings = stats?.bookings.byCategory.reduce((sum, item) => sum + item.totalBookings, 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-sm text-gray-500 mb-6">Here&apos;s what&apos;s happening across SAFARNI</p>

      {isError ? (
        <Card className="mb-6"><CardContent className="p-5 text-sm text-red-600">Couldn&apos;t load dashboard statistics. Please try again.</CardContent></Card>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <MetricCard href="/admin-users" icon={<Users className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : stats?.users.total ?? 0} label="Total users" />
        <MetricCard href="/admin-providers" icon={<Briefcase className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : stats?.users.byRole.provider ?? 0} label="Providers" />
        <MetricCard href="/admin-bookings" icon={<Calendar className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : totalBookings} label="Bookings" />
        <MetricCard href="/admin-bookings" icon={<DollarSign className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : formatPrice(stats?.payments.totalConfirmedRevenue ?? 0)} label="Confirmed revenue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Service overview</h2>
            <Link href="/admin-services" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">Manage <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-2">
            {isLoading ? <Skeleton className="h-48 w-full rounded-xl" /> : services.map(([key, value]) => (
              <Card key={key}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{serviceLabels[key] ?? key}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{value.approved} approved · {value.pending} pending</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{value.total}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Needs attention</h2>
          <div className="space-y-2">
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Clock3 className="w-5 h-5 text-gray-600" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-gray-900">Pending service approvals</p><p className="text-xs text-gray-500">Listings waiting for admin review</p></div>
                <span className="text-xl font-bold text-gray-900">{isLoading ? "—" : pendingServices}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-gray-600" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-gray-900">Admin accounts</p><p className="text-xs text-gray-500">Users with full platform access</p></div>
                <span className="text-xl font-bold text-gray-900">{isLoading ? "—" : stats?.users.byRole.admin ?? 0}</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3"><div><p className="text-sm font-medium text-gray-900">eSIM performance</p><p className="text-xs text-gray-500">Completed orders and recorded revenue</p></div></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xl font-bold text-gray-900">{isLoading ? "—" : stats?.esim.completedOrders ?? 0}</p><p className="text-xs text-gray-500">Completed orders</p></div>
                  <div><p className="text-xl font-bold text-gray-900">{isLoading ? "—" : formatPrice(stats?.esim.revenue ?? 0)}</p><p className="text-xs text-gray-500">Revenue</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ href, icon, value, label }: { href: string; icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
          <div><p className="text-2xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
        </CardContent>
      </Card>
    </Link>
  );
}
