"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, LockKeyhole, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, Button } from "@/components/ui";
import { paymentsApi, type PaymentTarget } from "@/lib/api/payments";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";

const LAST_CHECKOUT_SESSION_KEY = "safarni:last-checkout-session";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const toast = useToast();

  const target = useMemo<PaymentTarget>(() => ({
    bookingId: searchParams.get("bookingId") || undefined,
    packageBookingId: searchParams.get("packageBookingId") || undefined,
    esimOrderId: searchParams.get("esimOrderId") || undefined,
  }), [searchParams]);

  const targetCount = [target.bookingId, target.packageBookingId, target.esimOrderId].filter(Boolean).length;
  const cancelled = searchParams.get("cancelled") === "1";

  const checkoutMutation = useMutation({
    mutationFn: () => paymentsApi.createCheckoutSession(target),
    onSuccess: (response) => {
      // Keep a local copy of the real Stripe Checkout Session ID before
      // navigating away from SAFARNI. Stripe normally returns it in the
      // success_url query string, but this gives us a safe recovery path if a
      // browser/router strips that query parameter on the return navigation.
      try {
        sessionStorage.setItem(LAST_CHECKOUT_SESSION_KEY, response.data.sessionId);
      } catch {
        // Storage can be unavailable in hardened/private browser contexts.
        // Stripe's success_url query parameter remains the primary mechanism.
      }

      window.location.assign(response.data.url);
    },
    onError: (error) => toast.error("Couldn't start checkout", getApiErrorMessage(error)),
  });

  const label = target.esimOrderId
    ? "eSIM order"
    : target.packageBookingId
      ? "travel package"
      : "booking";

  if (targetCount !== 1) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Checkout link is invalid</h1>
          <p className="text-sm text-gray-500 mt-2">Open checkout again from a booking, package, or eSIM plan.</p>
          <Link href="/bookings" className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 mt-5">
            <ArrowLeft className="w-4 h-4" /> Back to bookings
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Secure checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Pay for your SAFARNI {label} through Stripe.</p>
      </div>

      {cancelled && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Payment was cancelled. Your {label} is still pending and you can try again.
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Stripe-hosted payment</p>
              <p className="text-sm text-gray-500 mt-1">
                The final amount is calculated by SAFARNI on the server from the booking or eSIM order. Card details are entered directly on Stripe.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-50 flex items-start gap-2">
            <LockKeyhole className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-xs text-gray-500">
              You will return to SAFARNI automatically after payment. A booking is confirmed, or an eSIM is provisioned, only after Stripe verifies payment.
            </p>
          </div>

          <Button
            className="w-full mt-6"
            onClick={() => checkoutMutation.mutate()}
            isLoading={checkoutMutation.isPending}
          >
            Continue to Stripe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Loading checkout…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
