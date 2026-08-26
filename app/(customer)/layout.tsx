"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { useAuth } from "@/lib/hooks/use-auth";

const customerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/bookings", label: "My Bookings", icon: "Calendar" },
  { href: "/esim-orders", label: "My eSIMs", icon: "Smartphone" },
  { href: "/favorites", label: "Favorites", icon: "Heart" },
  { href: "/notifications", label: "Notifications", icon: "Bell" },
  { href: "/profile", label: "Profile", icon: "User" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Important: useAuth performs the /users/my-profile bootstrap. This is
  // required after external full-page redirects (for example Stripe Checkout),
  // because the in-memory Redux store starts fresh when the browser returns.
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={customerLinks} user={user} />
        <main className="flex-1 p-6 lg:p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
