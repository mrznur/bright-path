'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPhone, FiArrowUpRight, FiUser, FiCalendar, FiUsers } from 'react-icons/fi';
import { useLanguage } from '@/components/LanguageProvider';
import { useContent } from '@/components/ContentProvider';

const LEVELS = [
  { key: 'All', en: 'All', bn: 'সব' },
  { key: 'Primary', en: 'Primary', bn: 'প্রাথমিক' },
  { key: 'Junior', en: 'Junior (6-7)', bn: 'জুনিয়র (৬–৭)' },
  { key: 'JSC', en: 'JSC (8)', bn: 'জেএসসি (৮)' },
  { key: 'SSC', en: 'SSC (9-10)', bn: 'এসএসসি (৯–১০)' },
  { key: 'HSC', en: 'HSC (11-12)', bn: 'এইচএসসি (১১-১২)' },
] as const;

type LevelKey = (typeof LEVELS)[number]['key'];


export default function CoursesPage() {
  const { language, t } = useLanguage();
  const { courses, site } = useContent();
  const bangla = language === 'bn';

  const pick = (en: string, bn: string) => (bangla ? bn : en);
  const num = (x: number) => x.toLocaleString(bangla ? 'bn-BD' : 'en-US');

  const [level, setLevel] = useState<LevelKey>('All');

  // Open the right filter when arriving from the home page (e.g. /courses?level=SSC)
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
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick('Our courses', 'আমাদের কোর্সসমূহ')}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] leading-tight mb-3">
          {bangla ? (
            <>প্রত্যেক শিক্ষার্থীর শেখার ধরনই আলাদা।<br />সঠিক কোর্স বেছে নিতে আমরা আপনাকে সাহায্য করবো।</>
          ) : (
            <>Every student learns differently.<br />We will help you find the right fit.</>
          )}
        </h1>
        <p className="text-[#1E1B4B]/60 max-w-xl mb-6">
          {pick(
            "Not sure which batch is right for you as a student or for your child? Tell us a little about your needs and we will guide you.",
            'আপনার জন্য বা আপনার সন্তানের জন্য কোন কোর্সটি সঠিক বুঝতে পারছেন না? আমাদেরকে জানান, আমরাই আপনাকে সাহায্য করবো কোর্স সিলেক্ট করতে।'
          )}
        </p>
        <div className="flex items-start gap-2 bg-[#F5EDD8] border border-[#E8DCC8] rounded-xl px-4 py-3 text-xs text-[#1E1B4B]/60 max-w-2xl">
          <span className="mt-0.5 shrink-0 text-[#1E1B4B]/40">ℹ</span>
          <span>
            {pick(
              'Please confirm contact details with the center before admission.',
              'ভর্তির আগে অনুগ্রহ করে যোগাযোগের তথ্য কোচিং সেন্টারের সাথে কথা বলে নিশ্চিত করে নিন।'
            )}
          </span>
        </div>
      </section>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick('Choose a class level', 'শ্রেণি অনুযায়ী বেছে নিন')}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.key}
              type="button"
              onClick={() => setLevel(lvl.key)}
              aria-pressed={level === lvl.key}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${level === lvl.key
                ? 'bg-[#1E1B4B] text-white border-[#1E1B4B] hover:bg-[#312e68]'
                : 'bg-white text-[#1E1B4B] border-[#E8DCC8] hover:border-[#1E1B4B]'
                }`}
            >
              {pick(lvl.en, lvl.bn)}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#1E1B4B]/50 max-w-2xl">
          {pick(
            'Junior covers Classes 6–7, JSC covers Class 8, SSC covers Classes 9–10 and HSC covers Classes 11–12. Our sample batches follow the Bangla-medium/English-version school syllabus.',
            'জুনিয়র লেভেল ৬ষ্ঠ–৭ম, জেএসসি ৮ম, এসএসসি ৯ম–১০ম এবং এইচএসসি ১১শ–১২শ শ্রেণির অন্তর্ভুক্ত। আমাদের নমুনা ব্যাচগুলো বাংলা মাধ্যম বা ইংরেজি ভার্সনের স্কুল সিলেবাস অনুসরণ করে।'
          )}
        </p>
      </section>

      {/* ── Course cards ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <p className="text-sm text-[#1E1B4B]/50 mb-5">
          {bangla
            ? `${num(visible.length)}টি ব্যাচ দেখানো হচ্ছে`
            : `Showing ${visible.length} ${visible.length === 1 ? 'batch' : 'batches'}`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((course) => {
            const seatsLeft = course.batchSize - course.enrolledCount;
            return (
              <div
                key={course.id}
                role="link"
                tabIndex={0}
                onClick={() => {
                  window.location.href = `/courses/${encodeURIComponent(course.id)}`;
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    window.location.href = `/courses/${encodeURIComponent(course.id)}`;
                  }
                }}
                className="bg-white border border-[#E8DCC8] rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-3 focus-visible:outline-[#F5C518] focus-visible:outline-offset-2"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-[#1E1B4B]/40 uppercase tracking-wider">
                      {pick(course.level, course.levelBn)} · {pick(course.classes, course.classesBn)}
                    </p>
                    <h2 className="text-xl font-bold text-[#1E1B4B] mt-0.5">{pick(course.title, course.titleBn)}</h2>
                    <p className="text-sm text-[#1E1B4B]/60">{pick(course.subject, course.subjectBn)}</p>
                  </div>
                  {course.isFull ? (
                    <span className="shrink-0 bg-[#F5C518] text-[#1E1B4B] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {pick('Full', 'আসন পূর্ণ')}
                    </span>
                  ) : (
                    <span className="shrink-0 bg-[#F5EDD8] text-[#1E1B4B] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {bangla ? `${num(seatsLeft)}টি আসন খালি` : `${seatsLeft} seats left`}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="text-sm text-[#1E1B4B]/70 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <FiUser className="shrink-0 text-[#1E1B4B]/40" />
                    {pick(course.teacherName, course.teacherNameBn)}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiCalendar className="shrink-0 text-[#1E1B4B]/40" />
                    {pick(course.days, course.daysBn)} · {pick(course.time, course.timeBn)}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiUsers className="shrink-0 text-[#1E1B4B]/40" />
                    {bangla
                      ? `সর্বোচ্চ ${num(course.batchSize)} জন শিক্ষার্থী · ${num(course.enrolledCount)} জন ভর্তি`
                      : `${course.batchSize} learners max · ${course.enrolledCount} enrolled`}
                  </p>
                </div>

                {/* Fee */}
                <div>
                  <p className="text-2xl font-bold text-[#1E1B4B]">
                    ৳{num(course.monthlyFee)}{' '}
                    <span className="text-sm font-normal text-[#1E1B4B]/50">
                      {pick('/ month', '/ মাস')}
                    </span>
                  </p>
                  <p className="text-xs text-[#1E1B4B]/40 mt-0.5">
                    {bangla
                      ? `+ একবারের ভর্তি ফি ৳${num(500)} · অনুরোধে ডেমো ক্লাস।`
                      : '+ ৳500 one-time admission · Demo class on request.'}
                  </p>
                </div>

                {/* Actions */}
                <div
                  className="grid grid-cols-2 gap-3 mt-auto"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <a
                    href={site.tel}
                    className="flex items-center justify-center gap-2 border border-[#E8DCC8] text-[#1E1B4B] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1E1B4B] hover:text-[#FFFFFF] transition-colors"
                  >
                    {pick('Call', 'কল করুন')} <FiPhone />
                  </a>
                  {course.isFull ? (
                    <span className="flex items-center justify-center rounded-xl bg-[#E8DCC8] py-2.5 text-center text-sm font-semibold text-[#1E1B4B]/55">
                      {pick('Batch full', 'ব্যাচ পূর্ণ')}
                    </span>
                  ) : (
                    <Link
                      href={course.batchId ? `/book?courseId=${encodeURIComponent(course.id)}&batchId=${encodeURIComponent(course.batchId)}` : '/contact'}
                      className="flex items-center justify-center gap-2 bg-[#F5C518] text-[#1E1B4B] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1E1B4B] hover:text-[#FFFFFF]  transition-colors"
                    >
                      {pick(course.batchId ? 'Book seat' : 'Enquire', course.batchId ? 'আসন বুক করুন' : 'যোগাযোগ করুন')} <FiArrowUpRight />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-[#1E1B4B]/40 text-center mt-8">
          {pick(
            'All fees are in Bangladeshi taka (BDT). Seat availability and timetables are indicative and may change. A place is confirmed only after you have spoken with the center.',
            'সব ফি বাংলাদেশি টাকায় (BDT)। আসন সংখ্যা ও সময়সূচি আনুমানিক এবং পরিবর্তন হতে পারে। কেন্দ্রের সাথে কথা বলার পরই আপনার আসন নিশ্চিত হবে।'
          )}
        </p>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="bg-[#F5C518] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1B4B]/60 mb-3">
              {pick('Next chapter', 'পরবর্তী ধাপ')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B4B] mb-3">
              {pick(
                'Not sure which batch is right?',
                'কোন ব্যাচ উপযোগী, তা নিয়ে দ্বিধায় আছেন?'
              )}
            </h2>
            <p className="text-[#1E1B4B]/70 text-sm max-w-xl">
              {pick(
                'Give us a call or visit us.',
                'আমাদের সরাসরি কল করুন অথবা কোচিং সেন্টার ভিজিট করুন।'
              )}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#1E1B4B] text-[#FFFFFF] font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-[#1E1B4B] transition-colors text-sm"
            >
              {pick('Book a demo class', 'ডেমো ক্লাস বুক করুন')} <FiArrowUpRight />
            </Link>
            <a
              href={site.tel}
              className="flex items-center justify-center gap-2 bg-white text-[#1E1B4B] font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#1E1B4B] hover:text-[#FFFFFF] transition-colors"
            >
              {t('callUs')} <FiPhone />
            </a>
            <p className="text-xs text-[#1E1B4B]/60 text-center">
              {pick('Demo availability will be confirmed.', 'ডেমো ক্লাসের সময় জানানো হবে।')}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}