"use client";

import { FormEvent, useMemo, useState } from "react";
import { FiPhone, FiArrowUpRight, FiMapPin, FiFacebook } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

type Enquiry = {
  name: string;
  phone: string;
  classLevel: string;
  subject: string;
  course: string;
  question: string;
  consent: boolean;
};

// "value" is what gets saved in the database (always English).
// "en" / "bn" are only the labels the visitor sees.
const GENERAL = {
  value: "General enquiry",
  en: "General enquiry",
  bn: "সাধারণ জিজ্ঞাসা",
};

const CLASS_OPTIONS = [
  { value: "3", en: "Class 3", bn: "তৃতীয় শ্রেণি" },
  { value: "4", en: "Class 4", bn: "চতুর্থ শ্রেণি" },
  { value: "5", en: "Class 5", bn: "পঞ্চম শ্রেণি" },
  { value: "6", en: "Class 6", bn: "ষষ্ঠ শ্রেণি" },
  { value: "7", en: "Class 7", bn: "সপ্তম শ্রেণি" },
  { value: "8", en: "Class 8", bn: "অষ্টম শ্রেণি" },
  { value: "9", en: "Class 9", bn: "নবম শ্রেণি" },
  { value: "10", en: "Class 10", bn: "দশম শ্রেণি" },
  { value: "11", en: "Class 11", bn: "একাদশ শ্রেণি" },
  { value: "12", en: "Class 12", bn: "দ্বাদশ শ্রেণি" },
];

const SUBJECT_OPTIONS = [
  { value: "Mathematics", en: "Mathematics", bn: "গণিত" },
  { value: "Physics", en: "Physics", bn: "পদার্থবিজ্ঞান" },
  { value: "Chemistry", en: "Chemistry", bn: "রসায়ন" },
  { value: "Biology", en: "Biology", bn: "জীববিজ্ঞান" },
  { value: "Bangla", en: "Bangla", bn: "বাংলা" },
  { value: "English", en: "English", bn: "ইংরেজি" },
  GENERAL,
];



// Lets parents type a phone number with Bangla digits (০১৭...) — it is saved with English digits.
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
function toEnglishDigits(value: string) {
  return value.replace(/[০-৯]/g, (digit) => String(BN_DIGITS.indexOf(digit)));
}

const inputClass =
  "border border-[#E8DCC8] rounded-xl px-4 py-2.5 text-sm text-[#1E1B4B] placeholder-[#1E1B4B]/30 bg-white focus:outline-none focus:border-[#1E1B4B]";

export default function ContactPage() {
  const { language } = useLanguage();
  const { site, courses } = useContent();
  const bangla = language === "bn";

  // Build course options from live DB data.
  // courses is a flat list of course+batch rows, so deduplicate by course id.
  // Include level in value/label so courses with the same title (e.g. SSC Physics vs HSC Physics) stay unique.
  const courseOptions = useMemo(() => {
    const seen = new Set<string>();
    const unique = courses.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
    return [...unique.map((c) => ({ value: `${c.title} · ${c.level}`, en: `${c.title} · ${c.level}`, bn: `${c.titleBn || c.title} · ${c.levelBn || c.level}` })), GENERAL];
  }, [courses]);
  const pick = (en: string, bn: string) => (bangla ? bn : en);
  const [form, setForm] = useState<Enquiry>({
    name: "",
    phone: "",
    classLevel: "",
    subject: "",
    course: "",
    question: "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField<K extends keyof Enquiry>(field: K, value: Enquiry[K]) {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.consent) return;
    if (!/^(?:\+?880|0)1[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      setError(
        pick(
          "Please enter a valid 11-digit Bangladesh mobile number.",
          "অনুগ্রহ করে সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।",
        ),
      );
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(
          data.error ||
            pick(
              "We could not send your enquiry. Please try again in a moment, or call us directly.",
              "আপনার জিজ্ঞাসা পাঠানো যায়নি। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন, অথবা সরাসরি আমাদের ফোন করুন।",
            ),
        );
        return;
      }
      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        classLevel: "",
        subject: "",
        course: "",
        question: "",
        consent: false,
      });
    } catch {
      setError(
        pick(
          "Something went wrong with the connection. Please check your internet and try again.",
          "ইন্টারনেট সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে সংযোগ দেখে আবার চেষ্টা করুন।",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick("A conversation comes first", "আলাপ দিয়েই শুরু হোক")}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] mb-3">
          {pick("Let's talk about", "চলুন, পরবর্তী ধাপ নিয়ে")}
          <br />
          {pick("the next step.", "একসঙ্গে কথা বলি।")}
        </h1>
        <p className="text-[#1E1B4B]/60 max-w-xl mb-6">
          {pick(
            "Whether you are a student or a parent, ask about a class, a demo or a center visit. We're happy to help you understand the options before making a decision.",
            "আপনি শিক্ষার্থী হোন বা অভিভাবক, ক্লাস, ডেমো বা সেন্টার পরিদর্শন নিয়ে নির্দ্বিধায় জিজ্ঞাসা করুন। সিদ্ধান্ত নেওয়ার আগে সব বিকল্প ভালোভাবে বুঝে নিতে আমরা আপনার পাশে আছি।",
          )}
        </p>
        <div className="flex items-start gap-2 bg-[#F5EDD8] border border-[#E8DCC8] rounded-xl px-4 py-3 text-xs text-[#1E1B4B]/60 max-w-2xl">
          <span className="mt-0.5 shrink-0 text-[#1E1B4B]/40">ℹ</span>
          <span>
            {pick(
              "Contact details and safety arrangements must be confirmed before admission.",
              "ভর্তির আগে যোগাযোগের তথ্য ও নিরাপত্তাব্যবস্থা নিশ্চিত করুন।",
            )}
          </span>
        </div>
      </section>

      {/* ── Phone CTA bar ──────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2">
        {/* Left half: yellow */}
        <div className="bg-[#F5C518] py-10 px-4 sm:px-10 flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1E1B4B]/50 mb-1">
            {pick(
              "The quickest way to reach us",
              "আমাদের কাছে পৌঁছানোর সবচেয়ে সহজ উপায়",
            )}
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] tracking-[0.18em] sm:tracking-widest">
            {bangla ? site.phone.bn : site.phone.en}
          </p>
          <p className="text-sm text-[#1E1B4B]/60 mt-1">
            {pick(
              "Call us during opening hours to discuss classes or arrange a visit.",
              "ক্লাস নিয়ে কথা বলতে বা সেন্টারে আসার সময় ঠিক করতে খোলার সময়ে ফোন করুন।",
            )}
          </p>
        </div>

        {/* Right half: dark navy */}
        <div className="bg-[#1E1B4B] py-10 px-4 sm:px-10 flex flex-col items-start justify-center gap-3">
          <a
            href={site.tel}
            className="flex items-center gap-2 bg-[#F5C518] text-[#1E1B4B] font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-[#1E1B4B] transition-colors"
          >
            {pick("Call BrightPath", "ব্রাইটপাথে ফোন করুন")} <FiPhone />
          </a>
          <p className="text-xs text-white/60">
            {pick(site.hours.en, site.hours.bn)
              .split("·")
              .map((part, index) => (
                <span key={index} className="block">
                  {part.trim()}
                </span>
              ))}
          </p>
        </div>
      </section>

      {/* ── Form + Info grid ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Enquiry form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8DCC8] rounded-2xl p-7"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-1">
            {pick(
              "Let's find the next step together",
              "একসঙ্গে পরবর্তী পদক্ষেপ ঠিক করি",
            )}
          </p>
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-1">
            {pick("Send an enquiry", "জিজ্ঞাসা পাঠান")}
          </h2>
          <p className="text-sm text-[#1E1B4B]/50 mb-6">
            {pick(
              "All fields marked * are required. General enquiries are welcome too.",
              "তারকা (*) চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে। সাধারণ কোনো প্রশ্ন থাকলে সেটাও নির্দ্বিধায় পাঠাতে পারেন।",
            )}
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1E1B4B]">
                  {pick("Parent / guardian name *", "অভিভাবকের নাম *")}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                  placeholder={pick("Your full name", "আপনার পূর্ণ নাম")}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1E1B4B]">
                  {pick("Phone number *", "ফোন নম্বর *")}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", toEnglishDigits(event.target.value))
                  }
                  pattern="(?:\+?880|0)1[3-9][0-9]{8}"
                  title={pick(
                    "Enter a valid Bangladesh mobile number",
                    "সঠিক বাংলাদেশি মোবাইল নম্বর দিন",
                  )}
                  required
                  placeholder={pick(
                    "Your 11-digit mobile number",
                    "আপনার ১১ সংখ্যার মোবাইল নম্বর",
                  )}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1E1B4B]">
                  {pick("Student's class *", "শিক্ষার্থীর শ্রেণি *")}
                </label>
                <select
                  value={form.classLevel}
                  onChange={(event) =>
                    updateField("classLevel", event.target.value)
                  }
                  required
                  className={inputClass}
                >
                  <option value="">
                    {pick("Choose a class", "শ্রেণি বেছে নিন")}
                  </option>
                  {CLASS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {pick(option.en, option.bn)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#1E1B4B]">
                  {pick("Subject *", "বিষয় *")}
                </label>
                <select
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  required
                  className={inputClass}
                >
                  <option value="">
                    {pick(
                      "Choose a subject / General enquiry",
                      "বিষয় বেছে নিন / সাধারণ জিজ্ঞাসা",
                    )}
                  </option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {pick(option.en, option.bn)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1E1B4B]">
                {pick("Course *", "কোর্স *")}
              </label>
              <select
                value={form.course}
                onChange={(event) => updateField("course", event.target.value)}
                required
                className={inputClass}
              >
                <option value="">
                  {pick(
                    "Choose a course / General enquiry",
                    "কোর্স বেছে নিন / সাধারণ জিজ্ঞাসা",
                  )}
                </option>
                {courseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {pick(option.en, option.bn)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#1E1B4B]">
                {pick("Your question (optional)", "আপনার প্রশ্ন (ঐচ্ছিক)")}
              </label>
              <textarea
                rows={4}
                value={form.question}
                onChange={(event) =>
                  updateField("question", event.target.value)
                }
                placeholder={pick(
                  "Tell us what would help you or your child, or ask about a demo class.",
                  "আপনার বা আপনার সন্তানের কোন বিষয়ে সাহায্য দরকার, অথবা ডেমো ক্লাস নিয়ে কিছু জানার থাকলে এখানে লিখুন।",
                )}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(event) =>
                  updateField("consent", event.target.checked)
                }
                required
                className="mt-0.5 cursor-pointer"
              />
              <p className="text-xs text-[#1E1B4B]/50">
                {pick(
                  "I agree that BrightPath may call me about this enquiry. * We'll only use these details to respond; please don't share sensitive student information.",
                  "আমি সম্মতি দিচ্ছি যে এই জিজ্ঞাসার বিষয়ে ব্রাইটপাথ আমাকে ফোন করতে পারে। * আপনার দেওয়া তথ্য আমরা শুধু উত্তর দেওয়ার জন্যই ব্যবহার করব। অনুগ্রহ করে শিক্ষার্থীর কোনো সংবেদনশীল ব্যক্তিগত তথ্য দেবেন না।",
                )}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#F5C518] text-[#1E1B4B] font-semibold py-3 rounded-xl text-sm hover:bg-[#1E1B4B] hover:text-white transition-colors"
            >
              {saving
                ? pick("Sending…", "পাঠানো হচ্ছে…")
                : pick("Send enquiry", "জিজ্ঞাসা পাঠান")}{" "}
              <FiArrowUpRight />
            </button>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700"
              >
                {error}
              </p>
            )}
            {submitted && (
              <p
                role="status"
                className="rounded-xl bg-green-50 px-4 py-3 text-xs text-green-800"
              >
                {pick(
                  "Thank you. Your enquiry has been received. We will contact you soon.",
                  "ধন্যবাদ, আপনার জিজ্ঞাসা আমরা পেয়েছি। খুব শিগগিরই আপনার সঙ্গে যোগাযোগ করব।",
                )}
              </p>
            )}
            <p className="text-xs text-[#1E1B4B]/40 text-center">
              {pick(
                `Prefer a conversation? Call ${site.phone.en}.`,
                `সরাসরি কথা বলতে চান? ${site.phone.bn} নম্বরে ফোন করুন।`,
              )}
            </p>
          </div>
        </form>

        {/* Address + map + social */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-2">
              {pick("Come and meet us", "আসুন, দেখা হোক")}
            </p>
            <h2 className="text-2xl font-bold text-[#1E1B4B] mb-3">
              {pick("BrightPath Coaching Center", "ব্রাইটপাথ কোচিং সেন্টার")}
            </h2>
            <p className="text-[#1E1B4B]/70 text-sm leading-relaxed">
              {pick(site.address.en, site.address.bn)}
              <br />
              {pick(
                "Please call to arrange a visit.",
                "আসার আগে অনুগ্রহ করে ফোন করে সময় ঠিক করে নিন।",
              )}
            </p>
            <div className="border-t border-[#E8DCC8] my-4" />
            <p className="text-sm text-[#1E1B4B]/60 leading-relaxed">
              {pick("Opening hours", "খোলার সময়")}
              <br />
              {pick(site.hours.en, site.hours.bn)}
              <br />
              {pick(
                "Confirm holiday hours before travelling.",
                "ছুটির দিনে আসার আগে সেন্টার খোলা আছে কি না, ফোন করে নিশ্চিত হয়ে নিন।",
              )}
            </p>
          </div>

          {/* Map */}
          <div className="mt-2 aspect-[5/3] w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <iframe
              src={site.mapEmbedUrl}
              title={pick(
                "Map showing the location of BrightPath Coaching Center",
                "ব্রাইটপাথ কোচিং সেন্টারের অবস্থান",
              )}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <a
            href={site.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 border border-[#E8DCC8] text-[#1E1B4B] text-sm font-semibold py-3 rounded-xl bg-white hover:bg-[#1E1B4B] hover:text-white transition-colors"
          >
            <FiMapPin /> {pick("Get directions", "পথনির্দেশ")}
          </a>

          {/* Facebook */}
          <div className="bg-[#F5EDD8] rounded-2xl p-5">
            <h3 className="font-bold text-[#1E1B4B] mb-1">
              {pick("Stay connected", "যোগাযোগে থাকুন")}
            </h3>
            <p className="text-sm text-[#1E1B4B]/60 mb-4">
              {pick(
                "Find center updates and announcements on our Facebook page.",
                "সেন্টারের সর্বশেষ খবর ও ঘোষণার জন্য আমাদের ফেসবুক পেজে চোখ রাখুন।",
              )}
            </p>
            <a
              href={site.facebook || "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-[#E8DCC8] bg-white text-[#1E1B4B] text-sm font-semibold py-3 rounded-xl hover:bg-[#1E1B4B] hover:text-white transition-colors"
            >
              <FiFacebook />{" "}
              {pick("BrightPath on Facebook", "ফেসবুকে ব্রাইটপাথ")}{" "}
              <FiArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      {/* ── Before your visit ──────────────────────────────────────────── */}
      <section className="border-t border-[#E8DCC8] max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#F5C518] mb-2">
          {pick("Before your visit", "আসার আগে")}
        </p>
        <h2 className="text-3xl font-bold text-[#1E1B4B] mb-3">
          {pick(
            "Bring your questions. We'll make time.",
            "আপনার প্রশ্নগুলো নিয়ে আসুন। আপনার জন্য আমরা সময় রাখব।",
          )}
        </h2>
        <p className="text-[#1E1B4B]/60 max-w-2xl text-sm">
          {pick(
            "Ask to meet the teacher and discuss the syllabus, fees, CCTV coverage, arrangements for girls and safe pickup. These operational details are sample / to confirm.",
            "শিক্ষকের সঙ্গে দেখা করে সিলেবাস, ফি, সিসিটিভির আওতা, মেয়েদের জন্য ব্যবস্থা এবং নিরাপদে বাড়ি ফেরার বিষয়ে খোলাখুলি জানতে চান। এই ব্যবস্থাপনার তথ্যগুলো এখনও নমুনা, তাই আসার আগে নিশ্চিত করে নিন।",
          )}
        </p>
      </section>
    </>
  );
}
