import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

// Maps every status string used across the app's types
// (ServiceStatus: pending/approved/rejected, BookingStatus: pending/confirmed/cancelled)
// to a variant, so callers can just pass `status` and never touch color logic.
const statusVariantMap: Record<string, BadgeVariant> = {
  pending: "warning",
  approved: "success",
  confirmed: "success",
  rejected: "danger",
  cancelled: "danger",
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Pass a status string (e.g. booking.status) to auto-resolve the variant */
  status?: string;
  className?: string;
}

export default function Badge({ children, variant, status, className }: BadgeProps) {
  const resolvedVariant: BadgeVariant =
    variant ?? (status ? statusVariantMap[status.toLowerCase()] ?? "default" : "default");

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize",
        variantStyles[resolvedVariant],
        className
      )}
    >
      {children}
    </span>
  );
}
