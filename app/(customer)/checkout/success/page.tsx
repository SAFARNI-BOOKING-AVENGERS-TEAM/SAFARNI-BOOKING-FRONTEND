"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, AlertTriangle, Loader2, Smartphone, Calendar, RefreshCw } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";
import { paymentsApi } from "@/lib/api/payments";
import { esimApi } from "@/lib/api/esim";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice } from "@/lib/utils";

const LAST_CHECKOUT_SESSION_KEY = "safarni:last-checkout-session";

function SuccessContent() {
  const searchParams = useSearchParams();
  const querySessionId = searchParams.get("session_id") || "";
  const [fallbackSessionId, setFallbackSessionId] = useState("");
  const [recoveryChecked, setRecoveryChecked] = useState(Boolean(querySessionId));
  const sessionId = querySessionId || fallbackSessionId;
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (querySessionId) {
      setRecoveryChecked(true);
      return;
    }

    try {
      const saved = sessionStorage.getItem(LAST_CHECKOUT_SESSION_KEY) || "";
      if (saved.startsWith("cs_")) setFallbackSessionId(saved);
    } catch {
      // Session storage can be unavailable in some browser contexts.
    } finally {
      setRecoveryChecked(true);
    }
  }, [querySessionId]);

  const verificationQuery = useQuery({
    queryKey: ["payments", "checkout", sessionId],
    queryFn: () => paymentsApi.verifyCheckoutSession(sessionId),
    enabled: recoveryChecked && !!sessionId,
    retry: 1,
  });

  const verification = verificationQuery.data?.data;
  const isPaid = verification?.paymentStatus === "paid";
  const isEsim = !!verification?.esimOrderId;
  const needsRetry = isEsim && verification?.fulfillmentStatus === "failed";

  useEffect(() => {
    if (!verification) return;
    try {
      sessionStorage.removeItem(LAST_CHECKOUT_SESSION_KEY);
    } catch {
      // No action needed if storage is unavailable.
    }
  }, [verification]);

  const retryMutation = useMutation({
    mutationFn: () => esimApi.retryProvision(verification!.esimOrderId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", "checkout", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["esim", "orders"] });
      toast.success("eSIM provisioned successfully");
    },
    onError: (error) => toast.error("Couldn't provision eSIM", getApiErrorMessage(error)),
  });

  if (!recoveryChecked) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-20">
        <Loader2 className="w-5 h-5 animate-spin" /> Recovering Stripe checkout session…
      </div>
    );
  }

  if (!sessionId) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <h1 className="text-xl font-bold text-gray-900 mt-4">Stripe checkout session is missing</h1>
          <p className="text-sm text-gray-500 mt-2">
            SAFARNI could not recover the Stripe session from the return URL or this browser session. Check your bookings or eSIM orders before starting another payment.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Link href="/bookings"><Button variant="outline">My bookings</Button></Link>
            <Link href="/esim-orders"><Button variant="outline">My eSIMs</Button></Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationQuery.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-20">
        <Loader2 className="w-5 h-5 animate-spin" /> Verifying payment with Stripe…
      </div>
    );
  }

  if (verificationQuery.isError || !verification) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <h1 className="text-xl font-bold text-gray-900 mt-4">We couldn't verify this payment yet</h1>
          <p className="text-sm text-gray-500 mt-2">
            The payment may already be complete. SAFARNI will not ask you to pay again until verification succeeds.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <Button
              onClick={() => verificationQuery.refetch()}
              isLoading={verificationQuery.isFetching}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry verification
            </Button>
            <Link href="/bookings"><Button variant="outline">My bookings</Button></Link>
            <Link href="/esim-orders"><Button variant="outline">My eSIMs</Button></Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6">
        {isPaid ? (
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        ) : (
          <AlertTriangle className="w-12 h-12 text-amber-500" />
        )}

        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          {isPaid ? "Payment received" : "Payment is still pending"}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {isPaid
            ? isEsim
              ? needsRetry
                ? "Stripe confirmed your payment, but eSIM provisioning needs another attempt. You will not be charged again."
                : "Stripe confirmed your payment and SAFARNI has processed your eSIM order."
              : "Stripe confirmed your payment and your SAFARNI booking is now confirmed."
            : "Stripe has not marked this checkout as paid yet."}
        </p>

        <div className="mt-5 p-4 bg-gray-50 rounded-lg space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-gray-900">{formatPrice(verification.amount, verification.currency)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium text-gray-900 capitalize">{verification.paymentStatus}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Fulfillment</span><span className="font-medium text-gray-900 capitalize">{verification.fulfillmentStatus}</span></div>
        </div>

        {needsRetry && (
          <Button className="w-full mt-5" onClick={() => retryMutation.mutate()} isLoading={retryMutation.isPending}>
            Retry eSIM provisioning
          </Button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {isEsim ? (
            <Link href="/esim-orders"><Button variant="outline" className="w-full" leftIcon={<Smartphone className="w-4 h-4" />}>My eSIMs</Button></Link>
          ) : (
            <Link href="/bookings"><Button variant="outline" className="w-full" leftIcon={<Calendar className="w-4 h-4" />}>My bookings</Button></Link>
          )}
          <Link href="/dashboard"><Button className="w-full">Go to dashboard</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Verifying payment…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
