'use client';

import { useEffect, useState } from 'react';

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  classLevel: string;
  subject: string;
  course: string;
  question: string;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

const STATUS_COLOURS: Record<string, string> = {
  new: 'bg-[#F5C518] text-[#1E1B4B]',
  contacted: 'bg-blue-100 text-blue-800',
  closed: 'bg-green-100 text-green-800',
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/enquiries')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load enquiries.');
        setEnquiries(data);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load enquiries.'));
  }, []);

  async function updateStatus(id: string, status: string) {
    const response = await fetch('/api/admin/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Unable to update status.');
      return;
    }
    setEnquiries((current) => current.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">Inbox</p>
      <h1 className="mt-2 text-3xl font-bold">Enquiries</h1>
      <p className="mt-2 text-sm text-[#1E1B4B]/60">New contact form submissions saved in Supabase.</p>
      {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <section className="mt-8 rounded-2xl border border-[#E8DCC8] bg-white p-6">
        {enquiries.length === 0 ? <p className="text-sm text-[#1E1B4B]/60">No enquiries yet.</p> : (
          <div className="divide-y divide-[#E8DCC8]">
            {enquiries.map((enquiry) => (
              <article key={enquiry.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h2 className="font-semibold">{enquiry.name} · {enquiry.phone}</h2>
                    <p className="text-sm text-[#1E1B4B]/60">Class {enquiry.classLevel} · {enquiry.subject} · {enquiry.course}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOURS[enquiry.status] || 'bg-[#F5EDD8]'}`}>{enquiry.status}</span>
                    <select
                      value={enquiry.status}
                      onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                      className="rounded-lg border border-[#E8DCC8] px-2 py-1 text-xs font-medium outline-none focus:border-[#1E1B4B]"
                    >
                      {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
                {enquiry.question && <p className="mt-2 text-sm text-[#1E1B4B]/75">{enquiry.question}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
