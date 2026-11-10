'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiArrowUpRight, FiCalendar, FiPhone, FiUser, FiUsers, FiBookOpen, FiCheckCircle, FiStar } from 'react-icons/fi';
import { useLanguage } from '@/components/LanguageProvider';
import { useContent } from '@/components/ContentProvider';

export default function CourseDetailsPage() {
  const { language, t } = useLanguage();
  const { courses, site } = useContent();
  const params = useParams<{ courseId: string }>();
  const bangla = language === 'bn';
  const course = courses.find((item) => item.id === params.courseId);

  const pick = (en: string, bn: string) => (bangla ? bn : en);
  const num = (value: number) => value.toLocaleString(bangla ? 'bn-BD' : 'en-US');

  if (!course) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick('Course not found', 'কোর্স খুঁজে পাওয়া যায়নি')}
        </p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">
          {pick('This course is no longer available.', 'এই কোর্সটি আর পাওয়া যাচ্ছে না।')}
        </h1>
        <Link href="/courses" className="inline-flex items-center gap-2 mt-6 bg-[#1E1B4B] text-white font-semibold px-5 py-3 rounded-full">
          <FiArrowLeft /> {pick('Back to courses', 'কোর্সসমূহে ফিরে যান')}
        </Link>
      </section>
    );
  }

  const seatsLeft = course.batchSize - course.enrolledCount;
  const bookingHref = course.batchId
    ? `/book?courseId=${encodeURIComponent(course.id)}&batchId=${encodeURIComponent(course.batchId)}`
    : '/contact';

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]/60 hover:text-[#F5C518] transition-colors">
          <FiArrowLeft /> {pick('All courses', 'সব কোর্স')}
        </Link>
        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
            {pick(course.level, course.levelBn)} · {pick(course.classes, course.classesBn)}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E1B4B] leading-tight">
            {pick(course.title, course.titleBn)}
          </h1>
          <p className="text-base text-[#1E1B4B]/65 mt-3">{pick(course.subject, course.subjectBn)}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── Left column: about + 4 feature cards ── */}
          <div className="flex flex-col gap-5">

            {/* About */}
            <div className="bg-white border border-[#E8DCC8] rounded-2xl p-6 sm:p-8 hover:shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#F5C518] mb-2">
                {pick('About this course', 'এই কোর্স সম্পর্কে')}
              </p>
              <p className="text-base text-[#1E1B4B]/65 leading-7">
                {pick(course.description, course.descriptionBn)}
              </p>
            </div>

            {/* 4 feature cards — 2×2 grid, equal height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {[
                {
                  icon: <FiUsers className="text-[#F5C518] text-xl" />,
                  title: { en: 'Small-group learning', bn: 'ছোট গ্রুপে শিক্ষা' },
                  desc: {
                    en: 'Max 12–18 students per batch so every learner receives individual attention.',
                    bn: 'প্রতি ব্যাচে সর্বোচ্চ ১২–১৮ জন, যাতে প্রত্যেকে আলাদা মনোযোগ পায়।',
                  },
                },
                {
                  icon: <FiBookOpen className="text-[#F5C518] text-xl" />,
                  title: { en: 'Syllabus aligned', bn: 'সিলেবাস অনুযায়ী' },
                  desc: {
                    en: "Lessons follow the student's school syllabus step by step.",
                    bn: 'পাঠ স্কুলের সিলেবাসের সাথে সামঞ্জস্য রেখে ধাপে ধাপে চলে।',
                  },
                },
                {
                  icon: <FiCheckCircle className="text-[#F5C518] text-xl" />,
                  title: { en: 'Practice & feedback', bn: 'অনুশীলন ও ফিডব্যাক' },
                  desc: {
                    en: 'Guided exercises and honest feedback after every session.',
                    bn: 'প্রতিটি ক্লাসের পর নির্দেশিত অনুশীলন ও সৎ মতামত।',
                  },
                },
                {
                  icon: <FiStar className="text-[#F5C518] text-xl" />,
                  title: { en: 'Demo class available', bn: 'ডেমো ক্লাস পাওয়া যায়' },
                  desc: {
                    en: 'Try a class before joining. No fee required for the demo.',
                    bn: 'ভর্তির আগে ক্লাস দেখুন। ডেমোর জন্য কোনো ফি নেই।',
                  },
                },
              ].map((item) => (
                <div
                  key={item.title.en}
                  className="bg-[#F5EDD8] rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-xl font-bold text-[#1E1B4B]">
                    {pick(item.title.en, item.title.bn)}
                  </p>
                  <p className="text-base text-[#1E1B4B]/65 leading-relaxed">
                    {pick(item.desc.en, item.desc.bn)}
                  </p>
                </div>
              ))}
            </div>

          </div>

          <aside className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden flex flex-col lg:sticky lg:top-24">

            {/* ── Fee header ── */}
            <div className="bg-[#1E1B4B] px-6 py-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-2">
                {pick('Monthly fee', 'মাসিক ফি')}
              </p>
              <p className="text-4xl font-bold text-white leading-none">
                ৳{num(course.monthlyFee)}
                <span className="text-base font-normal text-white/80 ml-2">{pick('/ month', '/ মাস')}</span>
              </p>
              <p className="text-sm text-white/60 mt-2">
                {pick('+ ৳500 one-time admission fee', '+ একবারের ভর্তি ফি ৳৫০০')}
              </p>
            </div>

            {/* ── Info table ── */}
            <div className="px-6 py-5 space-y-5">

              {/* Instructor */}
              <div className="flex gap-3">
                <FiUser className="mt-0.5 shrink-0 text-[#F5C518] text-base" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#1E1B4B]/70">
                    {pick('Course instructor', 'কোর্স শিক্ষক')}
                  </p>
                  <p className="text-base font-semibold text-[#1E1B4B] mt-1">
                    {pick(course.teacherName, course.teacherNameBn)}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E8DCC8]" />

              {/* Class days + time */}
              <div className="flex gap-3">
                <FiCalendar className="mt-0.5 shrink-0 text-[#F5C518] text-base" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#1E1B4B]/70">
                    {pick('Class days', 'ক্লাসের দিন')}
                  </p>
                  <p className="text-base font-semibold text-[#1E1B4B] mt-1">
                    {pick(course.days, course.daysBn)}
                  </p>
                  <p className="text-base text-[#1E1B4B]/65 mt-0.5">
                    {pick(course.time, course.timeBn)}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E8DCC8]" />

              {/* Total seats + available — side by side */}
              <div className="flex gap-3">
                <FiUsers className="mt-0.5 shrink-0 text-[#F5C518] text-base" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#1E1B4B]/70 mb-2">
                    {pick('Batch capacity', 'ব্যাচ ধারণক্ষমতা')}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F5EDD8] rounded-xl px-3 py-2.5 text-center">
                      <p className="text-2xl font-bold text-[#1E1B4B] leading-none">{num(course.batchSize)}</p>
                      <p className="text-xs font-semibold text-[#1E1B4B]/70 mt-1">{pick('Total seats', 'মোট আসন')}</p>
                    </div>
                    <div className={`rounded-xl px-3 py-2.5 text-center ${course.isFull ? 'bg-[#E8DCC8]' : 'bg-[#F5C518]/20'}`}>
                      <p className={`text-2xl font-bold leading-none ${course.isFull ? 'text-[#1E1B4B]/40' : 'text-[#1E1B4B]'}`}>
                        {course.isFull ? '0' : num(seatsLeft)}
                      </p>
                      <p className="text-xs text-[#1E1B4B]/70 font-semibold mt-1">{pick('Available', 'খালি আসন')}</p>
                    </div>
                  </div>

                  {/* Seat fill bar */}
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-[#E8DCC8] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${course.isFull ? 'bg-[#1E1B4B]/30' : 'bg-[#F5C518]'}`}
                        style={{ width: `${Math.min(100, (course.enrolledCount / course.batchSize) * 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-[#1E1B4B]/70 mt-1.5 text-right">
                      {course.isFull
                        ? pick('Batch is full', 'ব্যাচ পূর্ণ হয়ে গেছে')
                        : bangla
                          ? `${num(course.enrolledCount)} জন ভর্তি`
                          : `${course.enrolledCount} of ${course.batchSize} enrolled`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="px-6 pb-6 flex flex-col gap-3">
              {course.isFull ? (
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 bg-[#F5EDD8] text-[#1E1B4B] font-semibold py-3.5 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors text-base"
                >
                  {pick('Enquire about next batch', 'পরবর্তী ব্যাচ সম্পর্কে জিজ্ঞাসা করুন')} <FiArrowUpRight />
                </Link>
              ) : (
                <Link
                  href={bookingHref}
                  className="flex items-center justify-center gap-2 bg-[#F5C518] text-[#1E1B4B] font-semibold py-3.5 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors"
                >
                  {pick(course.batchId ? 'Book a seat' : 'Ask about this course', course.batchId ? 'আসন বুক করুন' : 'এই কোর্স সম্পর্কে জিজ্ঞাসা করুন')}
                  <FiArrowUpRight />
                </Link>
              )}
              <a
                href={site.tel}
                className="flex items-center justify-center gap-2 border border-[#E8DCC8] text-[#1E1B4B] font-semibold py-3.5 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors text-base"
              >
                {t('callUs')} <FiPhone />
              </a>
              <p className="text-sm text-[#1E1B4B]/60 text-center">
                {pick('Demo class available on request.', 'অনুরোধে ডেমো ক্লাস নেওয়া যাবে।')}
              </p>
            </div>

          </aside>
        </div>
      </section>
    </>
  );
}
