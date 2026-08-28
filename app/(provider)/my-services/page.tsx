"use client";

import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Smartphone } from "lucide-react";
import { Card, CardContent, Button, Skeleton, EmptyState } from "@/components/ui";
import { esimApi } from "@/lib/api/esim";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { formatPrice } from "@/lib/utils";
import type { DataUnit, ESIMPlan } from "@/types";

interface PlanForm {
  name: string;
  country: string;
  region: string;
  dataAmount: string;
  dataUnit: DataUnit;
  validityDays: string;
  price: string;
  currency: string;
}

const blankForm = (): PlanForm => ({
  name: "",
  country: "",
  region: "",
  dataAmount: "",
  dataUnit: "GB",
  validityDays: "",
  price: "",
  currency: "USD",
});

const statusClass: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
};

export default function MyServicesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [form, setForm] = useState<PlanForm>(blankForm());
  const [editing, setEditing] = useState<ESIMPlan | null>(null);
  const [showForm, setShowForm] = useState(false);

  const canManageESIM = user?.role === "admin" || user?.providerType === "telecom" || user?.providerType === "both";

  const plansQuery = useQuery({
    queryKey: ["provider", "esim-plans"],
    queryFn: () => esimApi.getPlans({ mine: true, limit: 100 }),
    enabled: !!canManageESIM,
  });

  const plans = useMemo(() => plansQuery.data?.data ?? [], [plansQuery.data?.data]);
  const counts = useMemo(() => ({
    total: plans.length,
    approved: plans.filter((plan) => plan.status === "approved").length,
    pending: plans.filter((plan) => plan.status === "pending").length,
    rejected: plans.filter((plan) => plan.status === "rejected").length,
  }), [plans]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["provider", "esim-plans"] });
    queryClient.invalidateQueries({ queryKey: ["provider", "dashboard"] });
  };

  const payload = () => ({
    name: form.name.trim(),
    country: form.country.trim(),
    ...(form.region.trim() && { region: form.region.trim() }),
    dataAmount: Number(form.dataAmount),
    dataUnit: form.dataUnit,
    validityDays: Number(form.validityDays),
    price: Number(form.price),
    currency: form.currency.trim().toUpperCase(),
  });

  const createMutation = useMutation({
    mutationFn: () => esimApi.createPlan(payload()),
    onSuccess: () => {
      refresh();
      setForm(blankForm());
      setShowForm(false);
      toast.success("eSIM plan submitted", "It is pending admin approval before becoming public.");
    },
    onError: (error) => toast.error("Couldn't create plan", getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: () => esimApi.updatePlan(editing!._id, payload()),
    onSuccess: () => {
      refresh();
      setEditing(null);
      setForm(blankForm());
      setShowForm(false);
      toast.success("eSIM plan updated", "The edited plan returned to pending admin review.");
    },
    onError: (error) => toast.error("Couldn't update plan", getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: esimApi.deletePlan,
    onSuccess: () => { refresh(); toast.success("eSIM plan removed"); },
    onError: (error) => toast.error("Couldn't remove plan", getApiErrorMessage(error)),
  });

  const startCreate = () => {
    setEditing(null);
    setForm(blankForm());
    setShowForm(true);
  };

  const startEdit = (plan: ESIMPlan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      country: plan.country,
      region: plan.region ?? "",
      dataAmount: String(plan.dataAmount),
      dataUnit: plan.dataUnit,
      validityDays: String(plan.validityDays),
      price: String(plan.price),
      currency: plan.currency,
    });
    setShowForm(true);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.country.trim() || Number(form.dataAmount) <= 0 || Number(form.validityDays) <= 0 || Number(form.price) <= 0) {
      toast.warning("Complete all required plan fields with valid positive values");
      return;
    }
    if (form.currency.trim().length !== 3) {
      toast.warning("Currency must be a 3-letter code such as USD");
      return;
    }
    if (editing) updateMutation.mutate(); else createMutation.mutate();
  };

  if (!canManageESIM) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Services</h1>
        <p className="text-sm text-gray-500 mb-6">Manage the services your provider account is allowed to offer.</p>
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-900">Travel provider account</h2>
            <p className="text-sm text-gray-500 mt-2">eSIM inventory is available only to providers with Telecom or Travel + Telecom scope.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage your SAFARNI eSIM inventory.</p>
        </div>
        <Button onClick={startCreate} leftIcon={<Plus className="w-4 h-4" />}>New eSIM plan</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {Object.entries(counts).map(([label, value]) => (
          <Card key={label}><CardContent className="p-4"><p className="text-xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500 capitalize">{label}</p></CardContent></Card>
        ))}
      </div>

      {showForm && (
        <Card className="mb-5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="font-semibold text-gray-900">{editing ? "Edit eSIM plan" : "Create eSIM plan"}</h2><p className="text-xs text-gray-500 mt-1">Provider changes require admin approval before going live.</p></div>
              <button type="button" className="text-sm text-gray-500" onClick={() => setShowForm(false)}>Close</button>
            </div>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input required className="h-10 px-3 rounded-lg border border-gray-200 text-sm" placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required className="h-10 px-3 rounded-lg border border-gray-200 text-sm" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              <input className="h-10 px-3 rounded-lg border border-gray-200 text-sm" placeholder="Region (optional)" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input required type="number" min="0.01" step="0.01" className="h-10 px-3 rounded-lg border border-gray-200 text-sm" placeholder="Data amount" value={form.dataAmount} onChange={(e) => setForm({ ...form, dataAmount: e.target.value })} />
                <select className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm" value={form.dataUnit} onChange={(e) => setForm({ ...form, dataUnit: e.target.value as DataUnit })}>
                  <option value="MB">MB</option><option value="GB">GB</option><option value="Unlimited">Unlimited</option>
                </select>
              </div>
              <input required type="number" min="1" step="1" className="h-10 px-3 rounded-lg border border-gray-200 text-sm" placeholder="Validity days" value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: e.target.value })} />
              <div className="grid grid-cols-[1fr_100px] gap-2">
                <input required type="number" min="0.01" step="0.01" className="h-10 px-3 rounded-lg border border-gray-200 text-sm" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input required maxLength={3} className="h-10 px-3 rounded-lg border border-gray-200 text-sm uppercase" placeholder="USD" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-1">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>{editing ? "Save & resubmit" : "Submit for approval"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {plansQuery.isLoading ? (
        <Skeleton className="h-72 w-full rounded-xl" />
      ) : plansQuery.isError ? (
        <EmptyState title="Couldn't load your eSIM plans" description="Please try again." />
      ) : !plans.length ? (
        <EmptyState icon={Smartphone} title="No eSIM plans yet" description="Create your first plan and submit it for admin approval." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500"><tr><th className="px-5 py-3 text-left font-medium">Plan</th><th className="px-5 py-3 text-left font-medium">Allowance</th><th className="px-5 py-3 text-left font-medium">Price</th><th className="px-5 py-3 text-left font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {plans.map((plan) => (
                  <tr key={plan._id}>
                    <td className="px-5 py-4"><p className="font-medium text-gray-900">{plan.name}</p><p className="text-xs text-gray-500">{plan.country}{plan.region ? ` · ${plan.region}` : ""}</p></td>
                    <td className="px-5 py-4 text-gray-600">{plan.dataAmount} {plan.dataUnit} · {plan.validityDays}d</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{formatPrice(plan.price, plan.currency)}</td>
                    <td className="px-5 py-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusClass[plan.status]}`}>{plan.status}</span></td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => startEdit(plan)} className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"><Pencil className="w-3.5 h-3.5" /> Edit</button><button onClick={() => { if (window.confirm(`Delete ${plan.name}?`)) deleteMutation.mutate(plan._id); }} className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /> Delete</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
