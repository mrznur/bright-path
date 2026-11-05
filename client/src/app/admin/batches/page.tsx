'use client';

import { FormEvent, useEffect, useState } from 'react';

type Course = { id: string; title: string };
type Batch = { id: string; teacherName: string; days: string; time: string; capacity: number; enrolledCount: number; course: Course };

export default function AdminBatchesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [form, setForm] = useState({ courseId: '', teacherName: '', days: '', time: '', capacity: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetch('/api/admin/courses'), fetch('/api/admin/batches')]).then(async ([coursesResponse, batchesResponse]) => {
      const coursesData = await coursesResponse.json();
      const batchesData = await batchesResponse.json();
      if (!coursesResponse.ok || !batchesResponse.ok) throw new Error(coursesData.error || batchesData.error || 'Unable to load batches.');
      setCourses(coursesData);
      setBatches(batchesData);
      if (coursesData[0]) setForm((current) => ({ ...current, courseId: coursesData[0].id }));
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load batches.'));
  }, []);

  async function deactivate(id: string) {
    const response = await fetch('/api/admin/batches', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!response.ok) { const data = await response.json(); setError(data.error || 'Unable to deactivate.'); return; }
    setBatches((current) => current.filter((b) => b.id !== id));
  }

  async function createBatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/admin/batches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, capacity: Number(form.capacity) }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'Unable to create batch.'); return; }
    const course = courses.find((item) => item.id === data.courseId);
    setBatches((current) => [{ ...data, course }, ...current]);
    setForm((current) => ({ ...current, teacherName: '', days: '', time: '', capacity: '' }));
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">Schedules</p>
      <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold">Batches</h1><p className="mt-2 text-sm text-[#1E1B4B]/60">Assign teachers, schedules and capacity to courses.</p></div><a href="/admin/courses" className="w-fit rounded-full border border-[#E8DCC8] px-4 py-2 text-sm font-semibold transition-colors hover:bg-white">Manage courses</a></div>
      <form onSubmit={createBatch} className="mt-8 grid gap-4 rounded-2xl border border-[#E8DCC8] bg-white p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-xl font-bold">Add batch</h2>
        <label className="text-sm font-medium">Course<select required value={form.courseId} onChange={(event) => setForm({ ...form, courseId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] bg-white px-3 py-2.5">{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
        {([['teacherName', 'Teacher'], ['days', 'Days'], ['time', 'Time'], ['capacity', 'Capacity']] as const).map(([field, label]) => <label key={field} className="text-sm font-medium">{label}<input required type={field === 'capacity' ? 'number' : 'text'} min={field === 'capacity' ? 1 : undefined} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-3 py-2.5 outline-none focus:border-[#1E1B4B]" /></label>)}
        {error && <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button type="submit" className="w-fit rounded-xl bg-[#1E1B4B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#312e68]">Create batch</button>
      </form>
      <section className="mt-8 rounded-2xl border border-[#E8DCC8] bg-white p-6"><h2 className="text-xl font-bold">Batch records</h2><div className="mt-4 divide-y divide-[#E8DCC8]">{batches.map((batch) => <div key={batch.id} className="py-4"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><p className="font-semibold">{batch.course?.title || 'Course'} · {batch.teacherName}</p><p className="text-sm text-[#1E1B4B]/60">{batch.days} · {batch.time} · {batch.enrolledCount}/{batch.capacity} enrolled</p></div><button type="button" onClick={() => deactivate(batch.id)} className="text-xs font-semibold text-red-600 hover:text-red-800 w-fit">Deactivate</button></div></div>)}</div></section>
    </div>
  );
}
