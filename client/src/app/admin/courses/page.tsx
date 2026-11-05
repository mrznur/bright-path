'use client';

import { FormEvent, useEffect, useState } from 'react';

type Course = {
  id: string;
  title: string;
  titleBn: string;
  level: string;
  classes: string;
  subject: string;
  description: string;
  monthlyFee: number;
};

const emptyCourse = { title: '', titleBn: '', level: 'Primary', classes: '', subject: '', description: '', monthlyFee: '' };

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState(emptyCourse);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadCourses() {
    const response = await fetch('/api/admin/courses');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to load courses.');
    setCourses(data);
  }

  useEffect(() => {
    loadCourses().catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load courses.')).finally(() => setLoading(false));
  }, []);

  async function deactivate(id: string) {
    const response = await fetch('/api/admin/courses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!response.ok) { const data = await response.json(); setError(data.error || 'Unable to deactivate.'); return; }
    setCourses((current) => current.filter((c) => c.id !== id));
    setNotice('Course deactivated.');
  }

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    const response = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, monthlyFee: Number(form.monthlyFee) }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Unable to create course.');
      return;
    }
    setCourses((current) => [data, ...current]);
    setForm(emptyCourse);
    setNotice('Course created.');
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">Catalogue</p>
      <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="mt-2 text-sm text-[#1E1B4B]/60">Create the course records that batches will use.</p>
        </div>
        <a href="/admin/batches" className="w-fit rounded-full border border-[#E8DCC8] px-4 py-2 text-sm font-semibold transition-colors hover:bg-white">Manage batches</a>
      </div>

      <form onSubmit={createCourse} className="mt-8 grid gap-4 rounded-2xl border border-[#E8DCC8] bg-white p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-xl font-bold">Add course</h2>
        {[
          ['title', 'Title'], ['titleBn', 'Bangla title'], ['classes', 'Class range'], ['subject', 'Subject'],
        ].map(([field, label]) => (
          <label key={field} className="text-sm font-medium">
            {label}
            <input required={field !== 'titleBn'} value={form[field as keyof typeof form]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-3 py-2.5 outline-none focus:border-[#1E1B4B]" />
          </label>
        ))}
        <label className="text-sm font-medium">Level
          <select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] bg-white px-3 py-2.5 outline-none focus:border-[#1E1B4B]">
            {['Primary', 'Junior', 'JSC', 'SSC', 'HSC'].map((level) => <option key={level}>{level}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Monthly fee (BDT)
          <input required type="number" min="0" value={form.monthlyFee} onChange={(event) => setForm({ ...form, monthlyFee: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-3 py-2.5 outline-none focus:border-[#1E1B4B]" />
        </label>
        <label className="text-sm font-medium sm:col-span-2">Description
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-3 py-2.5 outline-none focus:border-[#1E1B4B]" />
        </label>
        {error && <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {notice && <p role="status" className="sm:col-span-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>}
        <button type="submit" className="w-fit rounded-xl bg-[#1E1B4B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#312e68]">Create course</button>
      </form>

      <section className="mt-8 rounded-2xl border border-[#E8DCC8] bg-white p-6">
        <h2 className="text-xl font-bold">Course records</h2>
        {loading ? <p className="mt-4 text-sm text-[#1E1B4B]/60">Loading courses…</p> : courses.length === 0 ? <p className="mt-4 text-sm text-[#1E1B4B]/60">No courses yet.</p> : (
          <div className="mt-4 divide-y divide-[#E8DCC8]">
            {courses.map((course) => <div key={course.id} className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"><div><p className="font-semibold">{course.title}</p><p className="text-sm text-[#1E1B4B]/60">{course.level} · {course.classes} · {course.subject}</p></div><div className="flex items-center gap-3"><span className="text-sm font-semibold">৳{course.monthlyFee.toLocaleString()}</span><button type="button" onClick={() => deactivate(course.id)} className="text-xs font-semibold text-red-600 hover:text-red-800">Deactivate</button></div></div>)}
          </div>
        )}
      </section>
    </div>
  );
}
