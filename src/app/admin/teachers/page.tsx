"use client";

import { useEffect, useState } from "react";
import type { Teacher } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Field";

type FormData = Omit<Teacher, "id"> & { id: string };

const EMPTY: FormData = {
    id: "", name: "", nameBn: "",
    subject: "", subjectBn: "",
    bio: "", bioBn: "",
    imageUrl: "",
};

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function TeacherForm({
    initial,
    isNew,
    onSave,
    onCancel,
}: {
    initial: FormData;
    isNew: boolean;
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
            if (key === "name" && isNew) next.id = slugify(value as string);
            return next;
        });
        setFieldErrors((e) => ({ ...e, [key]: undefined }));
    }

    function validate() {
        const e: typeof fieldErrors = {};
        if (!form.id.trim()) e.id = "Required";
        if (!form.name.trim()) e.name = "Required";
        setFieldErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setErr(null);
        try {
            await onSave(form);
        } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : "Save failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            {err && (
                <div className="rounded-xl border-2 border-brand-red bg-brand-red-light p-3 text-sm font-bold text-brand-red">{err}</div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="id" required>Teacher ID</Label>
                    <Input id="id" value={form.id} onChange={(e) => set("id", e.target.value)}
                        placeholder="e.g. rahman" readOnly={!isNew} />
                    {fieldErrors.id && <FieldError>{fieldErrors.id}</FieldError>}
                    {isNew && <p className="mt-1 text-xs text-ink-mute">Auto-filled from name. Unique slug.</p>}
                </div>
                <div>
                    <Label htmlFor="imageUrl">Photo URL</Label>
                    <Input id="imageUrl" value={form.imageUrl ?? ""} onChange={(e) => set("imageUrl", e.target.value)}
                        placeholder="https://…" />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="name" required>Full Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Mr. Tariq Rahman" />
                    {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="nameBn">Full Name (Bangla)</Label>
                    <Input id="nameBn" value={form.nameBn} onChange={(e) => set("nameBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={form.subject} onChange={(e) => set("subject", e.target.value)}
                        placeholder="e.g. Physics" />
                </div>
                <div>
                    <Label htmlFor="subjectBn">Subject (Bangla)</Label>
                    <Input id="subjectBn" value={form.subjectBn} onChange={(e) => set("subjectBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="bioBn">Bio (Bangla)</Label>
                    <Textarea id="bioBn" rows={4} value={form.bioBn} onChange={(e) => set("bioBn", e.target.value)} />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? "Saving…" : "Save teacher"}
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<"list" | "add" | "edit">("list");
    const [editing, setEditing] = useState<Teacher | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    }

    async function load() {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/teachers");
        if (!res.ok) { setError("Failed to load teachers"); setLoading(false); return; }
        setTeachers(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleAdd(data: FormData) {
        const res = await fetch("/api/admin/teachers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed to create"); }
        const created: Teacher = await res.json();
        setTeachers((prev) => [...prev, created]);
        setMode("list");
        showToast("Teacher added.");
    }

    async function handleEdit(data: FormData) {
        const res = await fetch("/api/admin/teachers", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed to update"); }
        const updated: Teacher = await res.json();
        setTeachers((prev) => prev.map((t) => t.id === updated.id ? updated : t));
        setMode("list");
        setEditing(null);
        showToast("Teacher updated.");
    }

    async function handleDelete(id: string) {
        const res = await fetch(`/api/admin/teachers?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) { showToast("Delete failed."); return; }
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        setConfirmDelete(null);
        showToast("Teacher deleted.");
    }

    if (mode === "add") {
        return (
            <div>
                <h1 className="text-3xl font-extrabold text-ink">Add Teacher</h1>
                <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                    <TeacherForm initial={{ ...EMPTY }} isNew={true} onSave={handleAdd} onCancel={() => setMode("list")} />
                </div>
            </div>
        );
    }

    if (mode === "edit" && editing) {
        return (
            <div>
                <h1 className="text-3xl font-extrabold text-ink">Edit Teacher</h1>
                <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                    <TeacherForm initial={{ ...editing, imageUrl: editing.imageUrl ?? "" }} isNew={false}
                        onSave={handleEdit} onCancel={() => { setMode("list"); setEditing(null); }} />
                </div>
            </div>
        );
    }

    return (
        <div>
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-ink bg-brand-yellow px-5 py-3 font-extrabold shadow-card">
                    {toast}
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                        <p className="font-extrabold text-ink">Delete this teacher?</p>
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
                    <h1 className="text-3xl font-extrabold text-ink">Teachers</h1>
                    <p className="mt-1 font-medium text-ink-mute">{teachers.length} teacher{teachers.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">↻ Refresh</button>
                    <Button variant="primary" size="sm" onClick={() => setMode("add")}>+ Add teacher</Button>
                </div>
            </div>

            {error && <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>}

            {loading ? (
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />
                    ))}
                </div>
            ) : teachers.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">No teachers yet.</div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {teachers.map((t) => (
                        <div key={t.id} className="rounded-2xl border-2 border-ink bg-white p-5 shadow-card">
                            <div className="flex items-start gap-4">
                                {t.imageUrl ? (
                                    <img src={t.imageUrl} alt={t.name}
                                        className="h-14 w-14 rounded-xl border-2 border-ink object-cover" />
                                ) : (
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-ink bg-brand-gray text-2xl font-extrabold text-ink">
                                        {t.name.charAt(0)}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="font-extrabold text-ink truncate">{t.name}</p>
                                    <p className="text-sm font-medium text-ink-mute">{t.subject}</p>
                                    <p className="text-xs text-ink-mute">{t.id}</p>
                                </div>
                            </div>
                            {t.bio && (
                                <p className="mt-3 line-clamp-2 text-xs text-ink-mute">{t.bio}</p>
                            )}
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => { setEditing(t); setMode("edit"); }}
                                    className="flex-1 rounded-lg border-2 border-ink bg-white py-1.5 text-xs font-extrabold hover:bg-brand-gray">
                                    Edit
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(t.id)}
                                    className="flex-1 rounded-lg border-2 border-brand-red bg-white py-1.5 text-xs font-extrabold text-brand-red hover:bg-brand-red hover:text-white">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
