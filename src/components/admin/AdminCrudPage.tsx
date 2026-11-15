"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Field";
import { slugify } from "@/lib/course-utils";

export type CrudField = {
    key: string;
    label: string;
    type?: "text" | "textarea" | "number";
    required?: boolean;
    placeholder?: string;
};

type Row = Record<string, string | number | undefined>;

export function AdminCrudPage({
    title,
    subtitle,
    endpoint,
    fields,
    idSourceKey,
    columns,
}: {
    title: string;
    subtitle?: string;
    endpoint: string;
    fields: CrudField[];
    idSourceKey: string;
    columns: { key: string; label: string }[];
}) {
    const [items, setItems] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<"list" | "add" | "edit">("list");
    const [editing, setEditing] = useState<Row | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(null), 3500);
    }

    async function load() {
        setLoading(true);
        const res = await fetch(endpoint);
        if (!res.ok) {
            setError("Failed to load");
            setLoading(false);
            return;
        }
        setItems(await res.json());
        setLoading(false);
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint]);

    async function save(data: Row, method: "POST" | "PATCH") {
        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.error ?? "Save failed");
        }
        await load();
        setMode("list");
        setEditing(null);
        showToast(method === "POST" ? "Created." : "Updated.");
    }

    async function handleDelete(id: string) {
        const res = await fetch(`${endpoint}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) {
            showToast("Delete failed.");
            return;
        }
        setItems((prev) => prev.filter((i) => i.id !== id));
        setConfirmDelete(null);
        showToast("Deleted.");
    }

    if (mode === "add" || (mode === "edit" && editing)) {
        return (
            <div>
                <h1 className="text-3xl font-extrabold text-ink">{mode === "add" ? `Add ${title}` : `Edit ${title}`}</h1>
                <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                    <EntityForm
                        fields={fields}
                        initial={editing ?? emptyRow(fields)}
                        lockId={mode === "edit"}
                        idSourceKey={idSourceKey}
                        onSave={(data) => save(data, mode === "add" ? "POST" : "PATCH")}
                        onCancel={() => {
                            setMode("list");
                            setEditing(null);
                        }}
                    />
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
                        <p className="font-extrabold text-ink">Delete this item?</p>
                        <p className="mt-1 text-sm text-ink-mute">This cannot be undone.</p>
                        <div className="mt-5 flex gap-3">
                            <Button variant="danger" size="sm" onClick={() => handleDelete(confirmDelete)}>
                                Delete
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
                    <p className="mt-1 font-medium text-ink-mute">
                        {subtitle ?? `${items.length} total`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">
                        ↻ Refresh
                    </button>
                    <Button variant="primary" size="sm" onClick={() => { setEditing(null); setMode("add"); }}>
                        + Add
                    </Button>
                </div>
            </div>
            {error && (
                <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>
            )}
            {loading ? (
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">Nothing here yet. Add one above.</div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-ink shadow-card">
                    <table className="min-w-full divide-y-2 divide-ink/10 text-sm">
                        <thead className="bg-brand-gray">
                            <tr>
                                {columns.map((c) => (
                                    <th key={c.key} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-ink-mute">
                                        {c.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10 bg-white">
                            {items.map((item) => (
                                <tr key={String(item.id)} className="hover:bg-brand-gray">
                                    {columns.map((c) => (
                                        <td key={c.key} className="px-4 py-3 font-medium text-ink">
                                            <span className="line-clamp-2">{String(item[c.key] ?? "")}</span>
                                        </td>
                                    ))}
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditing(item); setMode("edit"); }}
                                                className="rounded-lg border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold hover:bg-brand-gray"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(String(item.id))}
                                                className="rounded-lg border-2 border-brand-red bg-white px-3 py-1 text-xs font-extrabold text-brand-red hover:bg-brand-red hover:text-white"
                                            >
                                                Delete
                                            </button>
                                        </div>
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

function emptyRow(fields: CrudField[]): Row {
    const row: Row = { id: "" };
    for (const f of fields) {
        row[f.key] = f.type === "number" ? 0 : "";
    }
    return row;
}

function EntityForm({
    fields,
    initial,
    lockId,
    idSourceKey,
    onSave,
    onCancel,
}: {
    fields: CrudField[];
    initial: Row;
    lockId: boolean;
    idSourceKey: string;
    onSave: (data: Row) => Promise<void>;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<Row>(initial);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function set(key: string, value: string | number) {
        setForm((f) => {
            const next = { ...f, [key]: value };
            if (!lockId && key === idSourceKey && !String(initial.id ?? "")) {
                next.id = slugify(String(value));
            }
            return next;
        });
        setErrors((e) => ({ ...e, [key]: "" }));
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        const e: Record<string, string> = {};
        if (!String(form.id ?? "").trim()) e.id = "Required";
        for (const f of fields) {
            if (f.required && !String(form[f.key] ?? "").trim()) e[f.key] = "Required";
        }
        setErrors(e);
        if (Object.keys(e).length) return;
        setSaving(true);
        try {
            await onSave(form);
        } catch (err) {
            setErrors({ id: err instanceof Error ? err.message : "Save failed" });
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <Label htmlFor="id" required>ID</Label>
                <Input id="id" value={String(form.id ?? "")} onChange={(e) => set("id", e.target.value)} disabled={lockId} />
                {errors.id && <FieldError>{errors.id}</FieldError>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                    <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                        <Label htmlFor={f.key} required={f.required}>{f.label}</Label>
                        {f.type === "textarea" ? (
                            <Textarea id={f.key} rows={3} value={String(form[f.key] ?? "")} placeholder={f.placeholder}
                                onChange={(e) => set(f.key, e.target.value)} />
                        ) : (
                            <Input id={f.key} type={f.type === "number" ? "number" : "text"}
                                value={form[f.key] as string | number ?? ""} placeholder={f.placeholder}
                                onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} />
                        )}
                        {errors[f.key] && <FieldError>{errors[f.key]}</FieldError>}
                    </div>
                ))}
            </div>
            <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}
