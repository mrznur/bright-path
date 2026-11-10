"use client";

import { useState } from "react";
import Link from "next/link";
import { FiPhone, FiArrowUpRight, FiPlus, FiMinus } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  bangla,
  showCoursesLink,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  bangla: boolean;
  showCoursesLink: boolean;
}) {
  return (
    <div className="border-b border-[#E8DCC8]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left gap-4 transition-colors hover:text-[#F5C518]"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[#1E1B4B] text-lg">
          {question}
        </span>
        {isOpen ? (
          <FiMinus className="shrink-0 text-[#F5C518] text-lg" />
        ) : (
          <FiPlus className="shrink-0 text-[#F5C518] text-lg" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-base text-[#1E1B4B]/70 leading-relaxed whitespace-pre-line">
          {answer}
          {showCoursesLink && (
            <p className="mt-3">
              <Link
                href="/courses"
                className="flex items-center gap-1 text-[#F5C518] font-semibold hover:underline w-fit"
              >
                {bangla ? "কোর্স খুঁজুন" : "Find a course"}{" "}
                <FiArrowUpRight className="text-xs" />
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const { language } = useLanguage();
  const { faqs, site } = useContent();
  const [openId, setOpenId] = useState<string>("faq1");
  const bangla = language === "bn";
  const pick = (en: string, bn: string) => (bangla ? bn : en);

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick(
            "The student & parent notebook",
            "শিক্ষার্থী ও অভিভাবকের সহায়িকা",
          )}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] mb-3">
          {pick("Good questions.", "ভালো প্রশ্ন।")}
          <br />
          {pick("Straightforward answers.", "সহজ উত্তর।")}
        </h1>
        <p className="text-base text-[#1E1B4B]/65 max-w-xl mb-6">
          {pick(
            "A little clarity before your first visit. Students and parents can start here for course choice, fees, teaching and the everyday details that matter to your family.",
            "প্রথমবার আসার আগে কিছুটা পরিষ্কার ধারণা নিন। কোর্স নির্বাচন, ফি, পড়াশোনা এবং আপনার পরিবারের জন্য গুরুত্বপূর্ণ দৈনন্দিন বিষয়গুলো এখান থেকে জানুন।",
          )}
        </p>
        <div className="flex items-start gap-2 bg-[#F5EDD8] border border-[#E8DCC8] rounded-xl px-4 py-3 text-sm text-[#1E1B4B]/60 max-w-2xl">
          <span className="mt-0.5 shrink-0 text-[#1E1B4B]/40">ℹ</span>
          <span>
            {pick(
              "Design demo: staff, photos, fees, hours, results and parent quotes are illustrative, not verified. Contact details and safety arrangements must be confirmed before admission.",
              "নমুনা তথ্য: শিক্ষক, ছবি, ফি, সময়সূচি, ফলাফল ও অভিভাবকদের মতামত যাচাই করা হয়নি। ভর্তির আগে যোগাযোগের তথ্য ও নিরাপত্তাব্যবস্থা নিশ্চিত করুন।",
            )}
          </span>
        </div>
      </section>

      {/* ── FAQ body ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-4 pt-2">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">
            {pick("Before you join", "ভর্তির আগে")}
          </p>
          <h2 className="text-2xl font-bold text-[#1E1B4B] leading-snug">
            {pick("Take your time.", "সময় নিয়ে ভাবুন।")}
            <br />
            {pick("Ask us anything.", "যেকোনো প্রশ্ন করুন।")}
          </h2>
          <p className="text-base text-[#1E1B4B]/60">
            {pick(
              "For details specific to the student, a quick conversation with the center is the best next step for students and parents.",
              "শিক্ষার্থী সম্পর্কে নির্দিষ্ট তথ্য জানতে কেন্দ্রের সঙ্গে দ্রুত কথা বলাই শিক্ষার্থী ও অভিভাবকদের জন্য সেরা পরবর্তী পদক্ষেপ।",
            )}
          </p>
          <a
            href={site.tel}
            className="flex items-center gap-2 border border-[#E8DCC8] text-[#1E1B4B] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#F5EDD8] transition-colors w-fit"
          >
            {pick("Call us", "ফোন করুন")} <FiPhone />
          </a>
          <p className="text-sm text-[#1E1B4B]/50">
            {bangla ? site.phone.bn : site.phone.en}
            <br />
            {pick("Call us during opening hours", "খোলার সময় ফোন করুন")}
          </p>
        </div>

        {/* Accordion: all text comes from the database */}
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518] mb-4">
            {pick(
              "Common student and parent questions",
              "শিক্ষার্থী ও অভিভাবকদের সাধারণ প্রশ্ন",
            )}
          </p>
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              question={bangla ? faq.questionBn || faq.question : faq.question}
              answer={bangla ? faq.answerBn || faq.answer : faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? "" : faq.id)}
              bangla={bangla}
              showCoursesLink={faq.answer.toLowerCase().includes("courses")}
            />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="bg-[#F5C518] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#1E1B4B]/50 mb-1">
              {pick("Still wondering?", "এখনও ভাবছেন?")}
            </p>
            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {pick(
                "Your question belongs here, too.",
                "আপনার প্রশ্নও এখানে স্বাগত।",
              )}
            </h2>
            <p className="text-base text-[#1E1B4B]/60 mt-1 max-w-md">
              {pick(
                "If we haven't covered it, ask us through the enquiry form or call the center. Your questions help us improve this FAQ for other students and parents.",
                "আপনার প্রশ্নের উত্তর এখানে না থাকলে ফর্মের মাধ্যমে জিজ্ঞাসা পাঠান বা কেন্দ্রে ফোন করুন। আপনার প্রশ্ন অন্য শিক্ষার্থী ও অভিভাবকদের জন্য এই সহায়িকাটি উন্নত করতে সাহায্য করে।",
              )}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#1E1B4B] text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-[#1E1B4B] transition-colors text-base"
            >
              {pick("Ask a question", "প্রশ্ন করুন")} <FiArrowUpRight />
            </Link>
            <a
              href={site.tel}
              className="flex items-center justify-center gap-2 bg-white text-[#1E1B4B] font-semibold px-6 py-3 rounded-full text-base hover:bg-[#1E1B4B] hover:text-white transition-colors"
            >
              {pick("Call us", "ফোন করুন")} <FiPhone />
            </a>
            <p className="text-sm text-[#1E1B4B]/40 text-center">
              {pick(
                "The enquiry form is on Contact. Please don't include sensitive student information.",
                "জিজ্ঞাসার ফর্মটি যোগাযোগ পাতায় আছে। সংবেদনশীল শিক্ষার্থী তথ্য দেবেন না।",
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
