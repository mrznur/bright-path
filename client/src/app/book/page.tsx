'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';
import { useContent } from '@/components/ContentProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function BookPage() {
  const params = useSearchParams();
  const { courses, site } = useContent();
  const { language } = useLanguage();
  const bangla = language === 'bn';
  const pick = (en: string, bn: string) => (bangla ? bn : en);
  const course = useMemo(() => courses.find((item) => item.id === params.get('courseId') && item.batchId === params.get('batchId')), [courses, params]);
  const [form, setForm] = useState({ parentName: '', studentName: '', phone: '', classLevel: '', paymentMethod: 'bKash', note: '', consent: false });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseId: course?.id, batchId: course?.batchId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to save booking.');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Unable to reach the booking service. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (!course) {
    return <section className="mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-3xl font-bold">Batch not found</h1><p className="mt-3 text-sm text-[#1E1B4B]/60">Please return to Courses and choose an available batch.</p></section>;
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">{pick('Reserve a seat', 'আসন সংরক্ষণ করুন')}</p>
        <h1 className="mt-2 text-3xl font-bold">{pick(course.title, course.titleBn)}</h1>
        <p className="mt-2 text-sm text-[#1E1B4B]/60">{pick(course.classes, course.classesBn)} · {pick(course.days, course.daysBn)} · {pick(course.time, course.timeBn)}</p>
        {!submitted ? (
          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-[#E8DCC8] bg-white p-6">
            {([
              ['parentName', 'Parent / guardian name'], ['studentName', 'Student name'], ['phone', 'Phone number'], ['classLevel', 'Student class'],
            ] as const).map(([field, label]) => <label key={field} className="block text-sm font-medium">{label}<input required type={field === 'phone' ? 'tel' : 'text'} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-3 py-2.5 outline-none focus:border-[#1E1B4B]" /></label>)}
            <label className="block text-sm font-medium">Payment method
              <select value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] bg-white px-3 py-2.5">
                <option>bKash</option><option>Nagad</option><option>Bank transfer</option>
              </select>
            </label>
            <label className="block text-sm font-medium">Note (optional)<textarea rows={3} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-3 py-2.5 outline-none focus:border-[#1E1B4B]" /></label>
            <label className="flex items-start gap-2 text-xs text-[#1E1B4B]/60"><input type="checkbox" required checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} /> I agree that the center may contact me about this booking.</label>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5C518] py-3 text-sm font-semibold text-[#1E1B4B] transition-colors hover:bg-[#e1b300]">{saving ? 'Saving…' : pick('Continue to payment instructions', 'পেমেন্ট নির্দেশনায় যান')} <FiArrowUpRight /></button>
          </form>
        ) : (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6"><FiCheck className="text-2xl text-green-700" /><h2 className="mt-3 text-xl font-bold text-green-900">{pick('Seat request received', 'আসনের অনুরোধ গ্রহণ করা হয়েছে')}</h2><p className="mt-2 text-sm text-green-800">Please complete the manual payment using the instructions, then call {site.phone.en} so the center can confirm your seat.</p></div>
        )}
      </div>
      <aside className="h-fit rounded-2xl border border-[#E8DCC8] bg-[#F5EDD8] p-6">
        <h2 className="text-xl font-bold">{pick('Manual payment instructions', 'ম্যানুয়াল পেমেন্ট নির্দেশনা')}</h2>
        <p className="mt-2 text-sm text-[#1E1B4B]/65">No online payment gateway is connected. Send the monthly fee manually and contact the center for confirmation.</p>
        <div className="mt-5 space-y-3 text-sm"><p><strong>bKash:</strong> {site.phone.en}</p><p><strong>Nagad:</strong> {site.phone.en}</p><p><strong>Bank transfer:</strong> Contact the center for account details.</p></div>
        <p className="mt-5 text-xs text-[#1E1B4B]/60">Do not send payment before confirming the batch and payment number with the center. Keep your transaction ID.</p>
      </aside>
    </section>
  );
}
