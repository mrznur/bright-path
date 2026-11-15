"use client";

import Link from "next/link";
import type { Course } from "@/types";
import { useLanguage } from "@/components/LanguageProvider";
import { courseSeatSummary } from "@/lib/course-utils";
import { FiArrowRight, FiUsers, FiCalendar, FiBook } from "react-icons/fi";

const LEVEL_HEADER: Record<string, { bg: string; text: string; badge: string }> = {
    Primary: { bg: "bg-brand-yellow",  text: "text-ink",   badge: "bg-ink text-brand-yellow" },
    Junior:  { bg: "bg-brand-blue",    text: "text-white", badge: "bg-white text-brand-blue" },
    JSC:     { bg: "bg-brand-blue",    text: "text-white", badge: "bg-white text-brand-blue" },
    SSC:     { bg: "bg-brand-purple",  text: "text-white", badge: "bg-white text-brand-purple" },
    HSC:     { bg: "bg-brand-green",   text: "text-white", badge: "bg-white text-green-800" },
};

function SeatDots({ enrolled, capacity }: { enrolled: number; capacity: number }) {
    const dots = Math.min(capacity, 15);
    const filled = Math.min(enrolled, dots);
    return (
        <div className="flex flex-wrap gap-1">
            {Array.from({ length: dots }).map((_, i) => (
                <span
                    key={i}
                    className={`inline-block h-2.5 w-2.5 rounded-full border border-ink/20 ${i < filled ? "bg-ink" : "bg-white"}`}
                />
            ))}
        </div>
    );
}

export function CourseCard({ course }: { course: Course }) {
    const { language } = useLanguage();
    const bangla = language === "bn";
    const pick = (en: string, bn?: string) => (bangla && bn ? bn : en);
    const h = LEVEL_HEADER[course.level] ?? LEVEL_HEADER.Primary;
    const { batchSize, enrolledCount, isFull, primary, batchCount } = courseSeatSummary(course);
    const seatsLeft = Math.max(0, batchSize - enrolledCount);
    const pct = batchSize > 0 ? Math.round((enrolledCount / batchSize) * 100) : 0;

    return (
        <article className="flex h-full flex-col rounded-2xl border-2 border-ink shadow-card transition-all duration-150 hover:-translate-y-1 hover:shadow-card-hover overflow-hidden bg-white">

            {/* ── Coloured header ── */}
            <div className={`${h.bg} px-5 pt-5 pb-5`}>
                <div className="flex items-start justify-between gap-2">
                    <span className={`inline-flex rounded-lg border-2 border-ink/30 px-2.5 py-0.5 text-xs font-extrabold ${h.badge}`}>
                        {pick(course.level, course.levelBn)}
                    </span>
                    <span className={`text-xl font-extrabold tabular-nums ${h.text}`}>
                        ৳{course.monthlyFee.toLocaleString(bangla ? "bn-BD" : "en-US")}
                        <span className="ml-1 text-xs font-semibold opacity-60">{pick("/month", "/মাস")}</span>
                    </span>
                </div>
                <h3 className={`mt-3 text-xl font-extrabold leading-snug ${h.text}`}>
                    {pick(course.title, course.titleBn)}
                </h3>
                <p className={`mt-1 text-sm font-semibold opacity-70 ${h.text}`}>
                    {pick(course.classes, course.classesBn)}
                </p>
            </div>

            {/* ── Seat availability ── */}
            <div className="bg-brand-gray px-5 py-3 border-b-2 border-ink/10">
                <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-extrabold text-ink">
                        <FiUsers size={14} />
                        {isFull ? (
                            <span className="text-brand-red">{pick("Batch full", "ব্যাচ পূর্ণ")}</span>
                        ) : (
                            <>
                                <span className="text-brand-blue">{seatsLeft}</span>
                                <span className="font-semibold text-ink-mute">
                                    {pick(` of ${batchSize} seats open`, ` / ${batchSize} সিট খালি`)}
                                </span>
                            </>
                        )}
                    </span>
                    <span className={`border-2 px-2 py-0.5 text-xs font-extrabold ${
                        isFull          ? "border-brand-red    bg-brand-red-light   text-brand-red"
                        : pct >= 80            ? "border-amber-400    bg-amber-50          text-amber-700"
                                               : "border-green-400    bg-brand-green-light text-green-700"
                    }`}>
                        {isFull ? pick("Waitlist", "অপেক্ষামাণ") : pct >= 80 ? pick("Filling fast", "দ্রুত ভরছে") : pick("Enrol now", "ভর্তি নিন")}
                    </span>
                </div>
                <div className="mt-2">
                    <SeatDots enrolled={enrolledCount} capacity={batchSize} />
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div
                        className={`h-full rounded-full transition-[width] duration-500 ${
                            isFull ? "bg-brand-red" : pct >= 80 ? "bg-amber-400" : "bg-brand-blue"
                        }`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* ── Body: subject + schedule + description ── */}
            <div className="flex flex-1 flex-col gap-3 px-5 py-4">
                {/* Subject & schedule as clean icon rows */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-ink-mute">
                        <FiBook size={13} className="shrink-0 text-ink-faint" />
                        <span className="font-semibold text-ink">{pick(course.subject, course.subjectBn)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-mute">
                        <FiCalendar size={13} className="shrink-0 text-ink-faint" />
                        <span>
                            {primary
                                ? <>
                                    {pick(primary.days, primary.daysBn)}
                                    <span className="mx-1.5 text-ink-faint">·</span>
                                    {pick(primary.time, primary.timeBn)}
                                    {batchCount > 1 ? ` · ${batchCount} ${pick("batches", "ব্যাচ")}` : ""}
                                </>
                                : pick("Schedule TBA", "সময়সূচি শীঘ্রই")}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="flex-1 text-sm font-medium leading-relaxed text-ink-mute line-clamp-2">
                    {pick(course.description, course.descriptionBn)}
                </p>
            </div>

            {/* ── CTA ── */}
            <div className="border-t-2 border-ink/10 px-5 py-4">
                <Link
                    href={`/courses/${course.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white shadow-card-sm transition-all hover:-translate-y-0.5 hover:shadow-card active:translate-y-0"
                >
                    {pick("See Full Details", "বিস্তারিত দেখুন")} <FiArrowRight />
                </Link>
            </div>
        </article>
    );
}
