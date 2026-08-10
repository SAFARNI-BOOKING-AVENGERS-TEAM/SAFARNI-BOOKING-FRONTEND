"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    authApi
      .verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => router.push("/login"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message || "Verification failed. The link may have expired."
        );
      });
  }, [token, router]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-10 h-10 text-gray-900 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying your email...
          </h2>
          <p className="text-sm text-gray-500">
            Please wait while we confirm your account.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Email verified!
          </h2>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">
            Redirecting you to sign in...
          </p>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verification failed
          </h2>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            Go to sign in
          </Link>
        </>
      )}
    </div>
  );
}