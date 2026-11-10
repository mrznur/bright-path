'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPhone, FiArrowUpRight, FiCalendar } from 'react-icons/fi';
import { useLanguage } from '@/components/LanguageProvider';
import { useContent } from '@/components/ContentProvider';

const LEVELS = [
  { key: 'All', en: 'All levels', bn: 'সব' },
  { key: 'Primary', en: 'Primary (3–5)', bn: 'প্রাথমিক (৩–৫)' },
  { key: 'Junior', en: 'Junior (6–7)', bn: 'জুনিয়র (৬–৭)' },
  { key: 'JSC', en: 'JSC (8)', bn: 'জেএসসি (৮)' },
  { key: 'SSC', en: 'SSC (9–10)', bn: 'এসএসসি (৯–১০)' },
  { key: 'HSC', en: 'HSC (11–12)', bn: 'এইচএসসি (১১–১২)' },
] as const;

type LevelKey = (typeof LEVELS)[number]['key'];

export default function CoursesPage() {
  const { language, t } = useLanguage();
  const { courses, site } = useContent();
  const bangla = language === 'bn';

  const pick = (en: string, bn: string) => (bangla ? bn : en);
  const num = (x: number) => x.toLocaleString(bangla ? 'bn-BD' : 'en-US');

  const [level, setLevel] = useState<LevelKey>('All');
  const router = useRouter();

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('level');
    if (param && LEVELS.some((l) => l.key === param)) {
      setLevel(param as LevelKey);
    }
  }, []);

  const visible = courses.filter((c) => level === 'All' || c.level === level);

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick('Our courses', 'আমাদের কোর্সসমূহ')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] leading-tight mb-4">
          {bangla ? (
            <>সঠিক কোর্স বেছে নিন<br />আপনার সন্তানের জন্য।</>
          ) : (
            <>Find the right course<br />for your child.</>
          )}
        </h1>
        <p className="text-base text-[#1E1B4B]/65 max-w-xl mb-6">
          {pick(
            'Browse by class level. Each card shows the subject and schedule - click to see the teacher, fee and available seats.',
            'শ্রেণি অনুযায়ী দেখুন। প্রতিটি কার্ডে বিষয় ও সময়সূচি আছে — শিক্ষক, ফি ও আসনের বিস্তারিত দেখতে কার্ডে ক্লিক করুন।',
          )}
        </p>
        <div className="flex items-start gap-2 bg-[#F5EDD8] border border-[#E8DCC8] rounded-xl px-4 py-3 text-sm text-[#1E1B4B]/60 max-w-2xl">
          <span className="mt-0.5 shrink-0 text-[#1E1B4B]/60">ℹ</span>
          <span>
            {pick(
              'Please confirm seat availability and fees with the center before admission.',
              'ভর্তির আগে আসন ও ফি সেন্টারের সাথে নিশ্চিত করে নিন।',
            )}
          </span>
        </div>
      </section>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.key}
              type="button"
              onClick={() => setLevel(lvl.key)}
              aria-pressed={level === lvl.key}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                level === lvl.key
                  ? 'bg-[#1E1B4B] text-white border-[#1E1B4B]'
                  : 'bg-white text-[#1E1B4B] border-[#E8DCC8] hover:border-[#1E1B4B]'
              }`}
            >
              {pick(lvl.en, lvl.bn)}
            </button>
          ))}
        </div>
      </section>

      {/* ── Course cards ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <p className="text-base text-[#1E1B4B]/70 mb-6">
          {bangla
            ? `${num(visible.length)}টি ব্যাচ`
            : `${visible.length} ${visible.length === 1 ? 'batch' : 'batches'}`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((course) => {
            const seatsLeft = course.batchSize - course.enrolledCount;
            const detailHref = `/courses/${encodeURIComponent(course.id)}`;
            const bookHref = course.batchId
              ? `/book?courseId=${encodeURIComponent(course.id)}&batchId=${encodeURIComponent(course.batchId)}`
              : '/contact';

            return (
              <div
                key={course.id}
                onClick={() => router.push(detailHref)}
                className="bg-white border border-[#E8DCC8] rounded-2xl flex flex-col overflow-hidden hover:shadow-xl hover:bg-[#FDF8F0] hover:border-[#D4C5A9] transition-all duration-200 cursor-pointer group"
              >
                {/* Coloured level strip */}
                <div className="bg-[#F5EDD8] group-hover:bg-[#EDE0C4] px-5 py-3 flex items-center justify-between gap-2 transition-colors duration-200">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1E1B4B]/50 group-hover:text-[#1E1B4B]/70 transition-colors">
                    {pick(course.level, course.levelBn)} · {pick(course.classes, course.classesBn)}
                  </p>
                  {course.isFull ? (
                    <span className="shrink-0 bg-[#1E1B4B]/10 text-xs font-semibold uppercase tracking-wide text-[#1E1B4B]/60 px-2.5 py-1 rounded-full">
                      {pick('Batch full', 'ব্যাচ পূর্ণ')}
                    </span>
                  ) : (
                    <span className="shrink-0 bg-[#F5C518]/70 group-hover:bg-[#F5C518] text-[#1E1B4B] text-xs font-semibold px-2.5 py-1 rounded-full transition-colors duration-200">
                      {bangla ? `${num(seatsLeft)} আসন খালি` : `${seatsLeft} seats left`}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="px-5 pt-5 pb-4 flex flex-col gap-4 flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-[#1E1B4B] group-hover:text-[#12103A] leading-snug transition-colors duration-200">
                      {pick(course.title, course.titleBn)}
                    </h2>
                    <p className="text-base text-[#1E1B4B]/60 mt-1">
                      {pick(course.subject, course.subjectBn)}
                    </p>
                  </div>

                  <p className="flex items-center gap-2 text-base text-[#1E1B4B]/65">
                    <FiCalendar className="shrink-0 text-[#1E1B4B]/70" />
                    {pick(course.days, course.daysBn)} · {pick(course.time, course.timeBn)}
                  </p>

                  {/* Fee teaser */}
                  <p className="text-2xl font-bold text-[#1E1B4B]">
                    ৳{num(course.monthlyFee)}{' '}
                    <span className="text-sm font-normal text-[#1E1B4B]/65">
                      {pick('/ month', '/ মাস')}
                    </span>
                  </p>
                </div>

                {/* Actions */}
                <div
                  className="px-5 pb-5 grid grid-cols-2 gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href={detailHref}
                    className="flex items-center justify-center gap-1.5 border border-[#E8DCC8] group-hover:border-[#D4C5A9] text-[#1E1B4B] text-base font-semibold py-3 rounded-xl hover:bg-[#EDE0C4] transition-colors duration-200"
                  >
                    {pick('See details', 'বিস্তারিত')}
                  </Link>
                  {course.isFull ? (
                    <span className="flex items-center justify-center rounded-xl bg-[#E8DCC8] py-3 text-base font-semibold text-[#1E1B4B]/45">
                      {pick('Full', 'পূর্ণ')}
                    </span>
                  ) : (
                    <Link
                      href={bookHref}
                      className="flex items-center justify-center gap-1.5 bg-[#F5C518] text-[#1E1B4B] text-base font-semibold py-3 rounded-xl hover:bg-[#1E1B4B] hover:text-white transition-colors duration-200"
                    >
                      {pick(course.batchId ? 'Book seat' : 'Enquire', course.batchId ? 'আসন বুক করুন' : 'জিজ্ঞাসা করুন')}
                      <FiArrowUpRight />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-sm text-[#1E1B4B]/50 text-center mt-10">
          {pick(
            'All fees are in BDT. Seat availability and timetables may change. A place is confirmed only after speaking with the center.',
            'সব ফি বাংলাদেশি টাকায়। আসন ও সময়সূচি পরিবর্তন হতে পারে। কেন্দ্রের সাথে কথা বলার পরই আসন নিশ্চিত হবে।',
          )}
        </p>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="bg-[#F5C518] py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-widest uppercase text-[#1E1B4B]/60 mb-3">
              {pick('Not sure which batch is right?', 'কোন ব্যাচ উপযোগী, বুঝতে পারছেন না?')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B4B] mb-2">
              {pick('We can help you choose.', 'আমরা সাহায্য করতে পারি।')}
            </h2>
            <p className="text-base text-[#1E1B4B]/70 max-w-xl">
              {pick(
                'Call us or send an enquiry. We will help you find the right course and arrange a demo class.',
                'ফোন করুন বা জিজ্ঞাসা পাঠান। সঠিক কোর্স বেছে নিতে এবং ডেমো ক্লাসের ব্যবস্থা করতে আমরা সাহায্য করব।',
              )}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#1E1B4B] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white hover:text-[#1E1B4B] transition-colors text-base"
            >
              {pick('Book a demo class', 'ডেমো ক্লাস বুক করুন')} <FiArrowUpRight />
            </Link>
            <a
              href={site.tel}
              className="flex items-center justify-center gap-2 bg-white text-[#1E1B4B] font-semibold px-6 py-3.5 rounded-full text-base hover:bg-[#1E1B4B] hover:text-white transition-colors"
            >
              {t('callUs')} <FiPhone />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

