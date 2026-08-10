"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import type { RootState, AppDispatch } from "@/store";
import { removeToast, ToastType } from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
};

const iconColorMap: Record<ToastType, string> = {
  success: "text-green-600",
  error: "text-red-600",
  info: "text-blue-600",
  warning: "text-amber-600",
};

function ToastCard({
  id,
  type,
  message,
  description,
}: {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const Icon = iconMap[type];

  // Auto-dismiss after 5s. Effect owns its own timer per-toast so toasts
  // added at different times don't reset each other's clocks.
  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), 5000);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-full max-w-sm p-4 rounded-lg border shadow-sm animate-slide-in",
        styleMap[type]
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColorMap[type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
        {description && <p className="text-xs mt-0.5 opacity-80">{description}</p>}
      </div>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="flex-shrink-0 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Mount once, in Providers (below StoreProvider so useSelector works).
 * Renders whatever is in state.ui.toasts — nothing else needs to know
 * this component exists, they just call useToast().
 */
export default function Toaster() {
  const toasts = useSelector((state: RootState) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} {...toast} />
      ))}
    </div>
  );
}
