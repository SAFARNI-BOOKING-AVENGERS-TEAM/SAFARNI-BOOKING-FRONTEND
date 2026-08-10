"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import PageLoader from "@/components/ui/page-loader";

interface SidebarLink {
  href: string;
  label: string;
  icon: string;
}

interface RoleGuardLayoutProps {
  children: React.ReactNode;
  links: SidebarLink[];
  /** Omit to just require any authenticated user (the customer layout's case) */
  allowedRoles?: string[];
  /** Where to send an authenticated user whose role isn't allowed */
  redirectTo?: string;
}

/**
 * The customer/provider/admin layouts were identical except for:
 *   - which links go in the sidebar
 *   - which role(s) are allowed in
 *   - where to bounce an authenticated-but-wrong-role user
 * Everything else (the loading branch, the redirect-to-login effect, the
 * Navbar+Sidebar+main shell) was copy-pasted three times. This component
 * is that shared shell; each layout now just supplies the three things
 * that actually differ.
 */
export default function RoleGuardLayout({
  children,
  links,
  allowedRoles,
  redirectTo = "/dashboard",
}: RoleGuardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  const isRoleAllowed = !allowedRoles || (!!user && allowedRoles.includes(user.role));

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isRoleAllowed) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, isRoleAllowed, router, redirectTo]);

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated || !isRoleAllowed) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={links} user={user} />
        <main className="flex-1 p-6 lg:p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
