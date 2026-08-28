"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/error";
import FormInput from "@/components/ui/form-input";
import { Loader2, CheckCircle } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    registerUser.mutate(
      { name: data.name, email: data.email, password: data.password },
      { onSuccess: () => setSuccess(true) }
    );
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Account created!</h2>
        <p className="text-sm text-gray-600 mb-4">Please check your email to verify your account before signing in.</p>
        <p className="text-xs text-gray-500">In local development without SMTP, the verification link is printed to the backend console.</p>
        <Link href="/login" className="inline-block mt-4 text-sm font-medium text-gray-900 hover:underline">Go to sign in</Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Create your account</h2>
      <p className="text-sm text-gray-500 mb-6">Start booking your next adventure</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Full name" placeholder="John Doe" error={errors.name?.message} {...register("name")} />
        <FormInput label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <FormInput label="Password" type="password" placeholder="8+ chars, upper/lowercase and a number" error={errors.password?.message} {...register("password")} />
        <FormInput label="Confirm password" type="password" placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

        {registerUser.isError && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{getApiErrorMessage(registerUser.error)}</p>
        )}

        <button type="submit" disabled={registerUser.isPending} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {registerUser.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="font-medium text-gray-900 hover:underline">Sign in</Link></p>
    </div>
  );
}
