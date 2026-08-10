import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Matches the card shell already used in the auth pages
 * ("bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8")
 * broken into composable pieces so listing/detail/dashboard pages don't
 * repeat that class string everywhere.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-4 border-b border-gray-200", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-5 py-4 border-t border-gray-200", className)}
      {...props}
    />
  );
}
