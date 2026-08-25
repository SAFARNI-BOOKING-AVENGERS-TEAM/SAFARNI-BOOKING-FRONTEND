"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, UserMinus } from "lucide-react";
import { Card, CardContent, Skeleton } from "@/components/ui";
import { adminApi } from "@/lib/api/admin";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import type { ProviderType } from "@/types";

export default function AdminProvidersPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", providerType: "travel" as ProviderType });

  const providersQuery = useQuery({ queryKey: ["admin", "providers"], queryFn: adminApi.getProviders, staleTime: 15_000 });
  const providers = providersQuery.data?.data ?? [];

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "providers"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const createMutation = useMutation({
    mutationFn: adminApi.createProvider,
    onSuccess: () => {
      refresh();
      setForm({ name: "", email: "", password: "", providerType: "travel" });
      setShowCreate(false);
      toast.success("Provider account created");
    },
    onError: (error) => toast.error("Couldn't create provider", getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, providerType }: { id: string; providerType: ProviderType }) => adminApi.updateProvider(id, { providerType }),
    onSuccess: () => { refresh(); toast.success("Provider scope updated"); },
    onError: (error) => toast.error("Couldn't update provider", getApiErrorMessage(error)),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => adminApi.updateUserRole(id, "user"),
    onSuccess: () => { refresh(); toast.success("Provider access revoked"); },
    onError: (error) => toast.error("Couldn't revoke provider access", getApiErrorMessage(error)),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Providers</h1><p className="text-sm text-gray-500 mt-1">Control partner access and which SAFARNI verticals each provider can operate.</p></div>
        <button onClick={() => setShowCreate((v) => !v)} className="h-10 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add provider</button>
      </div>

      {showCreate && (
        <Card className="mb-5"><CardContent className="p-5"><form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required placeholder="Provider name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 px-3 rounded-lg border border-gray-200 text-sm" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-10 px-3 rounded-lg border border-gray-200 text-sm" />
          <input required minLength={8} type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-10 px-3 rounded-lg border border-gray-200 text-sm" />
          <select value={form.providerType} onChange={(e) => setForm({ ...form, providerType: e.target.value as ProviderType })} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"><option value="travel">Travel</option><option value="telecom">Telecom</option><option value="both">Travel + telecom</option></select>
          <div className="md:col-span-2 flex justify-end"><button disabled={createMutation.isPending} className="h-10 px-5 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-50">{createMutation.isPending ? "Creating..." : "Create provider"}</button></div>
        </form></CardContent></Card>
      )}

      {providersQuery.isLoading ? <Skeleton className="h-72 w-full rounded-xl" /> : (
        <Card><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500"><tr><th className="px-5 py-3 text-left font-medium">Provider</th><th className="px-5 py-3 text-left font-medium">Scope</th><th className="px-5 py-3 text-left font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Action</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {providers.map((provider) => <tr key={provider._id}>
              <td className="px-5 py-4"><p className="font-medium text-gray-900">{provider.name}</p><p className="text-xs text-gray-500">{provider.email}</p></td>
              <td className="px-5 py-4"><select value={provider.providerType ?? "travel"} disabled={updateMutation.isPending} onChange={(e) => updateMutation.mutate({ id: provider._id, providerType: e.target.value as ProviderType })} className="h-9 px-2 rounded-lg border border-gray-200 bg-white"><option value="travel">Travel</option><option value="telecom">Telecom</option><option value="both">Both</option></select></td>
              <td className="px-5 py-4"><span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">Active</span></td>
              <td className="px-5 py-4 text-right"><button onClick={() => { if (window.confirm(`Revoke provider access for ${provider.name}? Their account and history will be preserved.`)) revokeMutation.mutate(provider._id); }} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"><UserMinus className="w-3.5 h-3.5" /> Revoke access</button></td>
            </tr>)}
            {!providers.length && <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500">No provider accounts yet.</td></tr>}
          </tbody>
        </table></div></Card>
      )}
    </div>
  );
}