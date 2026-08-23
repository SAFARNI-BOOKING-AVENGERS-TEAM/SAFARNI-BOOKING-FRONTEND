"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/hooks/use-notifications";
import { Card, CardContent, Badge, Button, Skeleton, EmptyState, Pagination } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

const typeLabels: Record<NotificationType, string> = {
  booking_created: "New booking",
  booking_status_changed: "Booking update",
  service_approved: "Service approved",
  service_rejected: "Service rejected",
};

// Its own mutation instance per card, so "Mark read" loading state is
// scoped to the card that was actually clicked, not every unread card at once.
function NotificationCard({ notification }: { notification: Notification }) {
  const markRead = useMarkNotificationRead();

  return (
    <Card className={cn(!notification.isRead && "border-gray-900/30 bg-gray-50/60")}>
      <CardContent className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {!notification.isRead && (
            <span className="w-2 h-2 rounded-full bg-gray-900 mt-1.5 flex-shrink-0" />
          )}
          <div className={cn("min-w-0", notification.isRead && "pl-5")}>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <Badge variant="default">{typeLabels[notification.type] ?? notification.type}</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1.5">
              {formatDate(notification.createdAt, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markRead.mutate(notification._id)}
            isLoading={markRead.isPending}
            className="flex-shrink-0"
          >
            Mark read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useNotifications({ page, limit: 15 });
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = data?.info?.unreadCount ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            isLoading={markAllRead.isPending}
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState title="Couldn't load notifications" description="Please try again." />
      ) : !data?.data.length ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="We'll let you know when something happens."
        />
      ) : (
        <div className="space-y-2">
          {data.data.map((n) => (
            <NotificationCard key={n._id} notification={n} />
          ))}
        </div>
      )}

      {data?.pagination && (
        <div className="mt-6">
          <Pagination
            page={data.pagination.page}
            pages={data.pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
