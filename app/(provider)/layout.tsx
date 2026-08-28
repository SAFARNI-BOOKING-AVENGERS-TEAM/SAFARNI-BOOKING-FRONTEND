"use client";

import RoleGuardLayout from "@/components/layout/role-guard-layout";

const providerLinks = [
  { href: "/provider-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/my-services", label: "My Services", icon: "Briefcase" },
  { href: "/provider-bookings", label: "Bookings", icon: "Calendar" },
  { href: "/earnings", label: "Earnings", icon: "DollarSign" },
  { href: "/profile", label: "Profile", icon: "User" },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuardLayout links={providerLinks} allowedRoles={["provider", "admin"]} redirectTo="/dashboard">
      {children}
    </RoleGuardLayout>
  );
}
