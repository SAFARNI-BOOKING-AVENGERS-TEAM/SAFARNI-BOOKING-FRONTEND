"use client";

import RoleGuardLayout from "@/components/layout/role-guard-layout";

const adminLinks = [
  { href: "/admin-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin-users", label: "Users", icon: "Users" },
  { href: "/admin-providers", label: "Providers", icon: "Briefcase" },
  { href: "/admin-services", label: "Services", icon: "Layers" },
  { href: "/admin-bookings", label: "Bookings", icon: "Calendar" },
  { href: "/admin-audit", label: "Audit Logs", icon: "FileText" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuardLayout links={adminLinks} allowedRoles={["admin"]} redirectTo="/dashboard">
      {children}
    </RoleGuardLayout>
  );
}
