'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState('/admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get('next');
    if (next?.startsWith('/')) setNextPath(next);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Unable to sign in.');
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError('Unable to reach the login service. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-[#FFF6E5] px-4 py-12 flex items-center justify-center overflow-hidden">
      {/* blurred logo background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-20 blur-2xl scale-150 select-none"
      />
      <section className="relative z-10 w-full max-w-md rounded-2xl border border-[#E8DCC8] bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">BrightPath administration</p>
        <h1 className="mt-2 text-3xl font-bold text-[#1E1B4B]">Sign in</h1>
        <p className="mt-2 text-sm text-[#1E1B4B]/60">Manage courses, batches and centre operations.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm font-medium text-[#1E1B4B]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-4 py-3 outline-none focus:border-[#1E1B4B]"
            />
          </label>
          <label className="block text-sm font-medium text-[#1E1B4B]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-4 py-3 outline-none focus:border-[#1E1B4B]"
            />
          </label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-[#1E1B4B] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#312e68] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
