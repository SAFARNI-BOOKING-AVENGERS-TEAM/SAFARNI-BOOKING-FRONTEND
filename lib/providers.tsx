"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import StoreProvider from "@/store/provider";
import { queryClient } from "./query-client";
import Toaster from "@/components/ui/toaster";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StoreProvider>
  );
}
