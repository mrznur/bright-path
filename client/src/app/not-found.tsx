import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">404</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] mt-3">
        Page not found · পাতা পাওয়া যায়নি
      </h1>
      <p className="text-[#1E1B4B]/60 mt-3">
        Let&apos;s get you back to a useful place · হোম পেজে ফিরে যান।
      </p>
      <Link href="/" className="inline-flex mt-7 bg-[#F5C518] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-[#e1b300]">
        Back to home · হোমে ফিরুন
      </Link>
    </section>
  );
}
