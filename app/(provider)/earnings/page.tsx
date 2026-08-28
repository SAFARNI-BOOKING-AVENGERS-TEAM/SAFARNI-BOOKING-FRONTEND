"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, Percent, WalletCards, Smartphone } from "lucide-react";
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

  const earnings = stats.earnings;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Earnings</h1>
      <p className="text-sm text-gray-500 mb-6">
        SAFARNI applies a {earnings.commissionRatePercent}% commission to completed travel bookings. Stripe fees are separate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <RevenueCard icon={<WalletCards className="w-5 h-5 text-gray-600" />} label="Net provider earnings" value={earnings.totalProviderEarnings} />
        <RevenueCard icon={<DollarSign className="w-5 h-5 text-gray-600" />} label="Completed travel gross" value={earnings.grossCompleted} />
        <RevenueCard icon={<Percent className="w-5 h-5 text-gray-600" />} label="SAFARNI commission" value={earnings.platformCommission} />
        <RevenueCard icon={<Smartphone className="w-5 h-5 text-gray-600" />} label="Completed eSIM revenue" value={earnings.esimGross} />
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold text-gray-900">Settlement rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 text-sm">
            <SettlementItem label="Completed travel bookings" value={String(earnings.completedBookings)} note="Confirmed bookings whose end date has passed" />
            <SettlementItem label="Travel net payable" value={formatPrice(earnings.providerNet)} note={`Gross minus ${earnings.commissionRatePercent}% SAFARNI commission`} />
            <SettlementItem label="Pending completion" value={formatPrice(earnings.pendingGross)} note="Paid bookings not yet completed" />
            <SettlementItem label="Refund reversal pending" value={formatPrice(earnings.reversalPendingGross)} note="Cancelled paid bookings awaiting refund resolution" />
          </div>

          {(earnings.reversedGross > 0 || earnings.reversedCommission > 0) && (
            <div className="mt-4 rounded-lg border border-gray-200 p-4 text-sm">
              <p className="font-medium text-gray-900">Refund reversals</p>
              <p className="text-gray-500 mt-1">
                Refunded travel gross {formatPrice(earnings.reversedGross)} · reversed SAFARNI commission {formatPrice(earnings.reversedCommission)}
              </p>
            </div>
          )}
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

function SettlementItem({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{note}</p>
    </div>
  );
}
