"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FiCheck } from "react-icons/fi";

const features = [
    { en: "12–18 students per batch", bn: "প্রতি ব্যাচে ১২–১৮ জন" },
    { en: "Qualified, experienced teachers", bn: "অভিজ্ঞ ও যোগ্য শিক্ষক" },
    { en: "Regular chapter tests", bn: "নিয়মিত অধ্যায় পরীক্ষা" },
    { en: "Bilingual (English & Bengali)", bn: "দ্বিভাষিক (ইংরেজি ও বাংলা)" },
];

export default function FeesPage() {
    const { language } = useLanguage();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);

    return (
        <main className="container-page py-12 sm:py-20">
            <SectionHeading
                eyebrow={pick("Pricing", "ফি")}
                title={pick("Simple, transparent fees.", "সহজ, সোজা ফি — কোনো গোলমাল নেই।")}
                description={pick(
                    "No hidden charges. One monthly fee covers everything. A one-time admission fee applies when you join.",
                    "কোনো লুকানো খরচ নেই। একটি মাসিক ফিতে সব হয়। ভর্তির সময় একবার ভর্তি ফি দিতে হয়।"
                )}
                align="center"
            />

            <div className="mt-14 grid gap-6 md:grid-cols-3">
                {/* Primary / Junior */}
                <div className="flex flex-col rounded-2xl border-2 border-ink bg-white shadow-card overflow-hidden">
                    <div className="bg-brand-yellow px-6 py-5 border-b-2 border-ink">
                        <h3 className="text-xl font-extrabold text-ink">{pick("Primary / Junior", "প্রাথমিক / জুনিয়র")}</h3>
                        <p className="text-sm font-bold text-ink/60">{pick("Classes 3–8", "শ্রেণি ৩–৮")}</p>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                        <p className="text-4xl font-extrabold text-ink">৳1,800<span className="ml-1 text-sm font-bold text-ink-mute">/ mo</span></p>
                        <ul className="mt-6 flex-1 space-y-3">
                            {features.map((f) => (
                                <li key={f.en} className="flex items-center gap-2 text-sm font-medium text-ink-mute">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-brand-yellow"><FiCheck className="text-xs" /></span>
                                    {pick(f.en, f.bn)}
                                </li>
                            ))}
                        </ul>
                        <Link href="/courses?level=Primary" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand-yellow px-4 py-2.5 text-sm font-extrabold text-ink shadow-card-sm hover:-translate-y-0.5 transition-all">
                            {pick("View Courses", "কোর্স দেখুন")}
                        </Link>
                    </div>
                </div>

                {/* SSC */}
                <div className="flex flex-col rounded-2xl border-2 border-ink bg-white shadow-card overflow-hidden">
                    <div className="bg-brand-blue px-6 py-5 border-b-2 border-ink">
                        <h3 className="text-xl font-extrabold text-white">{pick("SSC", "এসএসসি")}</h3>
                        <p className="text-sm font-bold text-white/70">{pick("Classes 9–10", "শ্রেণি ৯–১০")}</p>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                        <p className="text-4xl font-extrabold text-ink">৳2,200<span className="ml-1 text-sm font-bold text-ink-mute">/ mo</span></p>
                        <ul className="mt-6 flex-1 space-y-3">
                            {features.map((f) => (
                                <li key={f.en} className="flex items-center gap-2 text-sm font-medium text-ink-mute">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-brand-blue"><FiCheck className="text-xs text-white" /></span>
                                    {pick(f.en, f.bn)}
                                </li>
                            ))}
                        </ul>
                        <Link href="/courses?level=SSC" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand-blue px-4 py-2.5 text-sm font-extrabold text-white shadow-card-sm hover:-translate-y-0.5 transition-all">
                            {pick("View Courses", "কোর্স দেখুন")}
                        </Link>
                    </div>
                </div>

                {/* HSC */}
                <div className="flex flex-col rounded-2xl border-2 border-ink bg-white shadow-card overflow-hidden">
                    <div className="bg-brand-purple px-6 py-5 border-b-2 border-ink">
                        <h3 className="text-xl font-extrabold text-white">{pick("HSC", "এইচএসসি")}</h3>
                        <p className="text-sm font-bold text-white/70">{pick("Classes 11–12", "শ্রেণি ১১–১২")}</p>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                        <p className="text-4xl font-extrabold text-ink">৳2,800<span className="ml-1 text-sm font-bold text-ink-mute">/ mo</span></p>
                        <ul className="mt-6 flex-1 space-y-3">
                            {features.map((f) => (
                                <li key={f.en} className="flex items-center gap-2 text-sm font-medium text-ink-mute">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-brand-purple"><FiCheck className="text-xs text-white" /></span>
                                    {pick(f.en, f.bn)}
                                </li>
                            ))}
                        </ul>
                        <Link href="/courses?level=HSC" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand-purple px-4 py-2.5 text-sm font-extrabold text-white shadow-card-sm hover:-translate-y-0.5 transition-all">
                            {pick("View Courses", "কোর্স দেখুন")}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Extra info */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-ink bg-brand-gray p-8 shadow-card-sm text-center">
                    <h2 className="text-xl font-extrabold text-ink">{pick("One-time admission fee", "ভর্তি ফি (একবারের)")}</h2>
                    <p className="mt-3 text-4xl font-extrabold text-brand-blue">৳500</p>
                    <p className="mt-1 text-sm font-medium text-ink-mute">{pick("Per child, charged once at joining.", "প্রতি শিক্ষার্থী, ভর্তির সময় একবার।")}</p>
                </div>
                <div className="rounded-2xl border-2 border-ink bg-brand-yellow p-8 shadow-card text-center">
                    <h2 className="text-xl font-extrabold text-ink">{pick("Sibling discount", "ভাই-বোন ছাড়")}</h2>
                    <p className="mt-3 text-4xl font-extrabold text-ink">10% off</p>
                    <p className="mt-1 text-sm font-medium text-ink/70">{pick("Monthly fee for the 2nd child. Excludes admission fee.", "দ্বিতীয় সন্তানের মাসিক ফিতে। ভর্তি ফিতে ছাড় নেই।")}</p>
                </div>
            </div>
        </main>
    );
}
