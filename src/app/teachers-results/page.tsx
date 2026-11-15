"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";
import { SectionHeading, Eyebrow } from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { FiAward, FiUsers, FiTrendingUp, FiArrowRight } from "react-icons/fi";

export default function TeachersResultsPage() {
    const { language } = useLanguage();
    const { teachers, results } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);
    const totalAPlus = results.filter((r) => r.grade === "A+").length;
    const latestYear = results.length > 0 ? Math.max(...results.map((r) => r.year)) : null;

    return (
        <main className="container-page py-12 sm:py-20 space-y-20">

            {/* ── Header ── */}
            <SectionHeading
                eyebrow={pick("Faculty & Results", "শিক্ষক ও ফলাফল")}
                title={pick("The people behind your child's progress.", "আপনার সন্তানের এগিয়ে যাওয়ার গল্পে যাঁরা আছেন।")}
                description={pick(
                    "Every BrightPath teacher holds a postgraduate degree and brings years of board-exam coaching experience. Small batches mean each student gets real attention.",
                    "BrightPath-এর প্রতিটি শিক্ষক স্নাতকোত্তর ডিগ্রিধারী, বোর্ড পরীক্ষায় অভিজ্ঞ। ছোট ব্যাচে প্রতিটি শিক্ষার্থী ঠিক যত্ন পায়।"
                )}
            />

            {/* ── Stats ── */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border-2 border-ink bg-brand-yellow p-6 shadow-card">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white">
                        <FiUsers className="text-lg text-ink" />
                    </div>
                    <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-ink/50">{pick("Teachers on staff", "শিক্ষক")}</p>
                    <p className="mt-1 text-4xl font-extrabold text-ink">{teachers.length}</p>
                </div>
                <div className="rounded-2xl border-2 border-ink bg-brand-blue-light p-6 shadow-card">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white">
                        <FiAward className="text-lg text-brand-blue" />
                    </div>
                    <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-ink/50">{pick("A+ grades achieved", "এ+ গ্রেড")}</p>
                    <p className="mt-1 text-4xl font-extrabold text-ink">{totalAPlus}</p>
                </div>
                <div className="rounded-2xl border-2 border-ink bg-brand-purple-light p-6 shadow-card">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white">
                        <FiTrendingUp className="text-lg text-brand-purple" />
                    </div>
                    <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-ink/50">{pick("Most recent batch year", "সর্বশেষ পরীক্ষার বছর")}</p>
                    <p className="mt-1 text-4xl font-extrabold text-ink">{latestYear ?? "—"}</p>
                </div>
            </div>

            {/* ── Teacher cards ── */}
            <section>
                <div className="flex items-end justify-between gap-4 mb-8">
                    <div>
                        <Eyebrow>{pick("Meet the faculty", "শিক্ষকমণ্ডলী")}</Eyebrow>
                        <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{pick("Dedicated to your child's success.", "আপনার সন্তানের সাফল্যে নিবেদিত।")}</h2>
                    </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex gap-6 rounded-2xl border-2 border-ink bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                            {/* Avatar */}
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-ink bg-brand-yellow text-2xl font-extrabold text-ink">
                                {pick(teacher.name, teacher.nameBn).charAt(0)}
                            </div>
                            <div className="min-w-0 flex flex-col">
                                <h3 className="text-lg font-extrabold text-ink">{pick(teacher.name, teacher.nameBn)}</h3>
                                <span className="mt-1.5 inline-flex w-fit rounded-lg border-2 border-blue-300 bg-brand-blue-light px-2.5 py-0.5 text-xs font-extrabold text-brand-blue">
                                    {pick(teacher.subject, teacher.subjectBn)}
                                </span>
                                <p className="mt-3 text-sm font-medium leading-relaxed text-ink-mute line-clamp-4">
                                    {pick(teacher.bio, teacher.bioBn)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Results table ── */}
            <section>
                <div className="mb-6">
                    <Eyebrow>{pick("Board exam results", "বোর্ড পরীক্ষার ফলাফল")}</Eyebrow>
                    <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{pick("What our students achieved.", "আমাদের শিক্ষার্থীরা যা অর্জন করেছে।")}</h2>
                    <p className="mt-2 text-sm font-medium text-ink-mute">{pick("A selection of recent outstanding results from our students.", "আমাদের শিক্ষার্থীদের সাম্প্রতিক কৃতিত্ব থেকে কিছু।")}</p>
                </div>
                <div className="overflow-x-auto rounded-2xl border-2 border-ink shadow-card">
                    <table className="min-w-full divide-y-2 divide-ink/10 text-sm">
                        <thead className="bg-brand-gray">
                            <tr>
                                {[
                                    pick("Student", "শিক্ষার্থী"),
                                    pick("Exam", "পরীক্ষা"),
                                    pick("Subject", "বিষয়"),
                                    pick("Grade", "গ্রেড"),
                                    pick("Year", "সাল"),
                                ].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wider text-ink-mute">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10 bg-white">
                            {results.map((r) => (
                                <tr key={r.id} className="hover:bg-brand-gray">
                                    <td className="whitespace-nowrap px-4 py-3 font-extrabold text-ink">{pick(r.studentName, r.studentNameBn)}</td>
                                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink-mute">{pick(r.exam, r.examBn)}</td>
                                    <td className="px-4 py-3 font-semibold text-ink-mute">{pick(r.subject, r.subjectBn)}</td>
                                    <td className="px-4 py-3">
                                        {r.grade === "A+" ? (
                                            <span className="inline-flex rounded-lg border-2 border-green-400 bg-brand-green-light px-2.5 py-0.5 text-xs font-extrabold text-green-700">{pick(r.grade, r.gradeBn)}</span>
                                        ) : (
                                            <span className="inline-flex rounded-lg border-2 border-line bg-brand-gray px-2.5 py-0.5 text-xs font-extrabold text-ink-mute">{pick(r.grade, r.gradeBn)}</span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink-mute">{r.year}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="rounded-2xl border-2 border-ink bg-brand-yellow p-10 text-center shadow-card sm:p-14">
                <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
                    {pick("Give your child the same edge.", "আপনার সন্তানকেও সেই সুযোগ দিন।")}
                </h2>
                <p className="mt-3 font-medium text-ink/70">
                    {pick("Reserve a seat today — no payment needed to hold your spot.", "আজই সিট বুক করুন — জায়গা ধরে রাখতে টাকা লাগে না।")}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/book" className={buttonClass("secondary", "lg")}>
                        {pick("Book a Seat", "সিট বুক করুন")} <FiArrowRight />
                    </Link>
                    <Link href="/courses" className={buttonClass("ghost", "lg")}>
                        {pick("Browse Courses", "কোর্স দেখুন")}
                    </Link>
                </div>
            </section>
        </main>
    );
}
