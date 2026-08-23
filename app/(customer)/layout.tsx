"use client";

import RoleGuardLayout from "@/components/layout/role-guard-layout";
import { useNotificationBadgeSync } from "@/lib/hooks/use-notifications";

const customerLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/bookings", label: "My Bookings", icon: "Calendar" },
  { href: "/favorites", label: "Favorites", icon: "Heart" },
  { href: "/notifications", label: "Notifications", icon: "Bell" },
  { href: "/profile", label: "Profile", icon: "User" },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keeps the sidebar's notification badge (state.ui.notificationBadge,
  // built in Stage 1) accurate on every customer page, not just /notifications.
  useNotificationBadgeSync();

  return <RoleGuardLayout links={customerLinks}>{children}</RoleGuardLayout>;
}
