"use client";

import Link from "next/link";
import { FiArrowRight, FiPhone, FiCheck } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";
import { CourseCard } from "@/components/site/CourseCard";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/Button";

export default function HomePage() {
    const { language } = useLanguage();
    const { courses, teachers, testimonials, site } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);
    const featured = courses.slice(0, 6);

    return (
        <>
            {/* ── HERO ──────────────────────────────────────────── */}
            <section className="container-page pt-16 pb-12 sm:pt-24 sm:pb-20">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <div>
                        <div className="mb-5">
                            <Eyebrow>{pick("We provide best guidance based on subjects", "আমরাই বিষয়ভিত্তিক সর্বোচ্চ সহায়তা দিই")}</Eyebrow>
                        </div>
                        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
                            {pick("Guiding every student toward", "প্রতিটি শিক্ষার্থীকে এগিয়ে নিই")}{" "}
                            <span className="relative inline-block">
                                <span className="relative z-10">
                                    {pick("academic excellence", "সাফল্যের পথে")}
                                </span>
                                <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-brand-yellow sm:h-4" />
                            </span>
                        </h1>
                        <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-ink-mute">
                            {pick(
                                "Subject wise coaching center for class 3-12. Experienced and qualified teachers guide every student.",
                                "তৃতীয় থেকে দ্বাদশ শ্রেণি পর্যন্ত বিষয়ভিত্তিক কোচিং। অভিজ্ঞ এবং সুযোগ্য শিক্ষকদের দ্বারা পরিচালিত।"
                            )}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-ink-mute">
                            {[
                                pick("Maximum Guidance", "সর্বোচ্চ দিকনির্দেশনা"),
                                pick("Small batches", "ছোট ব্যাচ "),
                                pick("Qualified Teachers", "যোগ্য শিক্ষক"),
                            ].map((f) => (
                                <span key={f} className="flex items-center gap-1.5">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-ink bg-brand-yellow text-xs"><FiCheck /></span>
                                    {f}
                                </span>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/book" className={buttonClass("primary", "lg")}>
                                {pick("Book a Seat", "সিট বুক করুন")} <FiArrowRight />
                            </Link>
                            <a href={site.tel} className={buttonClass("ghost", "lg")}>
                                <FiPhone /> {pick("Call us", "ফোন করুন")}
                            </a>
                        </div>
                    </div>

                    {/* Hero stat cards — fully static classes */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border-2 border-ink bg-brand-yellow p-6 shadow-card">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-ink/70">{pick("Classes", "শ্রেণি")}</p>
                            <p className="mt-2 text-4xl font-extrabold text-ink">3–12</p>
                            <p className="mt-1 text-sm font-bold text-ink/70">{pick("All levels covered", "সব শ্রেণি")}</p>
                        </div>
                        <div className="min-w-0 rounded-2xl border-2 border-ink bg-brand-blue p-6 shadow-card">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                                {pick("Less Student", "কম শিক্ষার্থী")}
                            </p>
                            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white break-words">
                                {pick("More Concentration", "বেশি মনোযোগ")}
                            </p>
                            <p className="mt-1 text-sm font-bold text-white/80">
                                {pick("Better Results", "ভালো ফলাফল")}
                            </p>
                        </div>
                        <div className="min-w-0 rounded-2xl border-2 border-ink bg-brand-purple p-6 shadow-card">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                                {pick("Teachers", "শিক্ষক")}
                            </p>
                            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white break-words">
                                {pick("Experienced", "অভিজ্ঞ")}
                            </p>
                            <p className="mt-1 text-sm font-bold text-white/80">
                                {pick("Quality Education", "মানসম্পন্ন শিক্ষা")}
                            </p>
                        </div>
                        <div className="rounded-2xl border-2 border-ink bg-brand-green p-6 shadow-card">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-black/70">{pick("Result Improvement", "ফলাফলের উন্নতি")}</p>
                            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white break-words">{pick("100% students", "১০০% শিক্ষার্থীর")}
                            </p>
                            <p className="mt-1 text-sm font-bold text-black/70">{pick("Compared to previous results", "আগের ফলাফলের তুলনায়")}</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* ── STATS STRIP ───────────────────────────────────── */}
            <section className="border-y-2 border-ink bg-brand-gray">
                <div className="container-page grid grid-cols-2 gap-px md:grid-cols-4">
                    {[
                        {
                            n: pick("6+", "৬+"),
                            label: pick("Years of experience", "বছরের অভিজ্ঞতা"),
                        },
                        {
                            n: pick("Primary–HSC", "প্রাথমিক–এইচএসসি"),
                            label: pick("Classes covered", "শ্রেণি অন্তর্ভুক্ত"),
                        },
                        {
                            n: pick("≤18", "≤১৮"),
                            label: pick("Students per batch", "প্রতি ব্যাচে শিক্ষার্থী"),
                        },
                        {
                            n: pick("6 days", "৬ দিন"),
                            label: pick("Open every week", "প্রতি সপ্তাহে খোলা"),
                        },
                    ].map((s) => (
                        <div key={s.label} className="flex min-w-0 flex-col items-center px-2 py-8 text-center">
                            <span className="text-2xl font-extrabold leading-tight text-ink break-words sm:text-3xl lg:text-4xl">
                                {s.n}
                            </span>
                            <span className="mt-1 text-sm font-bold text-ink-mute">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── COURSES ───────────────────────────────────────── */}
            < section className="container-page py-16 sm:py-20" >
                <div className="flex items-end justify-between gap-4">
                    <SectionHeading
                        eyebrow={pick("What we teach", "আমরা কী পড়াই")}
                        title={pick("Open batches right now.", "এখন চলমান ব্যাচসমূহ।")}
                        description={pick("Live seat counts. Book a spot before it fills up.", "সরাসরি সিট গণনা। পূর্ণ হওয়ার আগেই জায়গা নিন।")}
                    />
                    <Link href="/courses" className="hidden shrink-0 text-sm font-extrabold text-brand-blue hover:underline sm:block">
                        {pick("See all →", "সব দেখুন →")}
                    </Link>
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
                <div className="mt-6 sm:hidden">
                    <Link href="/courses" className={buttonClass("ghost", "md", "w-full")}>
                        {pick("See all courses", "সব কোর্স দেখুন")} <FiArrowRight />
                    </Link>
                </div>
            </section >

            {/* ── TEACHERS ──────────────────────────────────────── */}
            {teachers.length > 0 && (
                <section className="border-y-2 border-ink bg-white py-16 sm:py-20">
                    <div className="container-page">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <SectionHeading
                                eyebrow={pick("Who teaches here", "যারা পড়ান")}
                                title={pick("Learn from the best.", "সেরাদের কাছে শিখুন।")}
                                description={pick(
                                    "Every teacher holds a postgraduate degree and has years of board-exam coaching experience.",
                                    "প্রতিটি শিক্ষক স্নাতকোত্তর ডিগ্রিধারী এবং বোর্ড পরীক্ষার কোচিংয়ে বছরের পর বছরের অভিজ্ঞতাসম্পন্ন।"
                                )}
                            />
                            <Link
                                href="/teachers-results"
                                className="hidden shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-brand-yellow px-5 py-2.5 text-sm font-extrabold text-ink shadow-card transition-transform hover:-translate-y-0.5 sm:inline-flex"
                            >
                                {pick("See more", "আরও দেখুন")} <FiArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {teachers.map((teacher, i) => {
                                const avatar = [
                                    "bg-brand-yellow text-ink",
                                    "bg-brand-blue text-white",
                                    "bg-brand-purple text-white",
                                ][i % 3];

                                return (
                                    <div
                                        key={teacher.id}
                                        className="flex min-w-0 flex-col rounded-2xl border-2 border-ink bg-white p-5 shadow-card transition-transform hover:-translate-y-1"
                                    >
                                        <div
                                            className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink text-3xl font-extrabold ${avatar}`}
                                        >
                                            {(bangla ? teacher.nameBn : teacher.name).charAt(0)}
                                        </div>

                                        <p className="mt-4 text-lg font-extrabold leading-tight text-ink break-words">
                                            {bangla ? teacher.nameBn : teacher.name}
                                        </p>

                                        <span className="mt-2 inline-flex w-fit rounded-lg border-2 border-ink bg-brand-gray px-2.5 py-0.5 text-xs font-extrabold text-ink">
                                            {bangla ? teacher.subjectBn : teacher.subject}
                                        </span>

                                        <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-ink-mute line-clamp-3">
                                            {bangla ? teacher.bioBn : teacher.bio}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 sm:hidden">
                            <Link
                                href="/teachers-results"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-brand-yellow px-5 py-2.5 text-sm font-extrabold text-ink shadow-card"
                            >
                                {pick("See more", "আরও দেখুন")} <FiArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── TESTIMONIALS ──────────────────────────────────── */}
            {
                testimonials.length > 0 && (
                    <section className="container-page py-16 sm:py-20">
                        <SectionHeading
                            eyebrow={pick("What parents say", "অভিভাবকরা কী বলেন")}
                            title={pick("Heard from families", "পরিবারদের কাছ থেকে")}
                            align="center"
                        />
                        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {testimonials.map((t) => (
                                <blockquote key={t.id} className="flex flex-col rounded-2xl border-2 border-ink bg-white p-6 shadow-card">
                                    <p className="flex-1 text-sm font-medium leading-relaxed text-ink-mute">
                                        &ldquo;{bangla ? t.quoteBn : t.quote}&rdquo;
                                    </p>
                                    <footer className="mt-5 border-t-2 border-ink/10 pt-4">
                                        <p className="text-sm font-extrabold text-ink">{bangla ? t.authorBn : t.author}</p>
                                        <p className="text-xs font-medium text-ink-mute">{bangla ? t.roleBn : t.role}</p>
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </section>
                )
            }

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="container-page pb-20">
                <div className="rounded-2xl border-2 border-ink bg-brand-yellow p-10 text-center shadow-card sm:p-16">
                    <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
                        {pick("Seats go fast. Grab yours today.", "সিট দ্রুত পূর্ণ হয়। আজই নিশ্চিত করুন।")}
                    </h2>
                    <p className="mt-3 font-medium text-ink/70">
                        {pick("No payment needed to reserve — we call you to confirm.", "রিজার্ভ করতে পেমেন্ট লাগে না — আমরা নিশ্চিত করতে কল করব।")}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link href="/book" className={buttonClass("secondary", "lg")}>
                            {pick("Book a Seat", "সিট বুক করুন")} <FiArrowRight />
                        </Link>
                        <Link href="/courses" className={buttonClass("ghost", "lg")}>
                            {pick("Browse Courses", "কোর্স দেখুন")}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
