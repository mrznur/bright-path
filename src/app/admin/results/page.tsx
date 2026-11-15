"use client";

import { useEffect, useState } from "react";
import type { StudentResult } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";

type FormData = Omit<StudentResult, "id"> & { id: string };

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY: FormData = {
    id: "", studentName: "", studentNameBn: "",
    exam: "", examBn: "", subject: "", subjectBn: "",
    grade: "", gradeBn: "", year: new Date().getFullYear(),
};

function ResultForm({
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
            if (key === "studentName" && isNew) next.id = "r-" + slugify(value as string).slice(0, 15) + "-" + Date.now().toString(36);
            return next;
        });
        setFieldErrors((e) => ({ ...e, [key]: undefined }));
    }

    function validate() {
        const e: typeof fieldErrors = {};
        if (!form.id.trim()) e.id = "Required";
        if (!form.studentName.trim()) e.studentName = "Required";
        if (!form.exam.trim()) e.exam = "Required";
        if (!form.grade.trim()) e.grade = "Required";
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
                <Label htmlFor="id" required>Result ID</Label>
                <Input id="id" value={form.id} onChange={(e) => set("id", e.target.value)} readOnly={!isNew} />
                {fieldErrors.id && <FieldError>{fieldErrors.id}</FieldError>}
                {isNew && <p className="mt-1 text-xs text-ink-mute">Auto-generated from student name.</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="studentName" required>Student Name</Label>
                    <Input id="studentName" value={form.studentName} onChange={(e) => set("studentName", e.target.value)} />
                    {fieldErrors.studentName && <FieldError>{fieldErrors.studentName}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="studentNameBn">Student Name (Bangla)</Label>
                    <Input id="studentNameBn" value={form.studentNameBn} onChange={(e) => set("studentNameBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="exam" required>Exam</Label>
                    <Input id="exam" value={form.exam} onChange={(e) => set("exam", e.target.value)} placeholder="e.g. SSC 2024" />
                    {fieldErrors.exam && <FieldError>{fieldErrors.exam}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="examBn">Exam (Bangla)</Label>
                    <Input id="examBn" value={form.examBn} onChange={(e) => set("examBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="e.g. Physics" />
                </div>
                <div>
                    <Label htmlFor="subjectBn">Subject (Bangla)</Label>
                    <Input id="subjectBn" value={form.subjectBn} onChange={(e) => set("subjectBn", e.target.value)} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div>
                    <Label htmlFor="grade" required>Grade</Label>
                    <Input id="grade" value={form.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. A+ or GPA 5.0" />
                    {fieldErrors.grade && <FieldError>{fieldErrors.grade}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="gradeBn">Grade (Bangla)</Label>
                    <Input id="gradeBn" value={form.gradeBn} onChange={(e) => set("gradeBn", e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" min={2000} max={2099} value={form.year}
                        onChange={(e) => set("year", Number(e.target.value))} />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save result"}</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

export default function ResultsPage() {
    const [results, setResults] = useState<StudentResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<"list" | "add" | "edit">("list");
    const [editing, setEditing] = useState<StudentResult | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3500); }

    async function load() {
        setLoading(true); setError(null);
        const res = await fetch("/api/admin/results");
        if (!res.ok) { setError("Failed to load results"); setLoading(false); return; }
        setResults(await res.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleAdd(data: FormData) {
        const res = await fetch("/api/admin/results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const created: StudentResult = await res.json();
        setResults((prev) => [created, ...prev]);
        setMode("list"); showToast("Result added.");
    }

    async function handleEdit(data: FormData) {
        const res = await fetch("/api/admin/results", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const updated: StudentResult = await res.json();
        setResults((prev) => prev.map((r) => r.id === updated.id ? updated : r));
        setMode("list"); setEditing(null); showToast("Result updated.");
    }

    async function handleDelete(id: string) {
        const res = await fetch(`/api/admin/results?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) { showToast("Delete failed."); return; }
        setResults((prev) => prev.filter((r) => r.id !== id));
        setConfirmDelete(null); showToast("Result deleted.");
    }

    if (mode === "add") return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Add Result</h1>
            <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <ResultForm initial={{ ...EMPTY }} isNew={true} onSave={handleAdd} onCancel={() => setMode("list")} />
            </div>
        </div>
    );

    if (mode === "edit" && editing) return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Edit Result</h1>
            <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <ResultForm initial={editing} isNew={false} onSave={handleEdit} onCancel={() => { setMode("list"); setEditing(null); }} />
            </div>
        </div>
    );

    return (
        <div>
            {toast && <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-ink bg-brand-yellow px-5 py-3 font-extrabold shadow-card">{toast}</div>}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                        <p className="font-extrabold text-ink">Delete this result?</p>
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
                    <h1 className="text-3xl font-extrabold text-ink">Student Results</h1>
                    <p className="mt-1 font-medium text-ink-mute">{results.length} result{results.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">↻ Refresh</button>
                    <Button variant="primary" size="sm" onClick={() => setMode("add")}>+ Add result</Button>
                </div>
            </div>

            {error && <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>}

            {loading ? (
                <div className="mt-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />)}</div>
            ) : results.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">No results yet.</div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-ink shadow-card">
                    <table className="min-w-full divide-y-2 divide-ink/10 text-sm">
                        <thead className="bg-brand-gray">
                            <tr>
                                {["Year", "Student", "Exam", "Subject", "Grade", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-ink-mute">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10 bg-white">
                            {results.map((r) => (
                                <tr key={r.id} className="hover:bg-brand-gray">
                                    <td className="whitespace-nowrap px-4 py-3 font-extrabold text-ink">{r.year}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-extrabold text-ink">{r.studentName}</p>
                                        {r.studentNameBn && <p className="text-xs text-ink-mute">{r.studentNameBn}</p>}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{r.exam}</td>
                                    <td className="px-4 py-3 font-medium text-ink-mute">{r.subject}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-lg border-2 border-ink/20 bg-brand-green-light px-2 py-0.5 text-xs font-extrabold text-ink">{r.grade}</span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditing(r); setMode("edit"); }}
                                                className="rounded-lg border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold hover:bg-brand-gray">Edit</button>
                                            <button onClick={() => setConfirmDelete(r.id)}
                                                className="rounded-lg border-2 border-brand-red bg-white px-3 py-1 text-xs font-extrabold text-brand-red hover:bg-brand-red hover:text-white">Delete</button>
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
