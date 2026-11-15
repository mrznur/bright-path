"use client";

import { useEffect, useState } from "react";
import type { Course, Teacher, Batch, CourseInput } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Label, FieldError } from "@/components/ui/Field";

const LEVELS: Course["level"][] = ["Primary", "Junior", "JSC", "SSC", "HSC"];

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Course form ─────────────────────────────────────────────────────────────

type CourseFormData = CourseInput & {
    // initial batch included with new courses
    batchId?: string;
    batchDays?: string; batchDaysBn?: string;
    batchTime?: string; batchTimeBn?: string;
    batchSize?: number; batchEnrolledCount?: number; batchIsFull?: boolean;
};

const COURSE_EMPTY: CourseFormData = {
    id: "", title: "", titleBn: "",
    level: "Primary", levelBn: "",
    classes: "", classesBn: "",
    subject: "", subjectBn: "",
    description: "", descriptionBn: "",
    teacherId: "", monthlyFee: 1800,
    // initial batch
    batchId: "", batchDays: "", batchDaysBn: "", batchTime: "", batchTimeBn: "",
    batchSize: 15, batchEnrolledCount: 0, batchIsFull: false,
};

function CourseForm({
    initial, isNew, teachers, onSave, onCancel,
}: {
    initial: CourseFormData; isNew: boolean; teachers: Teacher[];
    onSave: (data: CourseFormData) => Promise<void>;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<CourseFormData>(initial);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

    function set<K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) {
        setForm((f) => {
            const next = { ...f, [key]: value };
            if (key === "title" && isNew) {
                next.id = slugify(value as string);
                next.batchId = slugify(value as string) + "-a";
            }
            return next;
        });
        setFieldErrors((e) => ({ ...e, [key]: undefined }));
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!form.id.trim()) e.id = "Required";
        if (!form.title.trim()) e.title = "Required";
        if (isNew && !form.batchId?.trim()) e.batchId = "Required";
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
        <form onSubmit={submit} className="space-y-6">
            {err && <div className="rounded-xl border-2 border-brand-red bg-brand-red-light p-3 text-sm font-bold text-brand-red">{err}</div>}

            {/* IDs */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="id" required>Course ID</Label>
                    <Input id="id" value={form.id} onChange={(e) => set("id", e.target.value)}
                        placeholder="e.g. physics-ssc" readOnly={!isNew} />
                    {fieldErrors.id && <FieldError>{fieldErrors.id}</FieldError>}
                    {isNew && <p className="mt-1 text-xs text-ink-mute">Auto-filled from title. Cannot change after creation.</p>}
                </div>
                {isNew && (
                    <div>
                        <Label htmlFor="batchId" required>First Batch ID</Label>
                        <Input id="batchId" value={form.batchId ?? ""} onChange={(e) => set("batchId", e.target.value)}
                            placeholder="e.g. physics-ssc-a" />
                        {fieldErrors.batchId && <FieldError>{fieldErrors.batchId}</FieldError>}
                    </div>
                )}
            </div>

            {/* Title */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="title" required>Title</Label>
                    <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} />
                    {fieldErrors.title && <FieldError>{fieldErrors.title}</FieldError>}
                </div>
                <div>
                    <Label htmlFor="titleBn">Title (Bangla)</Label>
                    <Input id="titleBn" value={form.titleBn} onChange={(e) => set("titleBn", e.target.value)} />
                </div>
            </div>

            {/* Level */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="level" required>Level</Label>
                    <Select id="level" value={form.level} onChange={(e) => set("level", e.target.value as Course["level"])}>
                        {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </Select>
                </div>
                <div>
                    <Label htmlFor="levelBn">Level (Bangla)</Label>
                    <Input id="levelBn" value={form.levelBn} onChange={(e) => set("levelBn", e.target.value)} placeholder="e.g. এসএসসি" />
                </div>
            </div>

            {/* Classes */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="classes">Classes</Label>
                    <Input id="classes" value={form.classes} onChange={(e) => set("classes", e.target.value)} placeholder="e.g. Classes 9–10" />
                </div>
                <div>
                    <Label htmlFor="classesBn">Classes (Bangla)</Label>
                    <Input id="classesBn" value={form.classesBn} onChange={(e) => set("classesBn", e.target.value)} />
                </div>
            </div>

            {/* Subject */}
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

            {/* Teacher */}
            <div>
                <Label htmlFor="teacherId">Teacher</Label>
                <Select id="teacherId" value={form.teacherId} onChange={(e) => set("teacherId", e.target.value)}>
                    <option value="">— Select teacher —</option>
                    {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                    ))}
                </Select>
            </div>

            {/* Description */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="descriptionBn">Description (Bangla)</Label>
                    <Textarea id="descriptionBn" rows={3} value={form.descriptionBn} onChange={(e) => set("descriptionBn", e.target.value)} />
                </div>
            </div>

            {/* Fee */}
            <div>
                <Label htmlFor="monthlyFee">Monthly Fee (৳)</Label>
                <Input id="monthlyFee" type="number" min={0} value={form.monthlyFee}
                    onChange={(e) => set("monthlyFee", Number(e.target.value))} />
            </div>

            {/* First batch (new courses only) */}
            {isNew && (
                <fieldset className="rounded-xl border-2 border-ink/20 p-4">
                    <legend className="px-2 text-sm font-extrabold text-ink">First Batch</legend>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="batchDays">Days</Label>
                            <Input id="batchDays" value={form.batchDays ?? ""} onChange={(e) => set("batchDays", e.target.value)} placeholder="e.g. Sat, Mon, Wed" />
                        </div>
                        <div>
                            <Label htmlFor="batchDaysBn">Days (Bangla)</Label>
                            <Input id="batchDaysBn" value={form.batchDaysBn ?? ""} onChange={(e) => set("batchDaysBn", e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="batchTime">Time</Label>
                            <Input id="batchTime" value={form.batchTime ?? ""} onChange={(e) => set("batchTime", e.target.value)} placeholder="e.g. 4:00 – 5:30 PM" />
                        </div>
                        <div>
                            <Label htmlFor="batchTimeBn">Time (Bangla)</Label>
                            <Input id="batchTimeBn" value={form.batchTimeBn ?? ""} onChange={(e) => set("batchTimeBn", e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="batchSize">Batch Size</Label>
                            <Input id="batchSize" type="number" min={1} value={form.batchSize ?? 15}
                                onChange={(e) => set("batchSize", Number(e.target.value))} />
                        </div>
                        <div>
                            <Label htmlFor="batchEnrolledCount">Enrolled</Label>
                            <Input id="batchEnrolledCount" type="number" min={0} value={form.batchEnrolledCount ?? 0}
                                onChange={(e) => set("batchEnrolledCount", Number(e.target.value))} />
                        </div>
                    </div>
                </fieldset>
            )}

            <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Save course"}</Button>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

// ─── Batch form (inline) ─────────────────────────────────────────────────────

function BatchRow({
    batch, onEdit, onDelete,
}: { batch: Batch; onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border-2 border-ink/20 bg-brand-gray px-4 py-3">
            <div>
                <p className="font-extrabold text-ink text-sm">{batch.id}</p>
                <p className="text-xs text-ink-mute">{batch.days} · {batch.time}</p>
                <p className="text-xs text-ink-mute">{batch.enrolledCount}/{batch.batchSize} enrolled{batch.isFull ? " · FULL" : ""}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={onEdit} className="rounded-lg border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold hover:bg-brand-gray">Edit</button>
                <button onClick={onDelete} className="rounded-lg border-2 border-brand-red bg-white px-3 py-1 text-xs font-extrabold text-brand-red hover:bg-brand-red hover:text-white">Delete</button>
            </div>
        </div>
    );
}

type BatchFormData = Omit<Batch, "courseId">;

function BatchForm({
    initial, courseId, onSave, onCancel,
}: {
    initial: BatchFormData; courseId: string;
    onSave: (data: BatchFormData) => Promise<void>;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<BatchFormData>(initial);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    function set<K extends keyof BatchFormData>(key: K, value: BatchFormData[K]) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function submit(ev: React.FormEvent) {
        ev.preventDefault();
        if (!form.id.trim()) { setErr("Batch ID is required"); return; }
        setSaving(true); setErr(null);
        try { await onSave(form); }
        catch (e: unknown) { setErr(e instanceof Error ? e.message : "Save failed"); }
        finally { setSaving(false); }
    }

    return (
        <form onSubmit={submit} className="mt-3 rounded-xl border-2 border-ink/30 bg-white p-4 space-y-4">
            {err && <div className="rounded-lg border-2 border-brand-red bg-brand-red-light p-2 text-xs font-bold text-brand-red">{err}</div>}
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <Label htmlFor="bid" required>Batch ID</Label>
                    <Input id="bid" value={form.id} onChange={(e) => set("id", e.target.value)} placeholder={courseId + "-b"} />
                </div>
                <div className="flex items-center gap-2 pt-7">
                    <input id="bisFull" type="checkbox" checked={form.isFull}
                        onChange={(e) => set("isFull", e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-2 border-ink accent-brand-blue" />
                    <label htmlFor="bisFull" className="text-sm font-extrabold text-ink">Mark as full</label>
                </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <Label htmlFor="bdays">Days</Label>
                    <Input id="bdays" value={form.days} onChange={(e) => set("days", e.target.value)} placeholder="Sat, Mon, Wed" />
                </div>
                <div>
                    <Label htmlFor="bdaysBn">Days (Bangla)</Label>
                    <Input id="bdaysBn" value={form.daysBn} onChange={(e) => set("daysBn", e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="btime">Time</Label>
                    <Input id="btime" value={form.time} onChange={(e) => set("time", e.target.value)} placeholder="4:00 – 5:30 PM" />
                </div>
                <div>
                    <Label htmlFor="btimeBn">Time (Bangla)</Label>
                    <Input id="btimeBn" value={form.timeBn} onChange={(e) => set("timeBn", e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="bsize">Batch Size</Label>
                    <Input id="bsize" type="number" min={1} value={form.batchSize} onChange={(e) => set("batchSize", Number(e.target.value))} />
                </div>
                <div>
                    <Label htmlFor="benrolled">Enrolled Count</Label>
                    <Input id="benrolled" type="number" min={0} value={form.enrolledCount} onChange={(e) => set("enrolledCount", Number(e.target.value))} />
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="submit" variant="primary" size="sm" disabled={saving}>{saving ? "Saving…" : "Save batch"}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
}

const BATCH_EMPTY: BatchFormData = { id: "", days: "", daysBn: "", time: "", timeBn: "", batchSize: 15, enrolledCount: 0, isFull: false };

// ─── Course detail / batch management ───────────────────────────────────────

function CourseDetail({
    course, teachers, onBack, onCourseUpdated,
}: {
    course: Course; teachers: Teacher[];
    onBack: () => void;
    onCourseUpdated: (c: Course) => void;
}) {
    const [batches, setBatches] = useState<Batch[]>(course.batches ?? []);
    const [addingBatch, setAddingBatch] = useState(false);
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
    const [confirmDeleteBatch, setConfirmDeleteBatch] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

    async function handleAddBatch(data: BatchFormData) {
        const res = await fetch("/api/admin/batches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, courseId: course.id }),
        });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const created: Batch = await res.json();
        setBatches((prev) => [...prev, created]);
        setAddingBatch(false);
        showToast("Batch added.");
    }

    async function handleEditBatch(data: BatchFormData) {
        const res = await fetch("/api/admin/batches", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed"); }
        const updated: Batch = await res.json();
        setBatches((prev) => prev.map((b) => b.id === updated.id ? updated : b));
        setEditingBatch(null);
        showToast("Batch updated.");
    }

    async function handleDeleteBatch(id: string) {
        const res = await fetch(`/api/admin/batches?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) { showToast("Delete failed."); return; }
        setBatches((prev) => prev.filter((b) => b.id !== id));
        setConfirmDeleteBatch(null);
        showToast("Batch deleted.");
    }

    const teacher = teachers.find((t) => t.id === course.teacherId);

    return (
        <div>
            {toast && <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-ink bg-brand-yellow px-5 py-3 font-extrabold shadow-card">{toast}</div>}

            {confirmDeleteBatch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                        <p className="font-extrabold text-ink">Delete this batch?</p>
                        <p className="mt-1 text-sm text-ink-mute">This cannot be undone.</p>
                        <div className="mt-5 flex gap-3">
                            <Button variant="danger" size="sm" onClick={() => handleDeleteBatch(confirmDeleteBatch)}>Delete</Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteBatch(null)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm font-extrabold text-ink-mute hover:text-ink">
                ← Back to courses
            </button>

            <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-card">
                <h2 className="text-xl font-extrabold text-ink">{course.title}</h2>
                <p className="text-sm text-ink-mute">{course.id} · {course.level} · {course.subject}</p>
                {teacher && <p className="mt-1 text-sm text-ink-mute">Teacher: {teacher.name}</p>}
                <p className="mt-1 text-sm font-extrabold text-ink">৳{course.monthlyFee.toLocaleString()}/month</p>
            </div>

            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-ink">Batches ({batches.length})</h3>
                    <Button variant="primary" size="sm" onClick={() => { setAddingBatch(true); setEditingBatch(null); }}>+ Add batch</Button>
                </div>

                {addingBatch && (
                    <BatchForm
                        initial={{ ...BATCH_EMPTY }}
                        courseId={course.id}
                        onSave={handleAddBatch}
                        onCancel={() => setAddingBatch(false)} />
                )}

                <div className="mt-3 space-y-2">
                    {batches.length === 0 && !addingBatch && (
                        <p className="text-sm text-ink-mute">No batches yet.</p>
                    )}
                    {batches.map((b) => (
                        <div key={b.id}>
                            {editingBatch?.id === b.id ? (
                                <BatchForm
                                    initial={{ id: b.id, days: b.days, daysBn: b.daysBn, time: b.time, timeBn: b.timeBn, batchSize: b.batchSize, enrolledCount: b.enrolledCount, isFull: b.isFull }}
                                    courseId={course.id}
                                    onSave={handleEditBatch}
                                    onCancel={() => setEditingBatch(null)} />
                            ) : (
                                <BatchRow batch={b} onEdit={() => { setEditingBatch(b); setAddingBatch(false); }} onDelete={() => setConfirmDeleteBatch(b.id)} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<"list" | "add" | "edit" | "detail">("list");
    const [editing, setEditing] = useState<Course | null>(null);
    const [detail, setDetail] = useState<Course | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3500); }

    async function load() {
        setLoading(true); setError(null);
        const [cr, tr] = await Promise.all([
            fetch("/api/admin/courses"),
            fetch("/api/admin/teachers"),
        ]);
        if (!cr.ok) { setError("Failed to load courses"); setLoading(false); return; }
        setCourses(await cr.json());
        if (tr.ok) setTeachers(await tr.json());
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleAdd(data: CourseFormData) {
        const payload = {
            id: data.id, title: data.title, titleBn: data.titleBn,
            level: data.level, levelBn: data.levelBn,
            classes: data.classes, classesBn: data.classesBn,
            subject: data.subject, subjectBn: data.subjectBn,
            description: data.description, descriptionBn: data.descriptionBn,
            teacherId: data.teacherId, monthlyFee: data.monthlyFee,
            batch: data.batchId ? {
                id: data.batchId, days: data.batchDays ?? "", daysBn: data.batchDaysBn ?? "",
                time: data.batchTime ?? "", timeBn: data.batchTimeBn ?? "",
                batchSize: data.batchSize ?? 15, enrolledCount: data.batchEnrolledCount ?? 0,
                isFull: data.batchIsFull ?? false,
            } : undefined,
        };
        const res = await fetch("/api/admin/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed to create"); }
        const created: Course = await res.json();
        setCourses((prev) => [created, ...prev]);
        setMode("list"); showToast("Course created.");
    }

    async function handleEdit(data: CourseFormData) {
        const payload = {
            id: data.id, title: data.title, titleBn: data.titleBn,
            level: data.level, levelBn: data.levelBn,
            classes: data.classes, classesBn: data.classesBn,
            subject: data.subject, subjectBn: data.subjectBn,
            description: data.description, descriptionBn: data.descriptionBn,
            teacherId: data.teacherId, monthlyFee: data.monthlyFee,
        };
        const res = await fetch("/api/admin/courses", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Failed to update"); }
        const updated: Course = await res.json();
        setCourses((prev) => prev.map((c) => c.id === updated.id ? updated : c));
        setMode("list"); setEditing(null); showToast("Course updated.");
    }

    async function handleDelete(id: string) {
        const res = await fetch(`/api/admin/courses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) { showToast("Delete failed."); return; }
        setCourses((prev) => prev.filter((c) => c.id !== id));
        setConfirmDelete(null); showToast("Course deleted.");
    }

    if (mode === "add") return (
        <div>
            <h1 className="text-3xl font-extrabold text-ink">Add Course</h1>
            <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                <CourseForm initial={{ ...COURSE_EMPTY }} isNew={true} teachers={teachers}
                    onSave={handleAdd} onCancel={() => setMode("list")} />
            </div>
        </div>
    );

    if (mode === "edit" && editing) {
        const initial: CourseFormData = {
            id: editing.id, title: editing.title, titleBn: editing.titleBn,
            level: editing.level, levelBn: editing.levelBn,
            classes: editing.classes, classesBn: editing.classesBn,
            subject: editing.subject, subjectBn: editing.subjectBn,
            description: editing.description, descriptionBn: editing.descriptionBn,
            teacherId: editing.teacherId, monthlyFee: editing.monthlyFee,
        };
        return (
            <div>
                <h1 className="text-3xl font-extrabold text-ink">Edit Course</h1>
                <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                    <CourseForm initial={initial} isNew={false} teachers={teachers}
                        onSave={handleEdit} onCancel={() => { setMode("list"); setEditing(null); }} />
                </div>
            </div>
        );
    }

    if (mode === "detail" && detail) return (
        <CourseDetail
            course={detail}
            teachers={teachers}
            onBack={() => { setMode("list"); setDetail(null); }}
            onCourseUpdated={(c) => setCourses((prev) => prev.map((x) => x.id === c.id ? c : x))} />
    );

    return (
        <div>
            {toast && <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-ink bg-brand-yellow px-5 py-3 font-extrabold shadow-card">{toast}</div>}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                        <p className="font-extrabold text-ink">Delete this course?</p>
                        <p className="mt-1 text-sm text-ink-mute">All batches will also be deleted. This cannot be undone.</p>
                        <div className="mt-5 flex gap-3">
                            <Button variant="danger" size="sm" onClick={() => handleDelete(confirmDelete)}>Delete</Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-ink">Courses</h1>
                    <p className="mt-1 font-medium text-ink-mute">{courses.length} course{courses.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load} className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-extrabold shadow-card-sm hover:bg-brand-gray">↻ Refresh</button>
                    <Button variant="primary" size="sm" onClick={() => setMode("add")}>+ Add course</Button>
                </div>
            </div>

            {error && <div className="mt-4 rounded-xl border-2 border-brand-red bg-brand-red-light p-4 text-sm font-bold text-brand-red">{error}</div>}

            {loading ? (
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />)}
                </div>
            ) : courses.length === 0 ? (
                <div className="mt-16 text-center font-bold text-ink-mute">No courses yet. Add one above.</div>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border-2 border-ink shadow-card">
                    <table className="min-w-full divide-y-2 divide-ink/10 text-sm">
                        <thead className="bg-brand-gray">
                            <tr>
                                {["Level", "Title / ID", "Subject", "Teacher", "Batches", "Fee", ""].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-ink-mute">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10 bg-white">
                            {courses.map((c) => {
                                const teacher = teachers.find((t) => t.id === c.teacherId);
                                const totalSeats = c.batches.reduce((s, b) => s + b.batchSize, 0);
                                const totalEnrolled = c.batches.reduce((s, b) => s + b.enrolledCount, 0);
                                return (
                                    <tr key={c.id} className="hover:bg-brand-gray">
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className="inline-flex rounded-lg border-2 border-ink/20 bg-brand-gray px-2 py-0.5 text-xs font-extrabold text-ink">{c.level}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-extrabold text-ink">{c.title}</p>
                                            <p className="text-xs text-ink-mute">{c.id}</p>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-ink-mute">{c.subject}</td>
                                        <td className="px-4 py-3 font-medium text-ink-mute">{teacher?.name ?? "—"}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => { setDetail(c); setMode("detail"); }}
                                                className="inline-flex items-center gap-1 rounded-lg border-2 border-ink/20 bg-brand-blue-light px-2.5 py-1 text-xs font-extrabold text-ink hover:border-brand-blue">
                                                {c.batches.length} batch{c.batches.length !== 1 ? "es" : ""} · {totalEnrolled}/{totalSeats}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-extrabold text-ink">৳{c.monthlyFee.toLocaleString()}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditing(c); setMode("edit"); }}
                                                    className="rounded-lg border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold hover:bg-brand-gray">Edit</button>
                                                <button onClick={() => setConfirmDelete(c.id)}
                                                    className="rounded-lg border-2 border-brand-red bg-white px-3 py-1 text-xs font-extrabold text-brand-red hover:bg-brand-red hover:text-white">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
