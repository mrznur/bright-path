import Link from 'next/link';
import { cookies } from 'next/headers';
import AdminLogoutButton from '@/components/AdminLogoutButton';
import AdminNav from '@/components/AdminNav';
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from '@/lib/admin-auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSession(token);
  const isLoggedIn = session !== null;

  if (!isLoggedIn) {
    // On the login page — no chrome, just render the page
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#1E1B4B]">
      <header className="border-b border-[#E8DCC8] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/admin" className="font-bold">BrightPath Admin</Link>
          <AdminLogoutButton />
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-56">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
