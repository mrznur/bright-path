import type { Metadata } from 'next';
import './globals.css';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  title: 'BrightPath Coaching Center Dhaka | Learn with Confidence',
  description:
    'Explore Primary, JSC, SSC and HSC support at BrightPath Coaching Center in Dhaka. Find a course, review fees and ask about a demo class.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
