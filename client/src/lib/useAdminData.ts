'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 30_000;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json() as Promise<T>;
}

// ── Bookings ────────────────────────────────────────────────────────

type Booking = {
  id: string; parentName: string; studentName: string; phone: string; classLevel: string;
  paymentMethod: string; note: string; status: string; createdAt: string;
  courses?: { title: string }; batches?: { teacher_name: string; days: string; time: string };
};

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchJson<Booking[]>('/api/admin/bookings');
      setBookings(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bookings.');
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, POLL_INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [load]);

  async function updateStatus(id: string, status: string) {
    const response = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error || 'Unable to update status.');
      return;
    }
    setBookings((current) => current.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  return { bookings, error, updateStatus, reload: load };
}

// ── Enquiries ───────────────────────────────────────────────────────

type Enquiry = {
  id: string; name: string; phone: string; classLevel: string;
  subject: string; course: string; question: string; status: string; createdAt: string;
};

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchJson<Enquiry[]>('/api/admin/enquiries');
      setEnquiries(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load enquiries.');
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, POLL_INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [load]);

  async function updateStatus(id: string, status: string) {
    const response = await fetch('/api/admin/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error || 'Unable to update status.');
      return;
    }
    setEnquiries((current) => current.map((e) => (e.id === id ? { ...e, status } : e)));
  }

  return { enquiries, error, updateStatus, reload: load };
}

// ── Nav badge counts ────────────────────────────────────────────────
// Lightweight poll that counts unactioned items for the nav dots.

export type NavCounts = { newEnquiries: number; pendingBookings: number };

export function useNavCounts(): NavCounts {
  const [counts, setCounts] = useState<NavCounts>({ newEnquiries: 0, pendingBookings: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    try {
      const [enquiries, bookings] = await Promise.all([
        fetchJson<Enquiry[]>('/api/admin/enquiries'),
        fetchJson<Booking[]>('/api/admin/bookings'),
      ]);
      setCounts({
        newEnquiries: enquiries.filter((e) => e.status === 'new').length,
        pendingBookings: bookings.filter((b) => b.status === 'pending_payment' || b.status === 'payment_submitted').length,
      });
    } catch {
      // Nav dots are best-effort — silently skip on error
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, POLL_INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [load]);

  return counts;
}
