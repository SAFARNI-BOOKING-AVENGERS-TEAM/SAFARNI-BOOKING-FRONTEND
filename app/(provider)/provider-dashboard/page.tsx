"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Calendar, DollarSign, Clock3, ArrowRight, CheckCircle2, XCircle, Smartphone } from "lucide-react";
import { Card, CardContent, Skeleton } from "@/components/ui";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatPrice } from "@/lib/utils";

const serviceLabels: Record<string, string> = {
  hotels: "Hotels",
  cars: "Cars",
  flights: "Flights",
  tours: "Tours",
  esimPlans: "eSIM plans",
};

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["provider", "dashboard", "stats"],
    queryFn: dashboardApi.getProviderStats,
    staleTime: 60_000,
  });

  const stats = response?.data;
  const services = stats?.services ? Object.entries(stats.services) : [];
  const totalServices = services.reduce((sum, [, value]) => sum + value.total, 0);
  const pendingServices = services.reduce((sum, [, value]) => sum + value.pending, 0);
  const totalOperations = (stats?.bookings.total ?? 0) + (stats?.esim.totalOrders ?? 0);
  const hasESIMScope = user?.providerType === "telecom" || user?.providerType === "both" || (stats?.services.esimPlans.total ?? 0) > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-sm text-gray-500 mb-6">Here&apos;s how your SAFARNI services are performing</p>

      {isError ? (
        <Card className="mb-6"><CardContent className="p-5 text-sm text-red-600">Couldn&apos;t load dashboard statistics. Please try again.</CardContent></Card>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <MetricCard href="/my-services" icon={<Briefcase className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : totalServices} label="My services" />
        <MetricCard href="/provider-bookings" icon={<Calendar className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : totalOperations} label="Bookings & orders" />
        <MetricCard href="/earnings" icon={<DollarSign className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : formatPrice(stats?.revenue.total ?? 0)} label="Paid revenue" />
        <MetricCard href="/my-services" icon={<Clock3 className="w-5 h-5 text-gray-600" />} value={isLoading ? "—" : pendingServices} label="Pending approval" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">My services</h2>
            <Link href="/my-services" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Operations</h2>
            <Link href="/provider-bookings" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-2">
            <StatusCard icon={<CheckCircle2 className="w-5 h-5 text-gray-600" />} label="Confirmed travel bookings" description="Stripe-paid confirmed reservations" value={isLoading ? "—" : stats?.bookings.byStatus.confirmed ?? 0} />
            <StatusCard icon={<Clock3 className="w-5 h-5 text-gray-600" />} label="Pending travel bookings" description="Reservations awaiting payment" value={isLoading ? "—" : stats?.bookings.byStatus.pending ?? 0} />
            {hasESIMScope && <StatusCard icon={<Smartphone className="w-5 h-5 text-gray-600" />} label="Completed eSIM orders" description="Paid and successfully provisioned" value={isLoading ? "—" : stats?.esim.completedOrders ?? 0} />}
            {hasESIMScope && <StatusCard icon={<Clock3 className="w-5 h-5 text-gray-600" />} label="Pending eSIM orders" description="Awaiting payment or provisioning" value={isLoading ? "—" : stats?.esim.pendingOrders ?? 0} />}
            {!hasESIMScope && <StatusCard icon={<XCircle className="w-5 h-5 text-gray-600" />} label="Cancelled bookings" description="Cancelled travel reservations" value={isLoading ? "—" : stats?.bookings.byStatus.cancelled ?? 0} />}
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

function StatusCard({ icon, label, description, value }: { icon: React.ReactNode; label: string; description: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
        <div className="flex-1"><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-xs text-gray-500">{description}</p></div>
        <span className="text-xl font-bold text-gray-900">{value}</span>
      </CardContent>
    </Card>
  );
}
