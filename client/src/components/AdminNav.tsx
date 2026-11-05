'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavCounts } from '@/lib/useAdminData';

export default function AdminNav() {
  const pathname = usePathname();
  const { newEnquiries, pendingBookings } = useNavCounts();

  const links = [
    { href: '/admin', label: 'Overview', exact: true, dot: 0 },
    { href: '/admin/courses', label: 'Courses & batches', exact: false, dot: 0 },
    { href: '/admin/enquiries', label: 'Enquiries', exact: false, dot: newEnquiries },
    { href: '/admin/bookings', label: 'Bookings', exact: false, dot: pendingBookings },
    { href: '/admin/content', label: 'Site content', exact: false, dot: 0 },
  ];

  return (
    <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`relative flex items-center justify-between whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              active
                ? 'bg-[#1E1B4B] text-white hover:bg-[#312e68]'
                : 'border border-[#E8DCC8] bg-white text-[#1E1B4B] hover:bg-white/70'
            }`}
          >
            {link.label}
            {link.dot > 0 && (
              <span
                aria-label={`${link.dot} unactioned`}
                className={`ml-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs font-bold ${
                  active ? 'bg-[#F5C518] text-[#1E1B4B]' : 'bg-red-500 text-white'
                }`}
              >
                {link.dot}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
