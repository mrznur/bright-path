"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Course, FAQ, Teacher, Testimonial, StudentResult, SiteConfig } from "@/types";
import { courses as seedCourses } from "@/data/courses";
import { teachers as seedTeachers } from "@/data/teachers";
import { testimonials as seedTestimonials } from "@/data/testimonials";
import { faqs as seedFaqs } from "@/data/faqs";
import { results as seedResults } from "@/data/results";
import { SITE } from "@/data/site";

export type Content = { courses: Course[]; teachers: Teacher[]; testimonials: Testimonial[]; faqs: FAQ[]; results: StudentResult[]; site: SiteConfig; };
const FALLBACK: Content = { courses: seedCourses, teachers: seedTeachers, testimonials: seedTestimonials, faqs: seedFaqs, results: seedResults, site: SITE };
const CACHE_KEY = "brightpath-content-v4";
const ContentContext = createContext<Content | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<Content>(FALLBACK);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(CACHE_KEY);
            if (raw) {
                const cached = JSON.parse(raw);
                if (cached.content && cached.expiresAt > Date.now()) setContent(cached.content);
            }
        } catch { }

        const controller = new AbortController();
        fetch("/api/content", { signal: controller.signal, cache: "no-store" })
            .then((res) => res.ok ? res.json() : Promise.reject())
            .then((fresh: Content) => {
                setContent(fresh);
                try { window.localStorage.setItem(CACHE_KEY, JSON.stringify({ content: fresh, expiresAt: Date.now() + 5 * 60 * 1000 })); } catch { }
            })
            .catch(() => { });

        return () => controller.abort();
    }, []);

    return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
    const content = useContext(ContentContext);
    if (!content) throw new Error("useContent must be used inside ContentProvider");
    return content;
}