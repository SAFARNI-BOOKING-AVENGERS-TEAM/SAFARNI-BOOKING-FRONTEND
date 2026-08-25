"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Smartphone, RefreshCw, Zap, CreditCard } from "lucide-react";
import { Card, CardContent, Button, Skeleton, EmptyState } from "@/components/ui";
import { esimApi } from "@/lib/api/esim";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice } from "@/lib/utils";
import type { ESIMOrder, ESIMPlan } from "@/types";

const statusClass: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

function getPlan(order: ESIMOrder): ESIMPlan | null {
  return typeof order.planId === "string" ? null : order.planId;
}

export default function ESIMOrdersPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const ordersQuery = useQuery({
    queryKey: ["esim", "orders"],
    queryFn: esimApi.getMyOrders,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["esim", "orders"] });

  const activateMutation = useMutation({
    mutationFn: esimApi.activateOrder,
    onSuccess: () => { refresh(); toast.success("eSIM activated"); },
    onError: (error) => toast.error("Couldn't activate eSIM", getApiErrorMessage(error)),
  });

  const retryMutation = useMutation({
    mutationFn: esimApi.retryProvision,
    onSuccess: () => { refresh(); toast.success("eSIM provisioned successfully"); },
    onError: (error) => toast.error("Couldn't provision eSIM", getApiErrorMessage(error)),
  });

  const orders = ordersQuery.data?.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My eSIMs</h1>
      <p className="text-sm text-gray-500 mb-6">Manage payment, provisioning, and activation for your travel eSIMs.</p>

      {ordersQuery.isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}</div>
      ) : ordersQuery.isError ? (
        <EmptyState title="Couldn't load your eSIM orders" description="Please try again." />
      ) : !orders.length ? (
        <EmptyState icon={Smartphone} title="No eSIM orders yet" description="Choose a travel eSIM plan and it will appear here." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const plan = getPlan(order);
            const profileReady = order.status === "completed" && order.profile?.status === "ready";
            const activated = order.profile?.status === "activated";

            return (
              <Card key={order._id}>
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-semibold text-gray-900">{plan?.name ?? "eSIM order"}</h2>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusClass[order.status] ?? statusClass.cancelled}`}>
                            {order.status}
                          </span>
                          {order.profile?.status && (
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{order.profile.status}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {plan ? `${plan.country} · ${plan.dataAmount} ${plan.dataUnit} · ${plan.validityDays} days` : `Order ${order._id}`}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-2">{formatPrice(order.price, order.currency)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {order.status === "pending" && (
                        <Link href={`/checkout?esimOrderId=${encodeURIComponent(order._id)}`}>
                          <Button leftIcon={<CreditCard className="w-4 h-4" />}>Pay now</Button>
                        </Link>
                      )}
                      {order.status === "failed" && (
                        <Button
                          variant="outline"
                          leftIcon={<RefreshCw className="w-4 h-4" />}
                          onClick={() => retryMutation.mutate(order._id)}
                          isLoading={retryMutation.isPending}
                        >
                          Retry provisioning
                        </Button>
                      )}
                      {profileReady && !activated && (
                        <Button
                          leftIcon={<Zap className="w-4 h-4" />}
                          onClick={() => activateMutation.mutate(order._id)}
                          isLoading={activateMutation.isPending}
                        >
                          Activate eSIM
                        </Button>
                      )}
                    </div>
                  </div>

                  {order.profile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100 text-sm">
                      <div><p className="text-xs text-gray-500">ICCID</p><p className="font-medium text-gray-900 break-all">{order.profile.iccid}</p></div>
                      <div><p className="text-xs text-gray-500">SM-DP+ address</p><p className="font-medium text-gray-900 break-all">{order.profile.smdpAddress}</p></div>
                      <div className="md:col-span-2"><p className="text-xs text-gray-500">Activation code</p><p className="font-mono text-xs text-gray-900 break-all mt-1">{order.profile.activationCode}</p></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
