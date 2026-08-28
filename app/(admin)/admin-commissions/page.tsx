"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Skeleton, EmptyState } from "@/components/ui";
import { adminApi, type CommissionStatus } from "@/lib/api/admin";
import { formatPrice } from "@/lib/utils";

const statusLabel: Record<CommissionStatus, string> = {
  pending: "Pending completion",
  earned: "Earned",
  reversal_pending: "Refund pending",
  reversed: "Reversed",
};

const statusClass: Record<CommissionStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  earned: "bg-emerald-50 text-emerald-700",
  reversal_pending: "bg-orange-50 text-orange-700",
  reversed: "bg-gray-100 text-gray-600",
};

export default function AdminCommissionsPage() {
  const [status, setStatus] = useState<CommissionStatus | "">("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["admin", "commissions", status, page],
    queryFn: () => adminApi.getCommissions({ status, page }),
  });

  const payload = query.data?.data;
  const records = payload?.items ?? [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission audit</h1>
          <p className="text-sm text-gray-500 mt-1">
            Financial evidence for SAFARNI&apos;s 10% commission on completed travel bookings and refund reversals.
          </p>
        </div>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as CommissionStatus | "");
            setPage(1);
          }}
          className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending completion</option>
          <option value="earned">Earned</option>
          <option value="reversal_pending">Refund pending</option>
          <option value="reversed">Reversed</option>
        </select>
      </div>

      {query.isLoading ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : query.isError ? (
        <EmptyState title="Couldn't load commission records" description="Please try again." />
      ) : !records.length ? (
        <EmptyState title="No commission records yet" description="Records appear after successful Stripe payment for provider-owned travel bookings." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Provider / booking</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">Gross</th>
                  <th className="px-4 py-3 text-right font-medium">Commission</th>
                  <th className="px-4 py-3 text-right font-medium">Provider net</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record) => {
                  const provider = typeof record.providerId === "string" ? null : record.providerId;
                  return (
                    <tr key={record._id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{provider?.name || provider?.email || "Provider"}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Booking {record.bookingId.slice(-8)}</p>
                        {record.stripeRefundId && <p className="text-xs text-gray-400 mt-0.5">Refund {record.stripeRefundId}</p>}
                      </td>
                      <td className="px-4 py-4 capitalize text-gray-600">{record.category}</td>
                      <td className="px-4 py-4 text-right font-medium text-gray-900">{formatPrice(record.grossAmount, record.currency)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatPrice(record.commissionAmount, record.currency)} <span className="text-xs text-gray-400">({record.commissionRatePercent}%)</span></td>
                      <td className="px-4 py-4 text-right font-medium text-gray-900">{formatPrice(record.providerNetAmount, record.currency)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusClass[record.status]}`}>
                          {statusLabel[record.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {payload && payload.pagination.pages > 1 && (
            <CardContent className="p-4 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                className="text-sm text-gray-600 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">Page {payload.pagination.page} of {payload.pagination.pages}</span>
              <button
                type="button"
                disabled={page >= payload.pagination.pages}
                onClick={() => setPage((value) => value + 1)}
                className="text-sm text-gray-600 disabled:opacity-40"
              >
                Next
              </button>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
