"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiPhone, FiClock, FiUser, FiCheck, FiArrowLeft } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";
import { buttonClass } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SeatMeter } from "@/components/ui/SeatMeter";
import { courseSeatSummary } from "@/lib/course-utils";

const LEVEL_TONE: Record<string, "yellow" | "blue" | "purple" | "green"> = {
    Primary: "yellow", Junior: "blue", JSC: "blue", SSC: "purple", HSC: "green",
};

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { courses, site } = useContent();
    const { language } = useLanguage();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);
    const course = courses.find((c) => c.id === id);

    if (!course) {
        return (
            <main className="container-page py-24 text-center">
                <p className="text-6xl font-extrabold text-brand-yellow">404</p>
                <h1 className="mt-4 text-3xl font-extrabold text-ink">Course not found</h1>
                <Link href="/courses" className={buttonClass("primary", "md", "mt-6")}>Back to courses</Link>
            </main>
        );
    }

    const tone = LEVEL_TONE[course.level] ?? "yellow";
    const seats = courseSeatSummary(course);
    const primary = seats.primary;

    return (
        <main className="container-page py-10 lg:py-16">
            <Link href="/courses" className="mb-6 inline-flex items-center gap-1.5 text-sm font-extrabold text-ink-mute hover:text-ink">
                <FiArrowLeft /> {pick("Back to all courses", "সব কোর্সে ফিরে যান")}
            </Link>
            <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-3">
                        <Chip tone={tone}>{pick(course.level, course.levelBn)}</Chip>
                        <span className="text-sm font-bold text-ink-mute">{pick(course.classes, course.classesBn)}</span>
                    </div>
                    <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">{pick(course.title, course.titleBn)}</h1>
                    <p className="mt-2 text-lg font-bold text-ink-mute">{pick(course.subject, course.subjectBn)}</p>
                    <p className="mt-6 text-base font-medium leading-relaxed text-ink-soft">{pick(course.description, course.descriptionBn)}</p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-card-sm">
                            <FiUser className="text-2xl text-brand-blue" />
                            <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-ink-mute">{pick("Teacher", "শিক্ষক")}</p>
                            <p className="mt-1 text-lg font-extrabold text-ink">{pick(course.teacherName, course.teacherNameBn)}</p>
                        </div>
                        <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-card-sm">
                            <FiClock className="text-2xl text-brand-blue" />
                            <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-ink-mute">{pick("Schedule", "সময়সূচি")}</p>                            <p className="mt-1 text-lg font-extrabold text-ink">
                                {primary ? pick(primary.days, primary.daysBn) : pick("To be announced", "শীঘ্রই জানানো হবে")}
                            </p>
                            <p className="text-sm font-medium text-ink-mute">
                                {primary ? pick(primary.time, primary.timeBn) : ""}
                                {seats.batchCount > 1 ? ` · ${seats.batchCount} ${pick("batches", "ব্যাচ")}` : ""}
                            </p>
                        </div>
                    </div>

                    {course.batches.length > 0 && (
                        <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-5 shadow-card-sm">
                            <h3 className="font-extrabold text-ink">{pick("Batches", "ব্যাচ")}</h3>
                            <ul className="mt-3 space-y-3">
                                {course.batches.map((b) => (
                                    <li key={b.id} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="font-medium text-ink">
                                            {pick(b.days, b.daysBn)} · {pick(b.time, b.timeBn)}
                                        </span>
                                        <span className={`font-extrabold ${b.isFull ? "text-brand-red" : "text-ink-mute"}`}>
                                            {b.isFull ? pick("Full", "পূর্ণ") : `${b.batchSize - b.enrolledCount} ${pick("seats left", "সিট খালি")}`}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-6 rounded-2xl border-2 border-ink bg-brand-gray p-5 shadow-card-sm">
                        <h3 className="font-extrabold text-ink">{pick("What you will learn", "আপনি যা শিখবেন")}</h3>
                        <ul className="mt-3 space-y-2 text-sm font-medium text-ink-mute">
                            {[pick("Full board syllabus covered","সম্পূর্ণ বোর্ড সিলেবাস"), pick("Regular chapter tests","নিয়মিত অধ্যায় পরীক্ষা"), pick("Exam strategy & model tests","পরীক্ষার কৌশল ও মডেল টেস্ট")].map((item) => (
                                <li key={item} className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-brand-yellow">
                                        <FiCheck className="text-xs" />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sticky booking card */}
                <div className="lg:col-span-5">
                    <div className="sticky top-28 rounded-2xl border-2 border-ink bg-white shadow-card overflow-hidden">
                        <div className="bg-brand-blue p-6 text-white sm:p-8">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-white/60">{pick("Monthly Fee", "মাসিক ফি")}</p>
                            <p className="mt-2 text-4xl font-extrabold">৳{course.monthlyFee.toLocaleString(bangla ? "bn-BD" : "en-US")}</p>
                        </div>
                        <div className="p-6 sm:p-8">
                            <SeatMeter enrolled={seats.enrolledCount} capacity={seats.batchSize} className="mb-6" labelLeft={pick("Batch capacity","ব্যাচ")} labelLeftSuffix={pick("seats left","সিট খালি")} labelFull={pick("Waitlist only","শুধু অপেক্ষামাণ")} />
                            <div className="space-y-3">
                                <button onClick={() => router.push(`/book?courseId=${course.id}`)} disabled={seats.isFull} className={buttonClass("primary", "lg", "w-full")}>
                                    {seats.isFull ? pick("Join Waitlist", "অপেক্ষামাণ তালিকায় যোগ দিন") : pick("Reserve a Seat", "সিট বুক করুন")}
                                </button>
                                <a href={site.tel} className={buttonClass("ghost", "lg", "w-full")}>
                                    <FiPhone /> {pick("Call to ask", "ফোন করে জানতে পারেন")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
