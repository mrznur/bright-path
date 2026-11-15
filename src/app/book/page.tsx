"use client";

import { useContent } from "@/components/ContentProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { BookingForm } from "@/components/site/BookingForm";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FiPhone, FiCheck } from "react-icons/fi";

export default function BookPage() {
    const { language } = useLanguage();
    const { site } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);

    return (
        <main className="container-page py-12 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <Eyebrow>{pick("Admission", "ভর্তি")}</Eyebrow>
                    <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">{pick("Reserve a seat.", "সিট বুক করুন।")}</h1>
                    <p className="mt-4 text-lg font-medium text-ink-mute">{pick("Select a batch, fill in the student details, and we'll call you to confirm.", "ব্যাচ বেছে নিন, তথ্য দিন — আমরা ফোন করে সব নিশ্চিত করব।")}</p>

                    <ul className="mt-6 space-y-3">
                        {[
                            pick("No payment required online", "অনলাইনে টাকা লাগে না"),
                            pick("We call within 24 hours", "২৪ ঘণ্টায় ফোন করব"),
                            pick("Pay via bKash, Nagad or Cash", "বিকাশ, নগদ বা হাতে নগদ"),
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm font-bold text-ink-soft">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-brand-yellow">
                                    <FiCheck className="text-xs" />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <a href={site.tel} className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-brand-blue hover:underline">
                        <FiPhone /> {pick("Or call us to book", "অথবা ফোন করেই বুক করুন")}
                    </a>
                </div>

                <div className="lg:col-span-7">
                    <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-card sm:p-8">
                        <BookingForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
