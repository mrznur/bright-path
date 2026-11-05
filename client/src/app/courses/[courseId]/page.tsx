'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiArrowUpRight, FiCalendar, FiPhone, FiUser, FiUsers } from 'react-icons/fi';
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
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
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
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]/60 hover:text-[#1E1B4B]">
          <FiArrowLeft /> {pick('All courses', 'সব কোর্স')}
        </Link>
        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
            {pick(course.level, course.levelBn)} · {pick(course.classes, course.classesBn)}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E1B4B] leading-tight">
            {pick(course.title, course.titleBn)}
          </h1>
          <p className="text-lg text-[#1E1B4B]/60 mt-3">{pick(course.subject, course.subjectBn)}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white border border-[#E8DCC8] rounded-2xl p-6 sm:p-8 hover:shadow-lg">
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">
                {pick('About this course', 'এই কোর্স সম্পর্কে')}
              </h2>
              <p className="text-[#1E1B4B]/70 leading-7">{pick(course.description, course.descriptionBn)}</p>
            </div>
            <div className="bg-[#F5EDD8] rounded-2xl p-6 sm:p-8 hover:shadow-lg">
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4">
                {pick('What you will get', 'আপনি যা পাবেন')}
              </h2>
              <ul className="space-y-3 text-[#1E1B4B]/75">
                <li>✓ {pick('Small-group guided learning', 'ছোট গ্রুপে নির্দেশিত শিক্ষা')}</li>
                <li>✓ {pick('Regular practice and feedback', 'নিয়মিত অনুশীলন ও ফিডব্যাক')}</li>
                <li>✓ {pick('Support aligned with the school syllabus', 'স্কুলের সিলেবাস অনুযায়ী সহায়তা')}</li>
              </ul>
            </div>
          </div>

          <aside className="bg-white border border-[#E8DCC8] rounded-2xl p-6 lg:sticky lg:top-24 hover:shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-5">
              <p className="text-3xl font-bold text-[#1E1B4B]">৳{num(course.monthlyFee)}</p>
              <span className="text-sm text-[#1E1B4B]/50">{pick('/ month', '/ মাস')}</span>
            </div>
            <div className="space-y-3 text-sm text-[#1E1B4B]/70 pb-5 border-b border-[#E8DCC8]">
              <p className="flex items-center gap-2"><FiUser /> {pick(course.teacherName, course.teacherNameBn)}</p>
              <p className="flex items-center gap-2"><FiCalendar /> {pick(course.days, course.daysBn)} · {pick(course.time, course.timeBn)}</p>
              <p className="flex items-center gap-2"><FiUsers /> {course.isFull ? pick('Batch full', 'ব্যাচ পূর্ণ') : pick(`${num(seatsLeft)} seats left`, `${num(seatsLeft)}টি আসন খালি`)}</p>
            </div>
            <div className="grid gap-3 mt-5">
              {course.isFull ? (
                <span className="flex items-center justify-center rounded-full bg-[#E8DCC8] py-3 text-sm font-semibold text-[#1E1B4B]/55">
                  {pick('Batch full', 'ব্যাচ পূর্ণ')}
                </span>
              ) : (
                <Link href={bookingHref} className="flex items-center justify-center gap-2 bg-[#F5C518] text-[#1E1B4B] font-semibold py-3 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors">
                  {pick(course.batchId ? 'Book a seat' : 'Ask about this course', course.batchId ? 'আসন বুক করুন' : 'এই কোর্স সম্পর্কে জিজ্ঞাসা করুন')} <FiArrowUpRight />
                </Link>
              )}
              <a href={site.tel} className="flex items-center justify-center gap-2 border border-[#E8DCC8] text-[#1E1B4B] font-semibold py-3 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors">
                {t('callUs')} <FiPhone />
              </a>
            </div>
            <p className="text-xs text-[#1E1B4B]/45 text-center mt-4">
              {pick('+ ৳500 one-time admission fee. Demo class on request.', '+ একবারের ভর্তি ফি ৳৫০০। অনুরোধে ডেমো ক্লাস।')}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
