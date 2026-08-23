"use client";

import Link from "next/link";
import { Calendar, Heart, Bell, ArrowRight } from "lucide-react";
import { useMyBookings } from "@/lib/hooks/use-bookings";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent, Badge, Skeleton } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: bookingsData, isLoading: bookingsLoading } = useMyBookings();
  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites();
  const { data: notificationsData, isLoading: notificationsLoading } = useNotifications({
    page: 1,
    limit: 3,
  });

  const activeBookings = (bookingsData?.data ?? []).filter((b) => b.status !== "cancelled");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-sm text-gray-500 mb-6">Here&apos;s what&apos;s happening with your trips</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/bookings">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {bookingsLoading ? "—" : activeBookings.length}
                </p>
                <p className="text-xs text-gray-500">Active bookings</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/favorites">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {favoritesLoading ? "—" : favoritesData?.data.length ?? 0}
                </p>
                <p className="text-xs text-gray-500">Saved favorites</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/notifications">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {notificationsLoading ? "—" : notificationsData?.info.unreadCount ?? 0}
                </p>
                <p className="text-xs text-gray-500">Unread notifications</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent bookings</h2>
            <Link
              href="/bookings"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {bookingsLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : activeBookings.length === 0 ? (
              <p className="text-sm text-gray-500">No bookings yet. Start exploring!</p>
            ) : (
              activeBookings.slice(0, 3).map((b) => (
                <Card key={b._id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{b.category} booking</p>
                      <p className="text-xs text-gray-500">{formatDate(b.startDate)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={b.status}>{b.status}</Badge>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(b.totalPrice)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent notifications</h2>
            <Link
              href="/notifications"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {notificationsLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : !notificationsData?.data.length ? (
              <p className="text-sm text-gray-500">Nothing new right now.</p>
            ) : (
              notificationsData.data.map((n) => (
                <Card key={n._id}>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
