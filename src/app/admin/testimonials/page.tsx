"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Field";

type FormData = Omit<Testimonial, "id"> & { id: string };

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY: FormData = { id: "", quote: "", quoteBn: "", author: "", authorBn: "", role: "", roleBn: "" };

function TestimonialForm({
    initial, isNew, onSave, onCancel,
}: {
    initial: FormData; isNew: boolean;
    onSave: (data: FormData) => Promise<void>;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<FormData>(initial);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    function set<K extends keyof FormData>(key: K, value: FormData[K]) {
        setForm((f) => {
            const next = { ...f, [key]: value };
            if (key === "author" && isNew) next.id = "t-" + slugify(value as string).slice(0, 15);
            return next;
        });
        setFieldErrors((e) => ({ ...e, [key]: undefined }));
    }

    function validate() {
        const e: typeof fieldErrors = {};
        if (!form.id.trim()) e.id = "Required";
        if (!form.quote.trim()) e.quote = "Required";
        if (!form.author.trim()) e.author = "Required";
        setFieldErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!validate()) return;
        setSaving(true); setErr(null);
        try { await onSave(form); }
        catch (e: unknown) { setErr(e instanceof Error ? e.message : "Save failed"); }
        finally { setSaving(false); }
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            {err && <div className="rounded-xl border-2 border-brand-red bg-brand-red-light p-3 text-sm font-bold text-brand-red">{err}</div>}

            <div>
                <Label htmlFor="id" required>Testimonial ID</Label>
                <Input id="id" value={form.id} onChange={(e) => set("id", e.target.value)} readOnly={!isNew} placeholder="e.g. t-5" />
                {fieldErrors.id && <FieldError>{fieldErrors.id}</FieldError>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="quote" required>Quote</Label>
                    <Textarea id="quote" rows={4} value={form.quote} onChange={(e) => set("quote", e.target.value)} />
                    {fieldErrors.quote && <FieldError>{fieldErrors.quote}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="quoteBn">Quote (Bangla)</Label>
                    <Textarea id="quoteBn" rows={4} value={form.quoteBn} onChange={(e) => set("quoteBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="author" required>Author</Label>
                    <Input id="author" value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="e.g. Nasrin Akter" />
                    {fieldErrors.author && <FieldError>{fieldErrors.author}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="authorBn">Author (Bangla)</Label>
                    <Input id="authorBn" value={form.authorBn} onChange={(e) => set("authorBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Parent of a Class 6 student" />
                </div>
                <div>
                    <Label htmlFor="roleBn">Role (Bangla)</Label>
                    <Input id="roleBn" value={form.roleBn} onChange={(e) => set("roleBn", e.target.value)} />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save testimonial"}</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

export default function TestimonialsPage() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<"list" | "add" | "edit">("list");
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3500); }

    async function load() {
        setLoading(true); setError(null);
        const res = await fetch("/api/admin/testimonials");
        if (!res.ok) { setError("Failed to load testimonials"); setLoading(false); return; }
        setItems(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleAdd(data: FormData) {
        const res = await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const created: Testimonial = await res.json();
        setItems((prev) => [...prev, created]);
        setMode("list"); showToast("Testimonial added.");
    }

    async function handleEdit(data: FormData) {
        const res = await fetch("/api/admin/testimonials", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const updated: Testimonial = await res.json();
        setItems((prev) => prev.map((t) => t.id === updated.id ? updated : t));
        setMode("list"); setEditing(null); showToast("Testimonial updated.");
    }

    async function handleDelete(id: string) {
        const res = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) { showToast("Delete failed."); return; }
        setItems((prev) => prev.filter((t) => t.id !== id));
        setConfirmDelete(null); showToast("Testimonial deleted.");
    }

    if (mode === "add") return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Add Testimonial</h1>
            <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <TestimonialForm initial={{ ...EMPTY }} isNew={true} onSave={handleAdd} onCancel={() => setMode("list")} />
            </div>
        </div>
    );

    if (mode === "edit" && editing) return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Edit Testimonial</h1>
            <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <TestimonialForm initial={editing} isNew={false} onSave={handleEdit} onCancel={() => { setMode("list"); setEditing(null); }} />
            </div>
        </div>
    );

    return (
        <div>
            {toast && <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-ink bg-brand-yellow px-5 py-3 font-extrabold shadow-card">{toast}</div>}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                        <p className="font-extrabold text-ink">Delete this testimonial?</p>
                        <p className="mt-1 text-sm text-ink-mute">This cannot be undone.</p>
                        <div className="mt-5 flex gap-3">
                            <Button variant="danger" size="sm" onClick={() => handleDelete(confirmDelete)}>Delete</Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-ink">Testimonials</h1>
                    <p className="mt-1 font-medium text-ink-mute">{items.length} testimonial{items.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">↻ Refresh</button>
                    <Button variant="primary" size="sm" onClick={() => setMode("add")}>+ Add testimonial</Button>
                </div>
            </div>

            {error && <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>}

            {loading ? (
                <div className="mt-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />)}</div>
            ) : items.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">No testimonials yet.</div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {items.map((t) => (
                        <div key={t.id} className="rounded-2xl border-2 border-ink bg-white p-5 shadow-card">
                            <p className="line-clamp-3 text-sm font-semibold text-ink">"{t.quote}"</p>
                            <div className="mt-3 flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-extrabold text-ink">{t.author}</p>
                                    <p className="text-xs text-ink-mute">{t.role}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditing(t); setMode("edit"); }}
                                        className="rounded-lg border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold hover:bg-brand-gray">Edit</button>
                                    <button onClick={() => setConfirmDelete(t.id)}
                                        className="rounded-lg border-2 border-brand-red bg-white px-3 py-1 text-xs font-extrabold text-brand-red hover:bg-brand-red hover:text-white">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
