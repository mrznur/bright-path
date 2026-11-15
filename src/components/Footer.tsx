"use client";

import Link from "next/link";
import { FiPhone, FiMapPin, FiClock, FiFacebook } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

export default function Footer() {
    const { language } = useLanguage();
    const { site } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);

    return (
        <footer className="border-t-2 border-ink bg-ink text-white">
            <div className="container-page py-14 sm:py-16">
                <div className="grid gap-12 md:grid-cols-12">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <p className="text-3xl font-extrabold">
                            Bright<span className="text-brand-blue">Path</span>
                            <span className="text-brand-yellow">.</span>
                        </p>
                        <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-white/60">
                            {pick(
                                "Bilingual coaching for Classes 3–12 in Dhanmondi, Dhaka. Small batches, qualified teachers.",
                                "ধানমন্ডি, ঢাকায় তৃতীয় থেকে দ্বাদশ শ্রেণির শিক্ষার্থীদের জন্য দ্বিভাষিক কোচিং — ছোট ব্যাচ, অভিজ্ঞ শিক্ষক।"
                            )}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href={site.tel}
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-yellow bg-brand-yellow px-4 py-2 text-xs font-extrabold text-ink shadow-card-sm transition-all hover:-translate-y-0.5"
                            >
                                <FiPhone /> {pick("Call us", "ফোন করুন")}
                            </a>
                            <a
                                href={site.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-4 py-2 text-xs font-extrabold text-white/70 transition-all hover:border-white hover:text-white"
                            >
                                <FiFacebook /> Facebook
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-3">
                        <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-brand-yellow">Explore</p>
                        <ul className="space-y-2.5 text-sm font-medium text-white/60">
                            {[
                                { href: "/courses",          label: pick("Courses", "কোর্স") },
                                { href: "/fees-admission",   label: pick("Fees & Admission", "ফি ও ভর্তি") },
                                { href: "/teachers-results", label: pick("Teachers & Results", "শিক্ষক ও ফলাফল") },
                                { href: "/faq",              label: pick("FAQ", "সাধারণ প্রশ্ন") },
                                { href: "/contact",          label: pick("Contact", "যোগাযোগ") },
                                { href: "/book",             label: pick("Book a Seat", "সিট বুক করুন") },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="transition-colors hover:text-white">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-4">
                        <p className="mb-4 text-xs font-extrabold uppercase tracking-widest text-brand-yellow">Visit</p>
                        <ul className="space-y-3 text-sm font-medium text-white/60">
                            <li className="flex items-start gap-2.5">
                                <FiMapPin className="mt-0.5 shrink-0 text-brand-yellow" />
                                <a href={site.mapLink} target="_blank" rel="noreferrer" className="hover:text-white">
                                    {pick(site.address.en, site.address.bn)}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <FiPhone className="shrink-0 text-brand-yellow" />
                                <a href={site.tel} className="hover:text-white">{pick(site.phone.en, site.phone.bn)}</a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <FiClock className="mt-0.5 shrink-0 text-brand-yellow" />
                                <span>{pick(site.hours.en, site.hours.bn)}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs font-medium text-white/40">
                    © {new Date().getFullYear()} BrightPath Coaching Center. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
