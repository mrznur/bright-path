"use client";

import { useEffect, useState } from "react";
import type { FAQ } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Field";

type FormData = { id: string; question: string; questionBn: string; answer: string; answerBn: string; sortOrder: number };

const EMPTY: FormData = { id: "", question: "", questionBn: "", answer: "", answerBn: "", sortOrder: 0 };

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function FaqForm({
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
            if (key === "question" && isNew) next.id = "faq-" + slugify(value as string).slice(0, 20);
            return next;
        });
        setFieldErrors((e) => ({ ...e, [key]: undefined }));
    }

    function validate() {
        const e: typeof fieldErrors = {};
        if (!form.id.trim()) e.id = "Required";
        if (!form.question.trim()) e.question = "Required";
        if (!form.answer.trim()) e.answer = "Required";
        setFieldErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!validate()) return;
        setSaving(true);
        setErr(null);
        try { await onSave(form); }
        catch (e: unknown) { setErr(e instanceof Error ? e.message : "Save failed"); }
        finally { setSaving(false); }
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            {err && <div className="rounded-xl border-2 border-brand-red bg-brand-red-light p-3 text-sm font-bold text-brand-red">{err}</div>}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="id" required>FAQ ID</Label>
                    <Input id="id" value={form.id} onChange={(e) => set("id", e.target.value)} readOnly={!isNew} />
                    {fieldErrors.id && <FieldError>{fieldErrors.id}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input id="sortOrder" type="number" min={0} value={form.sortOrder}
                        onChange={(e) => set("sortOrder", Number(e.target.value))} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="question" required>Question</Label>
                    <Input id="question" value={form.question} onChange={(e) => set("question", e.target.value)} />
                    {fieldErrors.question && <FieldError>{fieldErrors.question}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="questionBn">Question (Bangla)</Label>
                    <Input id="questionBn" value={form.questionBn} onChange={(e) => set("questionBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="answer" required>Answer</Label>
                    <Textarea id="answer" rows={4} value={form.answer} onChange={(e) => set("answer", e.target.value)} />
                    {fieldErrors.answer && <FieldError>{fieldErrors.answer}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="answerBn">Answer (Bangla)</Label>
                    <Textarea id="answerBn" rows={4} value={form.answerBn} onChange={(e) => set("answerBn", e.target.value)} />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save FAQ"}</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

export default function FaqsPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<"list" | "add" | "edit">("list");
    const [editing, setEditing] = useState<FAQ | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3500); }

    async function load() {
        setLoading(true); setError(null);
        const res = await fetch("/api/admin/faqs");
        if (!res.ok) { setError("Failed to load FAQs"); setLoading(false); return; }
        setFaqs(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleAdd(data: FormData) {
        const res = await fetch("/api/admin/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const created: FAQ = await res.json();
        setFaqs((prev) => [...prev, created]);
        setMode("list"); showToast("FAQ added.");
    }

    async function handleEdit(data: FormData) {
        const res = await fetch("/api/admin/faqs", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const updated: FAQ = await res.json();
        setFaqs((prev) => prev.map((f) => f.id === updated.id ? updated : f));
        setMode("list"); setEditing(null); showToast("FAQ updated.");
    }

    async function handleDelete(id: string) {
        const res = await fetch(`/api/admin/faqs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) { showToast("Delete failed."); return; }
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        setConfirmDelete(null); showToast("FAQ deleted.");
    }

    if (mode === "add") return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Add FAQ</h1>
            <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <FaqForm initial={{ ...EMPTY }} isNew={true} onSave={handleAdd} onCancel={() => setMode("list")} />
            </div>
        </div>
    );

    if (mode === "edit" && editing) return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Edit FAQ</h1>
            <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <FaqForm
                    initial={{ id: editing.id, question: editing.question, questionBn: editing.questionBn, answer: editing.answer, answerBn: editing.answerBn, sortOrder: editing.sortOrder ?? 0 }}
                    isNew={false} onSave={handleEdit} onCancel={() => { setMode("list"); setEditing(null); }} />
            </div>
        </div>
    );

    return (
        <div>
            {toast && <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-ink bg-brand-yellow px-5 py-3 font-extrabold shadow-card">{toast}</div>}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                        <p className="font-extrabold text-ink">Delete this FAQ?</p>
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
                    <h1 className="text-3xl font-extrabold text-ink">FAQs</h1>
                    <p className="mt-1 font-medium text-ink-mute">{faqs.length} question{faqs.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">↻ Refresh</button>
                    <Button variant="primary" size="sm" onClick={() => setMode("add")}>+ Add FAQ</Button>
                </div>
            </div>

            {error && <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>}

            {loading ? (
                <div className="mt-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />)}</div>
            ) : faqs.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">No FAQs yet.</div>
            ) : (
                <div className="mt-6 space-y-3">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="rounded-2xl border-2 border-ink bg-white p-5 shadow-card">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        {faq.sortOrder !== undefined && (
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg border-2 border-ink/20 bg-brand-gray text-xs font-extrabold text-ink-mute">
                                                {faq.sortOrder}
                                            </span>
                                        )}
                                        <p className="font-extrabold text-ink">{faq.question}</p>
                                    </div>
                                    {faq.questionBn && <p className="mt-0.5 text-sm text-ink-mute">{faq.questionBn}</p>}
                                    <p className="mt-2 text-sm text-ink-mute line-clamp-2">{faq.answer}</p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <button onClick={() => { setEditing(faq); setMode("edit"); }}
                                        className="rounded-lg border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold hover:bg-brand-gray">Edit</button>
                                    <button onClick={() => setConfirmDelete(faq.id)}
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
