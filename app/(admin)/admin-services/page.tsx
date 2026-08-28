"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { Card, Skeleton } from "@/components/ui";
import { adminApi, type AdminService } from "@/lib/api/admin";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";

const typeLabels: Record<string, string> = { hotels: "Hotels", cars: "Cars", flights: "Flights", tours: "Tours", packages: "Packages", esim: "eSIM" };

function serviceTitle(service: AdminService) {
  return service.name || service.title || service.hotelName || service.model || service.flightNumber || service.planName || service.country || `${typeLabels[service.serviceType]} item`;
}

function serviceMeta(service: AdminService) {
  const values = [service.city, service.location, service.airline, service.brand, service.destination, service.country, service.providerName].filter(Boolean);
  return values.slice(0, 2).join(" · ") || `ID ${service._id.slice(-6)}`;
}

export default function AdminServicesPage() {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("pending");
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ["admin", "services", type, status],
    queryFn: () => adminApi.getServices({ type, status }),
    staleTime: 10_000,
  });
  const services = query.data?.data ?? [];

  const mutation = useMutation({
    mutationFn: ({ service, nextStatus }: { service: AdminService; nextStatus: "pending" | "approved" | "rejected" }) => adminApi.updateServiceStatus(service.serviceType, service._id, nextStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success(`Service ${variables.nextStatus}`);
    },
    onError: (error) => toast.error("Couldn't update service", getApiErrorMessage(error)),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Services</h1><p className="text-sm text-gray-500 mt-1">Moderate marketplace inventory before it becomes visible to travelers.</p></div>

      <Card className="mb-5"><div className="p-4 flex flex-col sm:flex-row gap-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"><option value="all">All service types</option><option value="hotels">Hotels</option><option value="cars">Cars</option><option value="flights">Flights</option><option value="tours">Tours</option><option value="packages">Packages</option><option value="esim">eSIM</option></select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"><option value="pending">Pending review</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="">All statuses</option></select>
      </div></Card>

      {query.isLoading ? <Skeleton className="h-80 w-full rounded-xl" /> : (
        <div className="space-y-3">
          {services.map((service) => <Card key={`${service.serviceType}-${service._id}`}>
            <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><p className="font-semibold text-gray-900 truncate">{serviceTitle(service)}</p><span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{typeLabels[service.serviceType]}</span><Status value={service.status ?? "pending"} /></div>
                <p className="text-xs text-gray-500 mt-1">{serviceMeta(service)}</p>
                {service.createdAt && <p className="text-xs text-gray-400 mt-1">Submitted {new Date(service.createdAt).toLocaleString()}</p>}
              </div>
              <div className="flex items-center gap-2">
                {service.status !== "approved" && <button disabled={mutation.isPending} onClick={() => mutation.mutate({ service, nextStatus: "approved" })} className="h-9 px-3 rounded-lg bg-emerald-600 text-white text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-50"><Check className="w-3.5 h-3.5" /> Approve</button>}
                {service.status !== "rejected" && <button disabled={mutation.isPending} onClick={() => mutation.mutate({ service, nextStatus: "rejected" })} className="h-9 px-3 rounded-lg border border-red-200 text-red-600 text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-50"><X className="w-3.5 h-3.5" /> Reject</button>}
              </div>
            </div>
          </Card>)}
          {!services.length && <Card><div className="px-5 py-14 text-center"><p className="font-medium text-gray-900">Nothing to review</p><p className="text-sm text-gray-500 mt-1">No services match the selected filters.</p></div></Card>}
        </div>
      )}
    </div>
  );
}

function Status({ value }: { value: string }) {
  const cls = value === "approved" ? "bg-emerald-50 text-emerald-700" : value === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>{value}</span>;
}