"use client";

import Link from "next/link";
import { FiPhone, FiArrowUpRight, FiInfo, FiUser } from "react-icons/fi";
import { HiOutlineTrendingUp } from "react-icons/hi";

import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

const progressData = [
  {
    learner: "Learner A · SSC Maths",
    learnerBn: "শিক্ষার্থী A · এসএসসি গণিত",
    before: 54,
    after: 76,
    note: "Stronger algebra foundations and more consistent homework.",
    noteBn:
      "বীজগণিতের ভিত্তি মজবুত হয়েছে এবং নিয়মিত বাড়ির কাজ করার অভ্যাস গড়ে উঠেছে।",
  },
  {
    learner: "Learner B · HSC Physics",
    learnerBn: "শিক্ষার্থী B · এইচএসসি পদার্থবিজ্ঞান",
    before: 48,
    after: 69,
    note: "Better working steps in mechanics and numerical problems.",
    noteBn:
      "বলবিদ্যা ও গাণিতিক সমস্যার সমাধানে ধাপে ধাপে কাজ করার দক্ষতা বেড়েছে।",
  },
  {
    learner: "Learner C · Class 7 Maths",
    learnerBn: "শিক্ষার্থী C · সপ্তম শ্রেণির গণিত",
    before: 61,
    after: 80,
    note: "More confident with fractions, ratios and classroom questions.",
    noteBn:
      "ভগ্নাংশ, অনুপাত এবং শ্রেণিকক্ষের প্রশ্ন সমাধানে আত্মবিশ্বাস বেড়েছে।",
  },
];

export default function TeachersResultsPage() {
  const { language } = useLanguage();
  const { teachers, testimonials, site } = useContent();
  const bangla = language === "bn";

  const pick = (en: string, bn: string) => (bangla ? bn : en);

  const num = (value: number) =>
    value.toLocaleString(bangla ? "bn-BD" : "en-US");

  return (
    <>
      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518] mb-3">
          {pick("People, place & progress", "শিক্ষক, পরিবেশ ও অগ্রগতি")}
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B] mb-3">
          {pick(
            "Good teaching starts with a connection.",
            "ভালো শিক্ষার শুরু হয় আন্তরিক সম্পর্ক থেকে।",
          )}
        </h1>

        <p className="text-base text-[#1E1B4B]/65 max-w-xl mb-6">
          {pick(
            "Get to know our teaching approach, explore the learning environment and see how we aim to keep parents informed about their child's progress. Because every student deserves guidance, encouragement and personal attention.",
            "আমাদের পাঠদানের পদ্ধতি সম্পর্কে জানুন, পড়াশোনার পরিবেশ ঘুরে দেখুন এবং কীভাবে আমরা শিক্ষার্থীর অগ্রগতি সম্পর্কে অভিভাবকদের অবহিত রাখতে চাই তা জানুন। কারণ প্রতিটি শিক্ষার্থীর প্রয়োজন সঠিক দিকনির্দেশনা, উৎসাহ এবং ব্যক্তিগত যত্ন।",
          )}
        </p>

        <div className="flex items-start gap-2 bg-[#F5EDD8] border border-[#E8DCC8] rounded-xl px-4 py-3 text-sm text-[#1E1B4B]/60 max-w-2xl">
          <FiInfo className="mt-0.5 shrink-0 text-[#1E1B4B]/40" />
          <span>
            {pick(
              "Information of our teachers are given here. For more clarity reach out to us.",
              "আমাদের কোচিং-এর শিক্ষকদের বিস্তারিত এই পেইজে দেওয়া আছে। আরও জানতে আমাদের সাথে যোগাযোগ করুন।",
            )}
          </span>
        </div>
      </section>

      {/* 01 Teachers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-[#F5C518] rounded-full" />
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">
              {pick("01 / Meet the teachers", "০১ / আমাদের শিক্ষকমণ্ডলী")}
            </p>

            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {pick(
                "Clear explanations. Supportive guidance.",
                "সহজ ব্যাখ্যা। আন্তরিক দিকনির্দেশনা।",
              )}
            </h2>
          </div>
        </div>

        <p className="text-base text-[#1E1B4B]/60 mb-8 ml-4">
          {pick(
            "Meet the people who make learning easier. Our aim is to explain every topic clearly, encourage questions and help students build a strong understanding of their subjects.",
            "যাঁরা পড়াশোনাকে আরও সহজ করে তুলতে সহায়তা করেন, তাঁদের সঙ্গে পরিচিত হোন। প্রতিটি বিষয় সহজভাবে বোঝানো, শিক্ষার্থীদের প্রশ্ন করতে উৎসাহিত করা এবং বিষয়ভিত্তিক মজবুত ধারণা গড়ে তোলাই আমাদের লক্ষ্য।",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {teachers.slice(0, 3).map((teacher) => {
            const localizedTeacher = teacher as typeof teacher & {
              nameBn?: string;
              subjectBn?: string;
              qualificationsBn?: string[];
              bioBn?: string;
            };

            return (
              <div
                key={teacher.id}
                className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden"
              >
                <div className="bg-[#E8DCC8] aspect-[4/3] flex items-center justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#FFF6E5] text-[#1E1B4B]/45">
                    <FiUser className="text-7xl" aria-hidden="true" />
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-2">
                  <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">
                    {pick("Teacher profile", "শিক্ষক পরিচিতি")}
                  </p>

                  <h3 className="text-lg font-bold text-[#1E1B4B]">
                    {bangla
                      ? localizedTeacher.nameBn || teacher.name
                      : teacher.name}
                  </h3>

                  <p className="text-base font-semibold text-[#F5C518]">
                    {bangla
                      ? localizedTeacher.subjectBn || teacher.subject
                      : teacher.subject}
                  </p>

                  <ul className="text-base text-[#1E1B4B]/60 space-y-0.5">
                    {(bangla && localizedTeacher.qualificationsBn
                      ? localizedTeacher.qualificationsBn
                      : teacher.qualifications
                    ).map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>

                  <p className="text-base text-[#1E1B4B]/60 mt-1 italic">
                    {bangla
                      ? localizedTeacher.bioBn || teacher.bio
                      : teacher.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 02 Student Progress */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-[#F5C518] rounded-full" />
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">
              {pick(
                "02 / Progress of our students",
                "০২ / আমাদের শিক্ষার্থীদের অগ্রগতি",
              )}
            </p>

            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {pick(
                "Learning is more than just marks.",
                "শেখার মূল্যায়ন শুধু নম্বর দিয়ে নয়।",
              )}
            </h2>
          </div>
        </div>

        <p className="text-base text-[#1E1B4B]/60 mb-2 ml-4">
          {pick(
            "We believe meaningful progress comes from understanding concepts, regular practice and consistent effort.",
            "আমরা বিশ্বাস করি, বিষয় ভালোভাবে বোঝা, নিয়মিত অনুশীলন এবং ধারাবাহিক প্রচেষ্টার মাধ্যমেই প্রকৃত উন্নতি সম্ভব।",
          )}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 ml-4 mb-6">
          <span className="bg-[#F5C518] text-[#1E1B4B] text-sm font-semibold px-2.5 py-1 rounded-full w-fit">
            {pick("Progress", "অগ্রগতি")}
          </span>

          <span className="text-base text-[#1E1B4B]/55">
            {pick(
              "Our students' learning progress shared data by themselves.",
              "আমাদের শিক্ষার্থীদের দেওয়া তাদের নিজেদের অগ্রগতির তথ্য।",
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {progressData.map((item, index) => (
            <div
              key={index}
              className="bg-[#F5EDD8] rounded-2xl p-5 flex flex-col gap-2"
            >
              <p className="text-base font-semibold text-[#1E1B4B]">
                {pick(item.learner, item.learnerBn)}
              </p>

              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-[#F5C518]">
                  {num(item.before)}% → {num(item.after)}%
                </p>

                <HiOutlineTrendingUp className="text-[#F5C518] text-xl shrink-0" />
              </div>

              <p className="text-sm font-semibold tracking-widest uppercase text-[#1E1B4B]/40">
                {pick(
                  "Practice assessment · One term",
                  "অনুশীলনী মূল্যায়ন · এক টার্ম",
                )}
              </p>

              <p className="text-base text-[#1E1B4B]/60">
                {pick(item.note, item.noteBn)}
              </p>
            </div>
          ))}
        </div>

        <p className="text-base text-[#1E1B4B]/55 mt-4">
          {pick(
            "Practice assessments are not official board examinations. Every student progresses at a different pace. Before publishing actual results, the assessment period, supporting evidence and parent/student consent must be confirmed.",
            "অনুশীলনী পরীক্ষার ফলাফল বোর্ড পরীক্ষার ফলাফলের সমতুল্য নয়। প্রত্যেক শিক্ষার্থীর অগ্রগতির গতি আলাদা। প্রকৃত ফলাফল প্রকাশের আগে মূল্যায়নের সময়কাল, প্রয়োজনীয় প্রমাণ এবং শিক্ষার্থী ও অভিভাবকের সম্মতি নিশ্চিত করতে হবে।",
          )}
        </p>
      </section>

      {/* 03 Learning Environment */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#F5C518] rounded-full" />
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">
              {pick("03 / Take a look around", "০৩ / আমাদের পরিবেশ")}
            </p>

            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {pick(
                "A welcoming space to learn and grow.",
                "শেখা ও বেড়ে ওঠার জন্য একটি আন্তরিক পরিবেশ।",
              )}
            </h2>
          </div>
        </div>

        <p className="text-base text-[#1E1B4B]/60 mb-6 ml-4">
          {pick(
            "A positive learning environment helps students feel comfortable, stay focused and ask questions freely. Visit the center, meet the team and see the facilities for yourself. The images below are placeholders for illustrative photographs.",
            "ইতিবাচক শিক্ষার পরিবেশ শিক্ষার্থীদের স্বাচ্ছন্দ্য বোধ করতে, মনোযোগ ধরে রাখতে এবং নির্দ্বিধায় প্রশ্ন করতে সাহায্য করে। কেন্দ্রটি ঘুরে দেখুন, শিক্ষকদের সঙ্গে পরিচিত হোন এবং নিজেই সুযোগ-সুবিধাগুলো যাচাই করুন। নিচের ছবির জায়গাগুলোতে নমুনা ছবি ব্যবহারের জন্য রাখা হয়েছে।",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              en: "A calm classroom photo",
              bn: "শান্ত শ্রেণিকক্ষ নমুনা ছবি",
            },
            {
              en: "Room for questions",
              bn: "প্রশ্ন ও আলোচনার সুযোগ",
            },
          ].map((item) => (
            <div
              key={item.en}
              className="rounded-2xl overflow-hidden bg-[#E8DCC8] aspect-video flex items-end"
            >
              <span className="text-sm text-[#1E1B4B]/40 p-3">
                {pick(item.en, item.bn)}
              </span>
            </div>
          ))}
        </div>

        <p className="text-base text-[#1E1B4B]/55 mt-3">
          {pick(
            "Before admission, feel free to ask about teacher qualifications, CCTV coverage, separate seating arrangements, female staff availability and student arrival and pickup procedures. All operational and safety details must be confirmed directly with the center.",
            "ভর্তির আগে শিক্ষকদের যোগ্যতা, সিসিটিভি ব্যবস্থা, পৃথক বসার ব্যবস্থা, নারী কর্মীর উপস্থিতি এবং শিক্ষার্থীদের যাতায়াত ও আনা-নেওয়ার নিয়ম সম্পর্কে জেনে নিন। কেন্দ্রের সব কার্যক্রম ও নিরাপত্তাসংক্রান্ত তথ্য সরাসরি কর্তৃপক্ষের কাছ থেকে নিশ্চিত করে নেবেন।",
          )}
        </p>
      </section>

      {/* 04 Parent Feedback */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#F5C518] rounded-full" />
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">
              {pick(
                "04 / Parents in the conversation",
                "০৪ / অভিভাবকদের মতামত",
              )}
            </p>

            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {pick(
                "Small steps. Meaningful progress.",
                "ছোট ছোট পরিবর্তনেই আসে ইতিবাচক অগ্রগতি।",
              )}
            </h2>
          </div>
        </div>

        <p className="text-base text-[#1E1B4B]/60 mb-6 ml-4">
          {pick(
            "A child’s learning journey is a partnership between teachers, students and parents. We value open communication and honest feedback. The testimonials below are sample content for this website design, not actual parent endorsements. Real testimonials should only be published with the parent’s permission.",
            "একজন শিক্ষার্থীর শেখার যাত্রায় শিক্ষক, শিক্ষার্থী এবং অভিভাবক—সবারই গুরুত্বপূর্ণ ভূমিকা রয়েছে। আমরা খোলামেলা যোগাযোগ এবং আন্তরিক মতামতকে গুরুত্ব দিই। নিচের মতামতগুলো ওয়েবসাইটের নমুনা কনটেন্ট; এগুলো প্রকৃত অভিভাবকের বক্তব্য নয়। অভিভাবকের অনুমতি নিয়েই কেবল প্রকৃত মতামত প্রকাশ করা উচিত।",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => {
            const localizedTestimonial = testimonial as typeof testimonial & {
              quoteBn?: string;
              parentNameBn?: string;
              parentRoleBn?: string;
            };

            return (
              <div
                key={testimonial.id}
                className="bg-[#F5EDD8] rounded-2xl p-6 flex flex-col gap-4"
              >
                <p className="text-sm font-semibold tracking-widest uppercase text-[#F5C518]">
                  {pick("Testimonial", "মতামত")}
                </p>

                <blockquote className="text-xl font-semibold text-[#1E1B4B] leading-snug">
                  &ldquo;
                  {bangla
                    ? localizedTestimonial.quoteBn || testimonial.quote
                    : testimonial.quote}
                  &rdquo;
                </blockquote>

                <div>
                  <p className="text-sm font-semibold text-[#1E1B4B]">
                    {bangla
                      ? localizedTestimonial.parentNameBn ||
                        testimonial.parentName
                      : testimonial.parentName}
                  </p>

                  <p className="text-sm text-[#1E1B4B]/50 mt-0.5">
                    {bangla
                      ? localizedTestimonial.parentRoleBn ||
                        testimonial.parentRole
                      : testimonial.parentRole}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F5C518] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-[#1E1B4B]/50 mb-1">
              {pick("Your child's next chapter", "আপনার সন্তানের আগামীর পথ")}
            </p>

            <h2 className="text-2xl font-bold text-[#1E1B4B]">
              {pick(
                "Meet the teacher before you decide.",
                "সিদ্ধান্ত নেওয়ার আগে শিক্ষকের সঙ্গে পরিচিত হোন।",
              )}
            </h2>

            <p className="text-base text-[#1E1B4B]/65 mt-1">
              {pick(
                "Tell us about your child's learning needs. We'll help you explore suitable courses and discuss the possibility of a demo class.",
                "আপনার সন্তানের পড়াশোনার প্রয়োজন সম্পর্কে আমাদের জানান। আমরা উপযুক্ত কোর্স বেছে নিতে এবং ডেমো ক্লাসের সুযোগ সম্পর্কে আলোচনা করতে সাহায্য করব।",
              )}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-[#1E1B4B] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#302b70] transition-colors text-base"
            >
              {pick("Enquire about a demo class", "ডেমো ক্লাস সম্পর্কে জানুন")}
              <FiArrowUpRight />
            </Link>

            <a
              href={site.tel}
              className="flex items-center justify-center gap-2 bg-white text-[#1E1B4B] font-semibold px-6 py-3 rounded-full text-base hover:bg-[#f5f5f5] transition-colors"
            >
              {pick("Call us", "ফোন করুন")}
              <FiPhone />
            </a>

            <p className="text-sm text-[#1E1B4B]/50 text-center">
              {pick(
                "Demo class availability is subject to confirmation.",
                "ডেমো ক্লাসের সুযোগ কর্তৃপক্ষের সঙ্গে কথা বলে নিশ্চিত করুন।",
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

