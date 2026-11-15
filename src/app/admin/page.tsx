"use client";

import { useEffect, useState } from "react";
import type { DashboardStats } from "@/types";

function StatCard({ label, value, sub, colorClass }: { label: string; value: number; sub?: string; colorClass: string }) {
    return (
        <div className={`rounded-2xl border-2 border-ink p-6 shadow-card ${colorClass}`}>
            <p className="text-xs font-extrabold uppercase tracking-wider text-ink/60">{label}</p>
            <p className="mt-2 text-4xl font-extrabold text-ink">{value}</p>
            {sub && <p className="mt-1 text-sm font-medium text-ink/70">{sub}</p>}
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then((r) => { if (!r.ok) throw new Error("Unauthorized"); return r.json(); })
            .then(setStats)
            .catch((e) => setError(e.message));
    }, []);

    if (error) {
        return (
            <div className="rounded-2xl border-2 border-brand-red bg-brand-red-light p-6 font-bold text-brand-red">
                {error === "Unauthorized" ? "Session expired. Please sign in again." : `Failed to load: ${error}`}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Dashboard</h1>
            <p className="mt-1 font-medium text-ink-mute">BrightPath Coaching Center — overview</p>

            {stats ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard label="Total bookings"    value={stats.totalBookings}     colorClass="bg-white" />
                    <StatCard label="Confirmed"         value={stats.confirmedBookings} sub="bookings confirmed"    colorClass="bg-brand-green-light" />
                    <StatCard label="Pending"           value={stats.pendingBookings}   sub="awaiting confirmation" colorClass="bg-brand-yellow" />
                    <StatCard label="Total enquiries"   value={stats.totalEnquiries}    colorClass="bg-white" />
                    <StatCard label="New enquiries"     value={stats.newEnquiries}      sub="not yet contacted"     colorClass="bg-brand-blue-light" />
                </div>
            ) : (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-28 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />
                    ))}
                </div>
            )}
        </div>
    );
}
