'use client';

import { useEffect, useState } from 'react';

type Booking = {
  id: string; parentName: string; studentName: string; phone: string; classLevel: string;
  paymentMethod: string; note: string; status: string; createdAt: string;
  courses?: { title: string }; batches?: { teacher_name: string; days: string; time: string };
};

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Pending payment' },
  { value: 'payment_submitted', label: 'Payment submitted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLOURS: Record<string, string> = {
  pending_payment: 'bg-[#F5C518] text-[#1E1B4B]',
  payment_submitted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('/api/admin/bookings').then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load bookings.');
      setBookings(data);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load bookings.'));
  }, []);

  async function updateStatus(id: string, status: string) {
    const response = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Unable to update status.');
      return;
    }
    setBookings((current) => current.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  return <div>
    <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">Reservations</p>
    <h1 className="mt-2 text-3xl font-bold">Bookings</h1>
    <p className="mt-2 text-sm text-[#1E1B4B]/60">Manual-payment seat requests awaiting confirmation.</p>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <section className="mt-8 rounded-2xl border border-[#E8DCC8] bg-white p-6">
      {bookings.length === 0 ? <p className="text-sm text-[#1E1B4B]/60">No bookings yet.</p> : <div className="divide-y divide-[#E8DCC8]">
        {bookings.map((booking) => <article key={booking.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            <div>
              <h2 className="font-semibold">{booking.studentName} · {booking.parentName}</h2>
              <p className="text-sm text-[#1E1B4B]/60">{booking.phone} · Class {booking.classLevel} · {booking.courses?.title}</p>
              <p className="text-sm text-[#1E1B4B]/60">{booking.paymentMethod} · {booking.batches?.days} · {booking.batches?.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOURS[booking.status] || 'bg-[#F5EDD8]'}`}>{booking.status}</span>
              <select
                value={booking.status}
                onChange={(e) => updateStatus(booking.id, e.target.value)}
                className="rounded-lg border border-[#E8DCC8] px-2 py-1 text-xs font-medium outline-none focus:border-[#1E1B4B]"
              >
                {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
          {booking.note && <p className="mt-2 text-sm text-[#1E1B4B]/75">{booking.note}</p>}
        </article>)}
      </div>}
    </section>
  </div>;
}
