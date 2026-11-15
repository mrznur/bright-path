"use client";

import { useContent } from "@/components/ContentProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FiPhone, FiMapPin, FiClock } from "react-icons/fi";

export default function ContactPage() {
    const { language } = useLanguage();
    const { site } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);

    return (
        <main className="container-page py-12 sm:py-20">
            <div className="grid gap-12 lg:grid-cols-2">
                <div>
                    <Eyebrow>{pick("Contact Us", "যোগাযোগ")}</Eyebrow>
                    <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">{pick("Let's talk.", "কথা বলি।")}</h1>
                    <p className="mt-4 text-lg font-medium text-ink-mute">{pick("Have a question or want to visit? Send us a message.", "কোনো প্রশ্ন আছে নাকি একবার ঘুরে দেখতে চান? আমাদের একটি বার্তা পাঠান।")}</p>

                    <div className="mt-10 space-y-5">
                        {[
                            { icon: <FiPhone />, label: pick("Phone", "ফোন"), value: pick(site.phone.en, site.phone.bn), href: site.tel },
                            { icon: <FiMapPin />, label: pick("Address", "ঠিকানা"), value: pick(site.address.en, site.address.bn), href: site.mapLink },
                            { icon: <FiClock />, label: pick("Hours", "খোলার সময়"), value: pick(site.hours.en, site.hours.bn), href: undefined },
                        ].map((item) => (
                            <div key={item.label} className="flex items-start gap-4 rounded-2xl border-2 border-ink bg-white p-5 shadow-card-sm">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-brand-yellow text-ink">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-wider text-ink-mute">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className="mt-0.5 text-base font-bold text-ink hover:text-brand-blue">{item.value}</a>
                                    ) : (
                                        <p className="mt-0.5 text-base font-bold text-ink">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border-2 border-ink bg-white p-6 shadow-card sm:p-8">
                    <h2 className="mb-6 text-2xl font-extrabold text-ink">{pick("Send an enquiry", "আপনার বার্তা পাঠান")}</h2>
                    <EnquiryForm />
                </div>
            </div>
        </main>
    );
}
