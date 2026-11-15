"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";
import { CourseCard } from "@/components/site/CourseCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

const LEVELS = ["Primary", "Junior", "JSC", "SSC", "HSC"] as const;

export default function CoursesPage() {
    const { language } = useLanguage();
    const { courses } = useContent();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);
    const currentLevel = searchParams.get("level");

    const filteredCourses = useMemo(() => {
        let result = courses;
        if (currentLevel && LEVELS.includes(currentLevel as typeof LEVELS[number])) {
            result = result.filter((c) => c.level === currentLevel);
        }
        return [...result].sort((a, b) => {
            const diff = LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level);
            return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
    }, [courses, currentLevel]);

    function setLevel(level: string | null) {
        const params = new URLSearchParams(searchParams.toString());
        if (level) params.set("level", level); else params.delete("level");
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <main className="container-page py-12 sm:py-16">
            <SectionHeading
                eyebrow={pick("Course Catalog", "কোর্স তালিকা")}
                title={pick("Find the right class.", "উপযুক্ত কোর্স খুঁজে নিন।")}
                description={pick("Schedules and seat counts are updated live.", "সময়সূচি আর সিট সংখ্যা সবসময় হাল-নাগাদ থাকে।")}
            />

            {/* Level filter pills */}
            <div className="sticky top-20 z-30 -mx-4 mt-8 border-y-2 border-ink bg-white px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setLevel(null)}
                        className={`whitespace-nowrap rounded-xl border-2 border-ink px-4 py-1.5 text-sm font-extrabold shadow-card-sm transition-all hover:-translate-y-0.5 ${!currentLevel ? "bg-brand-yellow" : "bg-white hover:bg-brand-gray"}`}
                    >
                        {pick("All Levels", "সব স্তর")}
                    </button>
                    {LEVELS.map((level) => (
                        <button
                            key={level}
                            onClick={() => setLevel(level)}
                            className={`whitespace-nowrap rounded-xl border-2 border-ink px-4 py-1.5 text-sm font-extrabold shadow-card-sm transition-all hover:-translate-y-0.5 ${currentLevel === level ? "bg-brand-yellow" : "bg-white hover:bg-brand-gray"}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="mt-16 text-center">
                    <p className="text-lg font-bold text-ink-mute">{pick("No courses match this filter.", "এই ফিল্টারে কোনো কোর্স নেই।")}</p>
                    <button onClick={() => setLevel(null)} className="mt-4 text-sm font-extrabold text-brand-blue hover:underline">
                        {pick("Clear filter", "ফিল্টার সরান")}
                    </button>
                </div>
            ) : (
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </main>
    );
}
