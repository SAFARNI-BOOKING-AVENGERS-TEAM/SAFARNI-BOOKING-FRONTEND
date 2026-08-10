import { cn } from "@/lib/utils";

/**
 * Generic loading placeholder. Compose with width/height utility classes,
 * e.g. <Skeleton className="h-4 w-32" /> or <Skeleton className="h-48 w-full rounded-xl" />
 * Use this instead of ad-hoc "animate-pulse bg-gray-200" divs in listing/detail pages.
 */
export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />;
}
