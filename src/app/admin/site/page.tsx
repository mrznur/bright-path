"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { SITE } from "@/data/site";

export default function SiteAdminPage() {
    const [form, setForm] = useState<SiteConfig>(SITE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/site")
            .then((r) => r.ok ? r.json() : SITE)
            .then((data) => { setForm(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/site", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                setToast("Save failed.");
                return;
            }
            setForm(await res.json());
            setToast("Site settings saved.");
            setTimeout(() => setToast(null), 3500);
        } catch {
            setToast("Save failed — check your connection.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="h-40 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />;
    }

    return (
        <div>
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-ink bg-brand-yellow px-5 py-3 font-extrabold shadow-card">{toast}</div>
            )}
            <h1 className="text-3xl font-extrabold text-ink">Site settings</h1>
            <p className="mt-1 font-medium text-ink-mute">Phone, address, hours and social links shown on the public site.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <div>
                    <Label htmlFor="name">Centre name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="tagEn">Tagline</Label>
                        <Input id="tagEn" value={form.tagline.en} onChange={(e) => setForm({ ...form, tagline: { ...form.tagline, en: e.target.value } })} />
                    </div>
                    <div>
                        <Label htmlFor="tagBn">Tagline (Bangla)</Label>
                        <Input id="tagBn" value={form.tagline.bn} onChange={(e) => setForm({ ...form, tagline: { ...form.tagline, bn: e.target.value } })} />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="phoneEn">Phone</Label>
                        <Input id="phoneEn" value={form.phone.en} onChange={(e) => setForm({ ...form, phone: { ...form.phone, en: e.target.value } })} />
                    </div>
                    <div>
                        <Label htmlFor="phoneBn">Phone (Bangla)</Label>
                        <Input id="phoneBn" value={form.phone.bn} onChange={(e) => setForm({ ...form, phone: { ...form.phone, bn: e.target.value } })} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="tel">Click-to-call link</Label>
                    <Input id="tel" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} placeholder="tel:+8801..." />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="addrEn">Address</Label>
                        <Input id="addrEn" value={form.address.en} onChange={(e) => setForm({ ...form, address: { ...form.address, en: e.target.value } })} />
                    </div>
                    <div>
                        <Label htmlFor="addrBn">Address (Bangla)</Label>
                        <Input id="addrBn" value={form.address.bn} onChange={(e) => setForm({ ...form, address: { ...form.address, bn: e.target.value } })} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="map">Map link</Label>
                    <Input id="map" value={form.mapLink} onChange={(e) => setForm({ ...form, mapLink: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="hoursEn">Hours</Label>
                        <Input id="hoursEn" value={form.hours.en} onChange={(e) => setForm({ ...form, hours: { ...form.hours, en: e.target.value } })} />
                    </div>
                    <div>
                        <Label htmlFor="hoursBn">Hours (Bangla)</Label>
                        <Input id="hoursBn" value={form.hours.bn} onChange={(e) => setForm({ ...form, hours: { ...form.hours, bn: e.target.value } })} />
                    </div>
                </div>
                <div>
                    <Label htmlFor="fb">Facebook URL</Label>
                    <Input id="fb" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
                </div>
                <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save settings"}</Button>
            </form>
        </div>
    );
}
