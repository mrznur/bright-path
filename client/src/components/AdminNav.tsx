'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/courses', label: 'Courses & batches', exact: false },
  { href: '/admin/enquiries', label: 'Enquiries', exact: false },
  { href: '/admin/bookings', label: 'Bookings', exact: false },
  { href: '/admin/content', label: 'Site content', exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`block whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              active
                ? 'bg-[#1E1B4B] text-white hover:bg-[#312e68]'
                : 'border border-[#E8DCC8] bg-white text-[#1E1B4B] hover:bg-white/70'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
