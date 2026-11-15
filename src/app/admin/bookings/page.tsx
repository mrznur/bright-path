"use client";

import { useEffect, useState } from "react";
import type { Booking } from "@/types";

const STATUS_CHIP: Record<Booking["status"], string> = {
    pending:   "border-amber-300   bg-amber-50   text-amber-700",
    confirmed: "border-green-300   bg-green-50   text-green-700",
    cancelled: "border-red-300     bg-red-50     text-red-700",
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/bookings");
        if (!res.ok) { setError("Failed to load bookings"); setLoading(false); return; }
        setBookings(await res.json());
        setLoading(false);
    }

    async function updateStatus(id: string, status: Booking["status"]) {
        await fetch("/api/admin/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
        setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    }

    useEffect(() => { load(); }, []);

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-ink">Bookings</h1>
                    <p className="mt-1 font-medium text-ink-mute">{bookings.length} total</p>
                </div>
                <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">↻ Refresh</button>
            </div>

            {error && <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>}

            {loading ? (
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />)}
                </div>
            ) : bookings.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">No bookings yet.</div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-ink shadow-card">
                    <table className="min-w-full divide-y-2 divide-ink/10 text-sm">
                        <thead className="bg-brand-gray">
                            <tr>
                                {["Date","Student","Parent","Phone","Course","Batch","Payment","Status","",""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-ink-mute">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10 bg-white">
                            {bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-brand-gray">
                                    <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-mute">{new Date(b.createdAt).toLocaleDateString("en-GB")}</td>
                                    <td className="px-4 py-3 font-extrabold text-ink">{b.studentName}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{b.parentName}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{b.phone}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{b.courseId}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{b.batchId}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{b.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-lg border-2 px-2.5 py-0.5 text-xs font-extrabold ${STATUS_CHIP[b.status]}`}>
                                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value as Booking["status"])}
                                            className="rounded-xl border-2 border-ink bg-white px-2 py-1 text-xs font-extrabold shadow-card-sm focus:outline-none">
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirm</option>
                                            <option value="cancelled">Cancel</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={async () => {
                                                await fetch(`/api/admin/bookings?id=${encodeURIComponent(b.id)}`, { method: "DELETE" });
                                                setBookings((prev) => prev.filter((x) => x.id !== b.id));
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
