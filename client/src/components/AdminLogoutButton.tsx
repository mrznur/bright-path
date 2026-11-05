'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loggingOut}
      className="rounded-full border border-[#E8DCC8] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#F7F1E5] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loggingOut ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
