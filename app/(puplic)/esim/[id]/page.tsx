"use client";

import { useParams } from "next/navigation";
import { Smartphone, Globe, CalendarClock } from "lucide-react";
import { useESIMPlanDetails } from "@/lib/hooks/use-esim";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/lib/hooks/use-toast";
import { Card, CardContent, Button, Skeleton, EmptyState } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

export default function ESIMDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useESIMPlanDetails(id);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  const plan = data?.data;

  if (isError || !plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmptyState title="Plan not found" description="This eSIM plan may have been removed." />
      </div>
    );
  }

  const handleBuy = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/esim/${id}`;
      return;
    }
    toast.info("Checkout is coming soon", "This plan has been noted — checkout isn't wired up yet.");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardContent className="p-6">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
          <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
            <Globe className="w-4 h-4" />
            {plan.country}
            {plan.region ? ` · ${plan.region}` : ""}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Data</p>
              <p className="text-lg font-semibold text-gray-900">
                {plan.dataAmount} {plan.dataUnit}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <CalendarClock className="w-3.5 h-3.5" /> Validity
              </p>
              <p className="text-lg font-semibold text-gray-900">{plan.validityDays} days</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(plan.price, plan.currency)}
            </span>
            <Button onClick={handleBuy}>Buy this plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
