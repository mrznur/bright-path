'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import { usePathname } from 'next/navigation';
import { ContentProvider } from '@/components/ContentProvider';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return <>{children}</>;

  return (
    <ContentProvider>
      <LanguageProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </LanguageProvider>
    </ContentProvider>
  );
}
