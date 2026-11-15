"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, FieldError } from "@/components/ui/Field";
import { Toast, useToast } from "@/components/ui/Toast";
import { FiCheckCircle } from "react-icons/fi";

export function EnquiryForm() {
    const { language } = useLanguage();
    const { courses } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);
    const { toast, show: showToast, clear: clearToast } = useToast();

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("submitting");
        setErrorMsg("");
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        try {
            const res = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            setStatus("success");
            showToast(
                pick("Message sent! We'll reply within 24 hours.", "বার্তা পৌঁছেছে! ২৪ ঘণ্টার মধ্যে উত্তর দেব।"),
                "success"
            );
        } catch {
            setStatus("error");
            const msg = pick("Something went wrong. Please call us.", "কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে ফোন করুন।");
            setErrorMsg(msg);
            showToast(msg, "error");
        }
    }

    if (status === "success") {
        return (
            <>
                <div className="rounded-2xl border-2 border-ink bg-brand-green-light p-8 text-center">
                    <FiCheckCircle className="mx-auto text-5xl text-brand-green" />
                    <h3 className="mt-4 text-2xl font-extrabold text-ink">
                        {pick("Message received!", "আপনার বার্তা পেয়েছি!")}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-ink-mute">
                        {pick("We'll get back to you within 24 hours.", "২৪ ঘণ্টার মধ্যে আমরা ফিরে কথা বলব।")}
                    </p>
                </div>
                {toast && <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />}
            </>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div>
                    <Label htmlFor="name" required>{pick("Your Name", "আপনার নাম")}</Label>
                    <Input id="name" name="name" required autoComplete="name" placeholder={pick("e.g. Rahim Uddin", "যেমন: রহিম উদ্দিন")} />
                </div>

                {/* Phone */}
                <div>
                    <Label htmlFor="phone" required>{pick("Phone Number", "ফোন নম্বর")}</Label>
                    <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="01XXXXXXXXX" />
                </div>

                {/* Class + Subject */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="classLevel" required>{pick("Student's Class", "শিক্ষার্থীর শ্রেণি")}</Label>
                        <Select id="classLevel" name="classLevel" required defaultValue="">
                            <option value="" disabled>{pick("Select class", "শ্রেণি বেছে নিন")}</option>
                            <option value="3-5">{pick("Classes 3–5", "শ্রেণি ৩–৫")}</option>
                            <option value="6-7">{pick("Classes 6–7", "শ্রেণি ৬–৭")}</option>
                            <option value="8">{pick("Class 8", "শ্রেণি ৮")}</option>
                            <option value="9-10">{pick("Classes 9–10", "শ্রেণি ৯–১০")}</option>
                            <option value="11-12">{pick("Classes 11–12", "শ্রেণি ১১–১২")}</option>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="subject" required>{pick("Interested Subject", "যে বিষয়ে আগ্রহী")}</Label>
                        <Input id="subject" name="subject" required placeholder={pick("e.g. Physics, Math", "যেমন: পদার্থবিজ্ঞান, গণিত")} />
                    </div>
                </div>

                {/* Course */}
                <div>
                    <Label htmlFor="course" required>{pick("Which course interests you?", "কোন কোর্সে আগ্রহ আছে?")}</Label>
                    <Select id="course" name="course" required defaultValue="">
                        <option value="" disabled>{pick("Select a course", "একটি কোর্স বেছে নিন")}</option>
                        {Array.from(new Map(courses.map(c => [c.id, c])).values()).map((c) => (
                            <option key={c.id} value={c.title}>{c.title} ({pick(c.level, c.levelBn)})</option>
                        ))}
                        <option value="Other">{pick("Not sure / Other", "নিশ্চিত না / অন্যান্য")}</option>
                    </Select>
                </div>

                {/* Question */}
                <div>
                    <Label htmlFor="question">{pick("Your Question", "আপনার প্রশ্ন")} <span className="font-normal text-ink-mute">({pick("optional", "ঐচ্ছিক")})</span></Label>
                    <Textarea id="question" name="question" rows={3} placeholder={pick("What would you like to know?", "আপনি কী জানতে চান?")} />
                </div>

                {status === "error" && <FieldError>{errorMsg}</FieldError>}

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={status === "submitting"}
                >
                    {status === "submitting"
                        ? pick("Sending…", "পাঠানো হচ্ছে…")
                        : pick("Send Enquiry", "বার্তা পাঠান")}
                </Button>
            </form>

            {toast && <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />}
        </>
    );
}
