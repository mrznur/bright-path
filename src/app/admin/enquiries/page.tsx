"use client";

import { useEffect, useState } from "react";
import type { Enquiry } from "@/types";

const STATUS_CHIP: Record<Enquiry["status"], string> = {
    new:       "border-brand-blue/40  bg-brand-blue-light   text-brand-blue",
    contacted: "border-amber-300      bg-amber-50           text-amber-700",
    resolved:  "border-green-300      bg-green-50           text-green-700",
};

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/enquiries");
        if (!res.ok) { setError("Failed to load enquiries"); setLoading(false); return; }
        setEnquiries(await res.json());
        setLoading(false);
    }

    async function updateStatus(id: string, status: Enquiry["status"]) {
        await fetch("/api/admin/enquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
        setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
    }

    useEffect(() => { load(); }, []);

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-ink">Enquiries</h1>
                    <p className="mt-1 font-medium text-ink-mute">{enquiries.length} total</p>
                </div>
                <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">↻ Refresh</button>
            </div>

            {error && <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>}

            {loading ? (
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />)}
                </div>
            ) : enquiries.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">No enquiries yet.</div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-ink shadow-card">
                    <table className="min-w-full divide-y-2 divide-ink/10 text-sm">
                        <thead className="bg-brand-gray">
                            <tr>
                                {["Date","Name","Phone","Class","Subject","Course","Question","Status","",""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-ink-mute">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10 bg-white">
                            {enquiries.map((enq) => (
                                <tr key={enq.id} className="hover:bg-brand-gray">
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-mute">{new Date(enq.createdAt).toLocaleDateString("en-GB")}</td>
                                    <td className="px-4 py-3 font-extrabold text-ink">{enq.name}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{enq.phone}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{enq.classLevel}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{enq.subject}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{enq.course}</td>
                                    <td className="max-w-xs truncate px-4 py-3 font-medium text-ink-mute" title={enq.question}>{enq.question || "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-lg border-2 px-2.5 py-0.5 text-xs font-extrabold ${STATUS_CHIP[enq.status]}`}>
                                            {enq.status.charAt(0).toUpperCase() + enq.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select value={enq.status} onChange={(e) => updateStatus(enq.id, e.target.value as Enquiry["status"])}
                                            className="rounded-xl border-2 border-ink bg-white px-2 py-1 text-xs font-extrabold shadow-card-sm focus:outline-none">
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={async () => {
                                                await fetch(`/api/admin/enquiries?id=${encodeURIComponent(enq.id)}`, { method: "DELETE" });
                                                setEnquiries((prev) => prev.filter((x) => x.id !== enq.id));
                                            }}
                                            className="text-xs font-extrabold text-brand-red hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
