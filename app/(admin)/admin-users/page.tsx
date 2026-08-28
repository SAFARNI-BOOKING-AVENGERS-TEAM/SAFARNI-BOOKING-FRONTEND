"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Card, CardContent, Skeleton } from "@/components/ui";
import { adminApi } from "@/lib/api/admin";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import type { UserRole, ProviderType } from "@/types";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [verified, setVerified] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();

  const query = useQuery({
    queryKey: ["admin", "users", search, role, verified],
    queryFn: () => adminApi.getUsers({ search, role, verified }),
    staleTime: 15_000,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, nextRole, providerType }: { id: string; nextRole: UserRole; providerType?: ProviderType }) =>
      adminApi.updateUserRole(id, nextRole, providerType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("User role updated");
    },
    onError: (error) => toast.error("Couldn't update role", getApiErrorMessage(error)),
  });

  const users = query.data?.data?.items ?? [];
  const total = query.data?.data?.pagination.total ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage customer access, verification state, and platform roles.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Stat label="Total matched" value={total} icon={<Users className="w-4 h-4" />} />
        <Stat label="Verified in view" value={users.filter((u) => u.isVerified).length} icon={<UserCheck className="w-4 h-4" />} />
        <Stat label="Admins in view" value={users.filter((u) => u.role === "admin").length} icon={<ShieldCheck className="w-4 h-4" />} />
      </div>

      <Card className="mb-5">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-3">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400" />
          </label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
            <option value="">All roles</option><option value="user">User</option><option value="provider">Provider</option><option value="admin">Admin</option>
          </select>
          <select value={verified} onChange={(e) => setVerified(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
            <option value="">Any verification</option><option value="true">Verified</option><option value="false">Not verified</option>
          </select>
        </CardContent>
      </Card>

      {query.isLoading ? <Skeleton className="h-72 w-full rounded-xl" /> : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500"><tr><th className="text-left font-medium px-5 py-3">User</th><th className="text-left font-medium px-5 py-3">Verification</th><th className="text-left font-medium px-5 py-3">Role</th><th className="text-left font-medium px-5 py-3">Joined</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-5 py-4"><p className="font-medium text-gray-900">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p>{user.providerType && <p className="text-xs text-gray-400 mt-0.5">{user.providerType}</p>}</td>
                    <td className="px-5 py-4"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{user.isVerified ? "Verified" : "Pending"}</span></td>
                    <td className="px-5 py-4">
                      <select value={user.role} disabled={roleMutation.isPending} onChange={(e) => {
                        const nextRole = e.target.value as UserRole;
                        const providerType = nextRole === "provider" ? (user.providerType ?? "travel") : undefined;
                        roleMutation.mutate({ id: user._id, nextRole, providerType });
                      }} className="h-9 px-2 rounded-lg border border-gray-200 bg-white capitalize">
                        <option value="user">User</option><option value="provider">Provider</option><option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!users.length && <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-500">No users match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <Card><CardContent className="p-4 flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">{icon}</div><div><p className="text-xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div></CardContent></Card>;
}