"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/lib/api/auth";
import FormInput from "@/components/ui/form-input";
import { Mail, ArrowLeft } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (data: ForgotForm) => {
    authApi.forgotPassword(data.email).then((res) => {
      setSubmitted(true);
      // In dev mode, backend returns the reset URL in the message
      const urlMatch = res.message?.match(/(http[s]?:\/\/[^\s]+)/);
      if (urlMatch) setResetUrl(urlMatch[0]);
    });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
        <Mail className="w-10 h-10 text-gray-900 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Check your email
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          If an account exists with that email, we&apos;ve sent a password reset link.
        </p>
        {resetUrl && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Development mode — reset URL:</p>
            <a
              href={resetUrl}
              className="text-xs text-blue-600 break-all hover:underline"
            >
              {resetUrl}
            </a>
          </div>
        )}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Reset your password
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Send reset link
        </button>
      </form>
    </div>
  );
}
