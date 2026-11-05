"use client";

import Link from "next/link";
import Image from "next/image";
import { FiPhone, FiArrowRight } from "react-icons/fi";
import {
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

export default function HomePage() {
  const { language, t } = useLanguage();
  const { courses, testimonials, site } = useContent();
  const featuredCourses = ["c1", "c2", "c3"]
    .map((id) => courses.find((course) => course.id === id))
    .filter((course): course is NonNullable<typeof course> => Boolean(course));
  const bangla = language === "bn";
  const lang = bangla ? "bn" : "en";

  // Pick the Bangla or English string
  const pick = (en: string, bn: string) => (bangla ? bn : en);
  // Use the Bangla string only when it exists, otherwise fall back to English
  const tr = (en: string, bn?: string) => (bangla && bn ? bn : en);
  // Numbers in Bangla digits when Bangla is selected
  const num = (x: number) => x.toLocaleString(bangla ? "bn-BD" : "en-US");

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
            {pick("BrightPath Coaching Center · Dhaka", "ব্রাইটপাথ কোচিং সেন্টার · ঢাকা")}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1E1B4B] leading-tight mb-4 sm:mb-5">
            {bangla ? (
              <>
                ছোট ছোট পদক্ষেপ।
                <br />
                দীর্ঘস্থায়ী
                <br />
                আত্মবিশ্বাস।
              </>
            ) : (
              <>
                Little steps.
                <br />
                Lasting
                <br />
                confidence.
              </>
            )}
          </h1>
          <p className="text-[#1E1B4B]/60 text-base sm:text-lg mb-6 sm:mb-8 max-w-md">
            {pick(
              "The right teaching method, qualified teachers, and personal attention for every student.",
              "সঠিক পদ্ধতির শিক্ষা, যোগ্যতাসম্পন্ন শিক্ষক এবং প্রয়োজন অনুযায়ী প্রত্যেক শিক্ষার্থীর জন্য আলাদা পাঠদান।",
            )}
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-6 sm:mb-8">
            <Link
              href="/courses"
              className="flex items-center justify-center gap-2 bg-[#F5C518] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full hover:bg-[#1E1B4B] hover:text-[#FFFFFF] transition-colors"
            >
              {t("findCourse")} <FiArrowRight />
            </Link>
            <a
              href={site.tel}
              className="flex items-center justify-center gap-2 border border-[#1E1B4B] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors"
            >
              {t("callUs")} <FiPhone />
            </a>
          </div>
          <p className="text-sm text-[#1E1B4B]/40">
            {pick(
              "Providing quality education in Dhaka for 6 years.",
              "৬ বছর ধরে ঢাকায় আমরা মানসম্মত শিক্ষা প্রদান করছি।",
            )}
          </p>
        </div>

        {/* Hero image */}
        <div className="min-w-0 w-full rounded-2xl overflow-hidden bg-[#E8D5B7]">
          <div className="relative w-full aspect-[4/3]">
            <Image
              src="/teacher-student-hero.jpg"
              alt={pick(
                "Teacher helping a student",
                "একজন শিক্ষক শিক্ষার্থীকে সাহায্য করছেন",
              )}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="bg-[#F5C518] text-[#1E1B4B] text-xs sm:text-sm font-semibold text-center px-4 py-2">
            {pick("Every question matters.", "প্রতিটি প্রশ্নই গুরুত্বপূর্ণ।")}
          </div>
        </div>
      </section>

      {/* Tagline bar */}
      <div className="bg-[#F5C518] text-[#1E1B4B] text-center text-xs sm:text-sm font-medium py-3 px-4">
        {pick(
          "Students and parents are welcome. Please ask us anything.",
          "শিক্ষার্থী ও অভিভাবক, সবাইকে স্বাগতম। যেকোনো প্রশ্ন থাকলে সরাসরি আমাদের জিজ্ঞাসা করুন।",
        )}
      </div>

      {/* ── 01 Levels ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick("01 / Find your next step", "০১ / আপনার পরবর্তী ধাপ খুঁজে নিন")}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B4B] mb-3">
          {pick("Choose the right course", "সঠিক কোর্স নির্বাচন করুন")}
        </h2>
        <p className="text-[#1E1B4B]/60 mb-8 sm:mb-10 max-w-xl">
          {pick(
            "Choose the course that matches the class level.",
            "শ্রেণি অনুযায়ী সঠিক কোর্স বেছে নিন।",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            {
              level: { en: "Primary", bn: "প্রাথমিক" },
              classes: { en: "Classes 3–5", bn: "তৃতীয়–পঞ্চম শ্রেণি" },
              desc: {
                en: "Builds confidence in Bangla, English and mathematics.",
                bn: "বাংলা, ইংরেজি ও গণিতে আত্মবিশ্বাস গড়ে তোলে।",
              },
              href: "/courses?level=Primary",
            },
            {
              level: { en: "Junior", bn: "জুনিয়র" },
              classes: { en: "Classes 6–7", bn: "ষষ্ঠ–সপ্তম শ্রেণি" },
              desc: {
                en: "Active preparation for beginning of high school education.",
                bn: "হাই স্কুলের শুরু থেকেই ভালোভাবে সব বিষয় আয়ত্ত করার জন্য জন্য আদর্শ প্রস্তুতি।",
              },
              href: "/courses?level=Junior",
            },
            {
              level: { en: "JSC", bn: "জেএসসি" },
              classes: { en: "Class 8", bn: "অষ্টম শ্রেণি" },
              desc: {
                en: "Focused support for the Class 8 JSC track.",
                bn: "অষ্টম শ্রেণির জেএসসি ধারার জন্য বিশেষ সহায়তা।",
              },
              href: "/courses?level=JSC",
            },
            {
              level: { en: "SSC", bn: "এসএসসি" },
              classes: { en: "Classes 9–10", bn: "নবম–দশম শ্রেণি" },
              desc: {
                en: "Subjects and steady exam preparation.",
                bn: "বিষয়ভিত্তিক পাঠ ও ধারাবাহিক পরীক্ষার প্রস্তুতি।",
              },
              href: "/courses?level=SSC",
            },
            {
              level: { en: "HSC", bn: "এইচএসসি" },
              classes: { en: "Classes 11–12", bn: "একাদশ–দ্বাদশ শ্রেণি" },
              desc: {
                en: "Focused HSC preparation that gets students ready for university.",
                bn: "এইচএসসির জন্য মনোযোগী প্রস্তুতি, যা প্রতিটি শিক্ষার্থীকে বিশ্ববিদ্যালয়ের জন্য তৈরি করে।",
              },
              href: "/courses?level=HSC",
            },
          ].map((item) => (
            <div
              key={item.href}
              className="bg-white border border-[#E8DCC8] rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <p className="text-xs text-[#1E1B4B]/40 uppercase tracking-wider">
                {item.classes[lang]}
              </p>
              <h3 className="text-xl font-bold text-[#1E1B4B]">
                {item.level[lang]}
              </h3>
              <p className="text-sm text-[#1E1B4B]/60 flex-1">
                {item.desc[lang]}
              </p>
              <Link
                href={item.href}
                className="flex items-center gap-1 text-sm font-semibold text-[#F5C518] hover:underline"
              >
                {pick("Explore courses", "কোর্স দেখুন")}{" "}
                <FiArrowRight className="text-xs" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 02 Why BrightPath ──────────────────────────────────────────── */}
      <section className="bg-[#1E1B4B] text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
            {pick(
              "02 / Why BrightPath Coaching Center",
              "০২ / কেন ব্রাইটপাথ কোচিং সেন্টার",
            )}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">
            {pick("More attention, less pressure.", "বেশি মনোযোগ, কম চাপ।")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <HiOutlineAcademicCap className="text-2xl text-[#F5C518]" />
                ),
                title: {
                  en: "Qualified teachers",
                  bn: "যোগ্যতাসম্পন্ন শিক্ষক",
                },
                desc: {
                  en: 'Subject-focused teaching that explains the "why", not just the answer. Meet our team and discuss qualifications before admission.',
                  bn: 'বিষয়ভিত্তিক পাঠদান, যেখানে শুধু উত্তর নয়, "কেন" তাও ব্যাখ্যা করা হয়। ভর্তির আগে আমাদের শিক্ষকদের সাথে দেখা করে তাঁদের যোগ্যতা সম্পর্কে জেনে নিন।',
                },
              },
              {
                icon: (
                  <HiOutlineShieldCheck className="text-2xl text-[#F5C518]" />
                ),
                title: { en: "A safe environment", bn: "নিরাপদ পরিবেশ" },
                desc: {
                  en: "A place where a student feels comfortable and parents feel at ease. A safe place for both boys and girls.",
                  bn: "এমন একটি জায়গা, যেখানে একজন শিক্ষার্থী স্বাচ্ছন্দ্যে শেখে আর অভিভাবক নিশ্চিন্ত থাকেন। ছেলে-মেয়ে, উভয়ের জন্যই নিরাপদ পরিবেশ।",
                },
              },
              {
                icon: (
                  <HiOutlineUserGroup className="text-2xl text-[#F5C518]" />
                ),
                title: { en: "Small batches", bn: "ছোট ব্যাচ" },
                desc: {
                  en: "Each batch has 12–18 students at most, so every student can ask questions and get personal feedback from the teacher.",
                  bn: "প্রতিটি ব্যাচে সর্বোচ্চ ১২–১৮ জন শিক্ষার্থী থাকে। তাই প্রত্যেক শিক্ষার্থী নির্ভয়ে প্রশ্ন করতে পারে এবং শিক্ষকের কাছ থেকে আলাদা করে পরামর্শ পায়।",
                },
              },
            ].map((item) => (
              <div
                key={item.title.en}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#F5C518]/10">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold">{item.title[lang]}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 Courses ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick("03 / Look into a course", "০৩ / কোর্স দেখুন")}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B4B] mb-3">
          {pick(
            "Find a course that fits you or your child.",
            "আপনার বা আপনার সন্তানের জন্য উপযোগী কোর্স খুঁজুন।",
          )}
        </h2>
        <p className="text-[#1E1B4B]/60 mb-8 sm:mb-10 max-w-xl">
          {pick(
            "Students and parents can find full schedules, subjects and availability on the Courses page.",
            "প্রতিটি কোর্সের সময়সূচি, বিষয় ও সিটের তথ্য কোর্স পেজে আছে।",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-[#E8DCC8] rounded-2xl p-5 flex flex-col gap-3"
            >
              <div>
                <p className="text-xs text-[#1E1B4B]/40 uppercase tracking-wider">
                  {pick(course.level, course.levelBn)} ·{" "}
                  {pick(course.classes, course.classesBn)}
                </p>
                <h3 className="text-lg font-bold text-[#1E1B4B] mt-1">
                  {pick(course.title, course.titleBn)}
                </h3>
                <p className="text-sm text-[#1E1B4B]/60">
                  {pick(course.subject, course.subjectBn)}
                </p>
              </div>
              <div className="text-sm text-[#1E1B4B]/70 space-y-1">
                <p>{pick(course.teacherName, course.teacherNameBn)}</p>
                <p>
                  {pick(course.days, course.daysBn)} ·{" "}
                  {pick(course.time, course.timeBn)}
                </p>
                <p>
                  {bangla
                    ? `সর্বোচ্চ ${num(course.batchSize)} জন শিক্ষার্থী · ${num(course.enrolledCount)} জন ভর্তি`
                    : `${course.batchSize} learners max · ${course.enrolledCount} enrolled`}
                </p>
              </div>
              <p className="text-2xl font-bold text-[#1E1B4B]">
                ৳{num(course.monthlyFee)}{" "}
                <span className="text-sm font-normal text-[#1E1B4B]/50">
                  {pick("/ month", "/ মাস")}
                </span>
              </p>
              <p className="text-xs text-[#1E1B4B]/40">
                {bangla
                  ? `+ একবারের ভর্তি ফি ৳${num(500)} · অনুরোধে ডেমো ক্লাস।`
                  : "+ ৳500 one-time admission · Demo class on request."}
              </p>
              <Link
                href={`/courses/${course.id}`}
                className="flex items-center justify-center gap-1 text-sm font-semibold text-[#1E1B4B] border border-[#E8DCC8] rounded-xl px-4 py-2 hover:bg-[#F5EDD8] transition-colors"
              >
                {pick("View batch details", "ব্যাচের বিস্তারিত দেখুন")}{" "}
                <FiArrowRight className="text-xs" />
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 bg-[#F5C518] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full hover:bg-[#1E1B4B] hover:text-[#FFFFFF] transition-colors text-sm shadow-sm hover:shadow-md"
          >
            {pick("See all courses", "সব কোর্স দেখুন")} <FiArrowRight />
          </Link>
          <Link
            href="/fees-admission"
            className="text-center border border-[#1E1B4B] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors text-sm"
          >
            {pick(
              "Fees & schedule · confirm before joining",
              "ফি ও সময়সূচি · ভর্তির আগে নিশ্চিত করুন",
            )}
          </Link>
        </div>
      </section>

      {/* ── 04 Learning rhythm ─────────────────────────────────────────── */}
      <section className="bg-[#1E1B4B] text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
            {pick("04 / Our learning rhythm", "০৪ / আমাদের শেখানোর পদ্ধতি")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">
            {pick(
              "Understand today, feel ready tomorrow.",
              "আজ বুঝুন, আগামীকালের জন্য প্রস্তুত থাকুন।",
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                n: { en: "01", bn: "০১" },
                title: { en: "Learn", bn: "শেখা" },
                desc: {
                  en: "Clear explanations linked to every student's school syllabus.",
                  bn: "প্রতি শিক্ষার্থীর স্কুলের সিলেবাসের সাথে মিলিয়ে সহজ ও স্পষ্ট ব্যাখ্যা।",
                },
              },
              {
                n: { en: "02", bn: "০২" },
                title: { en: "Practise", bn: "অনুশীলন" },
                desc: {
                  en: "Guided exercises, revision and time to ask questions.",
                  bn: "নির্দেশনাসহ অনুশীলন, রিভিশন এবং প্রশ্ন করার পর্যাপ্ত সময়।",
                },
              },
              {
                n: { en: "03", bn: "০৩" },
                title: { en: "Reflect", bn: "মূল্যায়ন" },
                desc: {
                  en:                   "Regular sample assessments, student feedback and conversations with parents.",
                    bn: "নিয়মিত নমুনা মূল্যায়ন, শিক্ষার্থীর মতামত এবং অভিভাবকদের সাথে আলোচনা।",
                },
              },
            ].map((step) => (
              <div
                key={step.n.en}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/10 transition-colors"
              >
                <p className="text-4xl font-bold text-[#Fffffa]/40">
                  {step.n[lang]}
                </p>
                <h3 className="text-lg font-bold">{step.title[lang]}</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.desc[lang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Testimonials ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick("05 / Student & parent perspective", "০৫ / শিক্ষার্থী ও অভিভাবকদের কথা")}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B4B] mb-3">
          {pick(
            "Confidence you notice at home.",
            "যে আত্মবিশ্বাস আপনি ঘরেই টের পাবেন।",
          )}
        </h2>
        <p className="text-[#1E1B4B]/50 text-sm mb-8 sm:mb-10 max-w-2xl">
          {pick(
            "Our respected parents' feedbacks.",
            "সম্মানিত অভিভাবকদের মতামত।",
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#F5EDD8] rounded-2xl p-5 flex flex-col gap-3"
            >
              <p className="text-xs text-[#1E1B4B]/40 uppercase tracking-wider">
                {pick("Feedback", "মতামত")}
              </p>
              <blockquote className="text-lg sm:text-xl font-semibold text-[#1E1B4B] leading-snug italic">
                &ldquo;{tr(item.quote, item.quoteBn)}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-[#1E1B4B]">
                  {tr(item.parentName, item.parentNameBn)}
                </p>
                <p className="text-xs text-[#1E1B4B]/50">
                  {tr(item.parentRole, item.parentRoleBn)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center border-t border-[#E8DCC8]">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
            {pick("Next chapter", "পরবর্তী করণীয়")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B4B] mb-3">
            {pick(
              "A good beginning starts with a conversation.",
              "পারস্পরিক আলাপের মাধ্যমে যেকোনো কাজ ভালোভাবে শুরু করা যায়।",
            )}
          </h2>
          <p className="text-[#1E1B4B]/60 text-sm">
            {pick(
              "Talk to us as a student or as a parent. We'll help you choose a batch and arrange a demo class.",
              "শিক্ষার্থী বা অভিভাবক হিসাবে আমাদের সাথে কথা বলুন। ব্যাচ বেছে নিতে এবং ডেমো ক্লাসের ব্যবস্থা করতে আমরা সাহায্য করব।",
            )}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 bg-[#F5C518] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full hover:bg-[#1E1B4B] hover:text-[#FFFFFF] transition-colors text-sm"
          >
            {pick("Book a demo class", "ডেমো ক্লাস বুক করুন")} <FiArrowRight />
          </Link>
          <a
            href={site.tel}
            className="flex items-center justify-center gap-2 border border-[#1E1B4B] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full hover:bg-[#1E1B4B] hover:text-white transition-colors text-sm"
          >
            {t("callUs")} <FiPhone />
          </a>
          <p className="text-xs text-[#1E1B4B]/40 text-left sm:text-right">
            {pick(
              "Demo availability will be confirmed.",
              "ডেমো ক্লাসের সময় জানানো হবে।",
            )}
          </p>
        </div>
      </section>
    </>
  );
}
