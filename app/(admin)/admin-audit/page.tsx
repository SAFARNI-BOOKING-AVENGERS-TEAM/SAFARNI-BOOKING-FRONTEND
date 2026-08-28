"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Card, Skeleton } from "@/components/ui";
import { adminApi } from "@/lib/api/admin";

export default function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const [success, setSuccess] = useState("");

  const query = useQuery({
    queryKey: ["admin", "audit", search, method, success],
    queryFn: () => adminApi.getAuditLogs({ search, method, success }),
    staleTime: 10_000,
  });

  const logs = query.data?.data?.items ?? [];
  const total = query.data?.data?.pagination.total ?? 0;

  return <div>
    <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1><p className="text-sm text-gray-500 mt-1">Review write actions across the platform without exposing request bodies or sensitive data.</p></div>
    <Card className="mb-5"><div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_160px_180px_auto] gap-3 items-center"><label className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email or route" className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm" /></label><select value={method} onChange={(e) => setMethod(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"><option value="">All methods</option><option value="POST">POST</option><option value="PATCH">PATCH</option><option value="PUT">PUT</option><option value="DELETE">DELETE</option></select><select value={success} onChange={(e) => setSuccess(e.target.value)} className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"><option value="">Any outcome</option><option value="true">Succeeded</option><option value="false">Failed</option></select><span className="text-sm text-gray-500 md:text-right">{total} events</span></div></Card>
    {query.isLoading ? <Skeleton className="h-80 w-full rounded-xl" /> : <Card><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="px-5 py-3 text-left font-medium">Actor</th><th className="px-5 py-3 text-left font-medium">Action</th><th className="px-5 py-3 text-left font-medium">Route</th><th className="px-5 py-3 text-left font-medium">Result</th><th className="px-5 py-3 text-left font-medium">Time</th></tr></thead><tbody className="divide-y divide-gray-100">{logs.map((log) => <tr key={log._id}><td className="px-5 py-4 text-gray-800">{log.userEmail}</td><td className="px-5 py-4"><span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold">{log.method}</span></td><td className="px-5 py-4 text-gray-600 font-mono text-xs max-w-md truncate">{log.path}</td><td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${log.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{log.statusCode} · {log.success ? "Success" : "Failed"}</span></td><td className="px-5 py-4 text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td></tr>)}{!logs.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-500">No audit events match these filters.</td></tr>}</tbody></table></div></Card>}
  </div>;
}