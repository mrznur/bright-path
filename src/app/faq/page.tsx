"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";
import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonClass } from "@/components/ui/Button";
import { FiPhone } from "react-icons/fi";

export default function FAQPage() {
    const { language } = useLanguage();
    const { faqs, site } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);

    const items = faqs.map((faq) => ({
        id: faq.id,
        question: bangla && faq.questionBn ? faq.questionBn : faq.question,
        answer: bangla && faq.answerBn ? faq.answerBn : faq.answer,
    }));

    return (
        <main className="container-page py-12 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <SectionHeading
                        eyebrow={pick("Support", "সহায়তা")}
                        title={pick("Questions, answered.", "সব প্রশ্নের উত্তর।")}
                        description={pick("Everything about admissions, schedules, and fees.", "ভর্তি, সময়সূচি আর ফি — যা জানা দরকার, সব এখানে।")}
                    />
                    <div className="mt-8 rounded-2xl border-2 border-ink bg-brand-yellow p-6 shadow-card">
                        <h3 className="font-extrabold text-ink">{pick("Still confused?", "এখনও কিছু জানতে চান?")}</h3>
                        <p className="mt-1 text-sm font-medium text-ink/70">{pick("We are just a phone call away.", "একটি ফোনেই সব জেনে নিন।")}</p>
                        <a href={site.tel} className={buttonClass("secondary", "md", "mt-4 w-full")}>
                            <FiPhone /> {pick("Call us", "ফোন করুন")}
                        </a>
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <Accordion items={items} defaultOpenId={faqs[0]?.id} />
                </div>
            </div>
        </main>
    );
}
