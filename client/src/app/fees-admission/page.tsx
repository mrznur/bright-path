"use client";

import Link from "next/link";
import { FiArrowUpRight, FiInfo } from "react-icons/fi";
import { BsCalculator } from "react-icons/bs";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

const admissionSteps = [
  {
    n: "01",
    title: "Talk to us",
    desc: "Students or parents can call or enquire with the class, subject and preferred time.",
  },
  {
    n: "02",
    title: "Meet & try",
    desc: "Visit the center and request a suitable demo class. Ask about safety arrangements.",
  },
  {
    n: "03",
    title: "Choose a batch",
    desc: "Confirm the teacher, seats, schedule and complete fee breakdown.",
  },
  {
    n: "04",
    title: "Join with confidence",
    desc: "Submit student and parent details, pay confirmed fees and collect a receipt and timetable.",
  },
];

export default function FeesAdmissionPage() {
  const { language } = useLanguage();
  const { courses, site } = useContent();
  const bn = language === "bn";
  const feeRows = courses
    .filter((course, index, list) => list.findIndex((item) => item.level === course.level && item.classes === course.classes) === index)
    .map((course) => ({
      level: course.level.toUpperCase(),
      course: `${course.classes} · ${course.subject}`,
      courseBn: `${course.classesBn || course.classes} · ${course.subjectBn || course.subject}`,
      fee: course.monthlyFee,
    }));

  const banglaLevels: Record<string, string> = {
    PRIMARY: "প্রাথমিক",
    JUNIOR: "জুনিয়র",
    JSC: "জেএসসি",
    SSC: "এসএসসি",
    HSC: "এইচএসসি",
  };

  const banglaSteps = [
    {
      title: "যোগাযোগ করুন",
      desc: "শিক্ষার্থী বা অভিভাবক হিসেবে শ্রেণি, বিষয় এবং পছন্দের সময় জানিয়ে আমাদের সঙ্গে যোগাযোগ করুন।",
    },
    {
      title: "দেখুন ও যাচাই করুন",
      desc: "সেন্টার পরিদর্শন করুন এবং উপযুক্ত একটি ডেমো ক্লাসের জন্য অনুরোধ করুন। নিরাপত্তার ব্যবস্থাও জেনে নিন।",
    },
    {
      title: "ব্যাচ নির্বাচন করুন",
      desc: "শিক্ষক, আসনসংখ্যা, সময়সূচি এবং সম্পূর্ণ ফি সম্পর্কে নিশ্চিত হয়ে নিন।",
    },
    {
      title: "নিশ্চিন্তে ভর্তি হোন",
      desc: "শিক্ষার্থী ও অভিভাবকের তথ্য জমা দিন, নির্ধারিত ফি পরিশোধ করুন এবং রসিদ ও ক্লাসের সময়সূচি সংগ্রহ করুন।",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {bn ? "শুরু হোক স্বচ্ছতায়" : "A clear start"}
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] mb-3">
          {bn ? (
            <>
              সহজ ফি।
              <br />
              শিক্ষার্থী ও অভিভাবকদের জন্য সম্পূর্ণ স্বচ্ছতা।
            </>
          ) : (
            <>
              Simple fees.
              <br />
              Clear information for students and parents.
            </>
          )}
        </h1>

        <p className="text-[#1E1B4B]/60 max-w-xl mb-6">
          {bn
            ? "কত টাকা দিতে হবে, কী কী সুবিধা অন্তর্ভুক্ত রয়েছে এবং কীভাবে ভর্তি হবেন - সবকিছু জেনে নিন। নিচের প্রতিটি ফি নমুনা কোর্স অনুযায়ী নির্ধারিত।"
            : "See what you'll pay, what's included and how to join. Every amount below is sample pricing in BDT, consistent with our sample courses."}
        </p>

        <div className="flex items-start gap-2 bg-[#F5EDD8] border border-[#E8DCC8] rounded-xl px-4 py-3 text-xs text-[#1E1B4B]/60 max-w-2xl">
          <FiInfo className="mt-0.5 shrink-0 text-[#1E1B4B]/40" />
          <span>
            {bn
              ? "ভর্তির আগে যোগাযোগের তথ্য ও অন্যান্য বিষয় নিশ্চিত করে নিন।"
              : "Contact details and other information must be confirmed before admission."}
          </span>
        </div>
      </section>

      {/* 01 Monthly fees table */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-[#F5C518] rounded-full" />
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518]">
              {bn ? "০১ / মাসিক ফি" : "01 / Monthly fees"}
            </p>
            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {bn
                ? "প্রয়োজন অনুযায়ী পড়াশোনার সহায়তা বেছে নিন।"
                : "Choose the support they need."}
            </h2>
          </div>
        </div>

        <p className="text-[#1E1B4B]/60 text-sm mb-6 ml-4">
          {bn
            ? "মাসিক ফি প্রতি শিক্ষার্থীর জন্য নির্ধারিত। প্রাথমিক স্তরে উল্লেখিত তিনটি বিষয় অন্তর্ভুক্ত রয়েছে; অন্যান্য কোর্সের ফি প্রতি বিষয় অনুযায়ী।"
            : "Monthly fees are per student, per listed course. Primary foundations includes the three named subjects; other courses are per subject."}
        </p>

        <div className="overflow-x-auto rounded-2xl border border-[#E8DCC8]">
          <table className="w-full min-w-[32rem] text-sm">
            <thead>
              <tr className="bg-[#1E1B4B] text-white text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold w-24">
                  {bn ? "স্তর" : "Level"}
                </th>
                <th className="text-left px-5 py-3 font-semibold">
                  {bn ? "কোর্স" : "Course"}
                </th>
                <th className="text-right px-5 py-3 font-semibold">
                  {bn ? "মাসিক ফি" : "Monthly fee"}
                </th>
              </tr>
            </thead>

            <tbody>
              {feeRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-[#E8DCC8] bg-white hover:bg-[#FAFAF8]"
                >
                  <td className="px-5 py-4 font-semibold text-[#1E1B4B] text-xs">
                    {bn ? banglaLevels[row.level] : row.level}
                  </td>
                  <td className="px-5 py-4 text-[#1E1B4B]/70">
                    {bn ? row.courseBn : row.course}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-[#1E1B4B]">
                    ৳{row.fee.toLocaleString("en-US")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[#1E1B4B]/40 mt-3">
          {bn
            ? "নিয়মিত পাঠদান, নির্দেশিত অনুশীলন এবং নমুনা অগ্রগতি মূল্যায়ন অন্তর্ভুক্ত। প্রয়োজন হলে অতিরিক্ত বই বা শিক্ষা উপকরণের মূল্য কেনার আগে আলাদাভাবে জানিয়ে দেওয়া হবে।"
            : "Includes regular lessons, guided practice and sample progress assessments. Extra books or optional materials, if needed, should be quoted separately before purchase."}
        </p>
      </section>

      {/* 3 highlight cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-[#E8DCC8] rounded-2xl p-6 hover:shadow-lg">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1B4B]/40 mb-2">
              {bn ? "এককালীন ভর্তি ফি" : "One-time admission"}
            </p>
            <p className="text-4xl font-bold text-[#1E1B4B] mb-3">৳500</p>
            <p className="text-sm text-[#1E1B4B]/60">
              {bn
                ? "ভর্তির সময় প্রতি শিক্ষার্থীর জন্য একবার দিতে হবে। প্রতিটি বিষয়ের জন্য আলাদা করে দিতে হবে না। ভবিষ্যতে পুনরায় ভর্তির কোনো নিয়ম থাকলে তা নিশ্চিত করে জেনে নিন।"
                : "Pay once per student when joining. Not charged again for each subject. Any future re-admission policy must be confirmed."}
            </p>
          </div>

          <div className="bg-[#F5C518] rounded-2xl p-6 hover:shadow-lg">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1B4B]/50 mb-2">
              {bn
                ? "ভাই-বোনদের জন্য বিশেষ সুবিধা"
                : "A little help for siblings"}
            </p>
            <p className="text-4xl font-bold text-[#1E1B4B] mb-3">
              {bn ? "১০% ছাড়" : "10% off"}
            </p>
            <p className="text-sm text-[#1E1B4B]/70">
              {bn
                ? "দ্বিতীয় সন্তানের মাসিক কোর্স ফিতে ১০% ছাড়। ভর্তি ফি এর অন্তর্ভুক্ত নয় এবং অন্য কোনো অফারের সঙ্গে একত্রে প্রযোজ্য নয়।"
                : "Discount on the second child's monthly course fees. Admission fees are excluded; no stacking with other offers."}
            </p>
          </div>

          <div className="bg-white border border-[#E8DCC8] rounded-2xl p-6 hover:shadow-lg">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1B4B]/40 mb-2">
              {bn ? "ভর্তির আগে যাচাই করে নিন" : "Try before you decide"}
            </p>
            <p className="text-4xl font-bold text-[#1E1B4B] mb-3">
              {bn ? "১টি ডেমো ক্লাস" : "1 demo class"}
            </p>
            <p className="text-sm text-[#1E1B4B]/60">
              {bn
                ? "উপযুক্ত ব্যাচে আসন ও শিক্ষকের সময়সাপেক্ষে বিনামূল্যে একটি ডেমো ক্লাসের অনুরোধ করতে পারেন। ডেমো ক্লাসের জন্য কোনো ফি নেই।"
                : "Request one no-obligation demo for a suitable batch, subject to a seat and teacher availability. No demo fee required."}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 bg-[#F5EDD8] border border-[#E8DCC8] rounded-xl px-4 py-3 text-xs text-[#1E1B4B]/70 max-w-2xl">
          <BsCalculator className="mt-0.5 shrink-0 text-[#1E1B4B]/40" />
          <span>
            {bn
              ? "উদাহরণ: দ্বিতীয় সন্তানের এসএসসি গণিতের মাসিক ফি ৳২,২০০ হলে ১০% ছাড়ের পর দিতে হবে ৳১,৯৮০। ভর্তি ফিসহ প্রথম মাসের মোট খরচ হবে ৳২,৪৮০।"
              : "Example: a second child's SSC Maths fee of ৳2,200 becomes ৳1,980 per month. First month with admission: ৳2,480."}
          </span>
        </div>
      </section>

      {/* 02 Admission steps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-[#F5C518] rounded-full" />
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518]">
              {bn
                ? "০২ / ভর্তি প্রক্রিয়া"
                : "02 / Admission, without the rush"}
            </p>
            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {bn
                ? "ভর্তি হতে চারটি সহজ ধাপ।"
                : "Four small steps to get started."}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {admissionSteps.map((step, i) => (
            <div key={step.n} className="flex flex-col gap-2 border rounded-xl py-6 hover:shadow-lg bg-white hover:bg-[#FAFAF8] px-8">
              <p className="text-3xl font-bold text-[#F5C518]">{step.n}</p>
              <h3 className="font-bold text-[#1E1B4B]">
                {bn ? banglaSteps[i].title : step.title}
              </h3>
              <p className="text-sm text-[#1E1B4B]/60">
                {bn ? banglaSteps[i].desc : step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 03 Payment methods */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-[#F5C518] rounded-full" />
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518]">
                {bn ? "০৩ / পেমেন্ট ব্যবস্থা" : "03 / Payment made clear"}
              </p>
              <h2 className="text-2xl font-bold text-[#1E1B4B]">
                {bn
                  ? "আপনার সুবিধামতো ফি পরিশোধ করুন।"
                  : "Choose a convenient way to pay."}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {["Cash", "bKash", "Nagad", "Bank"].map((method) => (
              <span
                key={method}
                className="bg-[#F5EDD8] text-[#1E1B4B] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#E8DCC8]"
              >
                {method === "Cash" && bn
                  ? "নগদ"
                  : method === "Bank" && bn
                    ? "ব্যাংক"
                    : method}
              </span>
            ))}
          </div>

          <p className="text-sm text-[#1E1B4B]/60">
            {bn
              ? "গ্রহণযোগ্য পেমেন্ট পদ্ধতিগুলো দেখানো হয়েছে। BrightPath-এর অফিসিয়াল অ্যাকাউন্টের তথ্য সরাসরি নিশ্চিত করে নিন। এই ওয়েবসাইটে কোনো পেমেন্ট গ্রহণ করা হয় না।"
              : "Accepted methods are shown. Confirm the official account details directly with BrightPath. This website does not collect payments."}
          </p>
        </div>

        <div className="bg-[#F5EDD8] rounded-2xl p-6">
          <h3 className="font-bold text-[#1E1B4B] mb-3">
            {bn ? "পেমেন্টের আগে জেনে নিন" : "Before you pay"}
          </h3>
          <p className="text-sm text-[#1E1B4B]/60 mb-4">
            {bn
              ? "প্রতি মাসের ১০ তারিখের মধ্যে ফি পরিশোধের সময়সীমা নির্ধারণ করা হয়েছে। পেমেন্টের পর অবশ্যই রসিদ সংগ্রহ করুন। ভর্তি হওয়ার আগে অনুপস্থিত ক্লাস, ভর্তি বাতিল এবং টাকা ফেরতের নিয়ম সম্পর্কে জেনে নিন।"
              : "Due date: By the 10th of each month. Always request for a receipt. Ask about missed-class, withdrawal and refund terms before admission."}
          </p>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 border border-[#E8DCC8] bg-white text-[#1E1B4B] text-sm font-semibold py-3 rounded-xl hover:bg-[#1E1B4B] hover:text-white transition-colors"
          >
            {bn ? "ভর্তি সম্পর্কে জানুন" : "Ask about admission"}{" "}
            <FiArrowUpRight />
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F5C518] py-2 md:py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1B4B]/50 mb-1">
              {bn ? "শিক্ষার্থী ও অভিভাবকের নতুন অধ্যায়" : "The next chapter for students and parents"}
            </p>
            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {bn
                ? "ডেমো ক্লাসে আসুন, পরিষ্কার ধারণা নিয়ে ফিরুন।"
                : "Come for a demo. Leave with clarity."}
            </h2>
            <p className="text-[#1E1B4B]/60 text-sm mt-1">
              {bn
                ? "শিক্ষার্থী সম্পর্কে আমাদের জানান। শিক্ষার্থী ও অভিভাবককে উপযুক্ত ব্যাচ নির্বাচন এবং ডেমো ক্লাসের ব্যবস্থা করতে আমরা সহায়তা করব।"
                :                 "Tell us about the student. We'll help students and parents choose a batch and arrange a demo class."}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#1E1B4B] text-white font-semibold px-6 py-3 rounded-full  hover:text-[#1E1B4B] hover:bg-white transition-colors text-sm shadow-sm hover:shadow-md"
            >
              {bn ? "ডেমো ক্লাস বুক করুন" : "Book a demo class"}{" "}
              <FiArrowUpRight />
            </Link>

            <a
              href={site.tel}
              className="flex items-center justify-center gap-2 bg-white text-[#1E1B4B] font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#1E1B4B] hover:text-white transition-colors"
            >
              {bn ? "কল করুন" : "Call us"}
            </a>

            <p className="text-xs text-[#1E1B4B]/40 text-center">
              {bn
                ? "ডেমো ক্লাসের সময়সূচি নিশ্চিত করে নিন।"
                : "Demo availability is to be confirmed."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
