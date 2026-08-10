"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import RoleGuardLayout from "@/components/layout/role-guard-layout";


const providerLinks = [
  { href: "/provider-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/my-services", label: "My Services", icon: "Briefcase" },
  { href: "/provider-bookings", label: "Bookings", icon: "Calendar" },
  { href: "/earnings", label: "Earnings", icon: "DollarSign" },
  { href: "/profile", label: "Profile", icon: "User" },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "provider" && user?.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "provider" && user?.role !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={providerLinks} user={user} />
        <main className="flex-1 p-6 lg:p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
   {
  return (
    <RoleGuardLayout links={providerLinks} allowedRoles={["provider", "admin"]} redirectTo="/dashboard">
      {children}
    </RoleGuardLayout>
  );
}

}