"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, FieldError } from "@/components/ui/Field";
import { Toast, useToast } from "@/components/ui/Toast";
import { FiCheckCircle } from "react-icons/fi";

/** Parse a course's `classes` string (e.g. "Classes 9–10" or "Class 8") into individual class options. */
function parseClassOptions(classesStr: string, bangla: boolean): { value: string; label: string }[] {
    const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const toBn = (n: number) => n.toString().split("").map((d) => bn[parseInt(d)] ?? d).join("");

    // Match "Classes 3–5" or "Classes 9-10" (en-dash or hyphen)
    const rangeMatch = classesStr.match(/Classes?\s+(\d+)\s*[–-]\s*(\d+)/i);
    if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        const opts: { value: string; label: string }[] = [];
        for (let i = start; i <= end; i++) {
            opts.push({
                value: `Class ${i}`,
                label: bangla ? `${toBn(i)} শ্রেণি` : `Class ${i}`,
            });
        }
        return opts;
    }
    // Match "Class 8"
    const singleMatch = classesStr.match(/Class\s+(\d+)/i);
    if (singleMatch) {
        const num = parseInt(singleMatch[1]);
        return [{ value: `Class ${num}`, label: bangla ? `${toBn(num)} শ্রেণি` : `Class ${num}` }];
    }
    return [];
}

export function BookingForm() {
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const { courses } = useContent();
    const bangla = language === "bn";
    const pick = (en: string, bn: string) => (bangla ? bn : en);
    const { toast, show: showToast, clear: clearToast } = useToast();

    const initialCourseId = searchParams.get("courseId") || "";
    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const selectedCourse = courses.find(c => c.id === selectedCourseId);
    const availableBatches = selectedCourse?.batches ?? [];

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("submitting");
        setErrorMsg("");
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            setStatus("success");
            showToast(
                pick("Seat reserved! We'll call you to confirm.", "সিট বুক হয়েছে! আমরা ফোন করে সব নিশ্চিত করব।"),
                "success"
            );
        } catch {
            setStatus("error");
            const msg = pick("Couldn't book the seat. Please call us.", "সিট বুক করা গেল না। অনুগ্রহ করে ফোন করুন।");
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
                        {pick("Seat Reserved!", "সিট বুক হয়েছে!")}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-ink-mute">
                        {pick("Our team will call you shortly to confirm your admission.", "আমরা শীঘ্রই ফোন করে ভর্তি নিশ্চিত করব।")}
                    </p>
                </div>
                {toast && <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />}
            </>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Course */}
                <div>
                    <Label htmlFor="courseId" required>{pick("Course", "কোর্স")}</Label>
                    <Select id="courseId" name="courseId" required value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                        <option value="" disabled>{pick("Select a course", "একটি কোর্স বেছে নিন")}</option>
                        {Array.from(new Map(courses.map(c => [c.id, c])).values()).map((c) => (
                            <option key={c.id} value={c.id}>{c.title} — {pick(c.level, c.levelBn)}</option>
                        ))}
                    </Select>
                </div>

                {/* Batch */}
                {selectedCourseId && (
                    <div>
                        <Label htmlFor="batchId" required>{pick("Batch", "ব্যাচ")}</Label>
                        <Select id="batchId" name="batchId" required defaultValue="">
                            <option value="" disabled>{pick("Select a batch", "একটি ব্যাচ বেছে নিন")}</option>
                            {availableBatches.map((b) => (
                                <option key={b.id} value={b.id} disabled={b.isFull}>
                                    {b.days} · {b.time}{b.isFull ? ` (${pick("Full", "পূর্ণ")})` : ` — ${b.batchSize - b.enrolledCount} ${pick("seats left", "সিট খালি")}`}
                                </option>
                            ))}
                        </Select>
                    </div>
                )}

                {/* Parent + Student names */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="parentName" required>{pick("Parent / Guardian Name", "অভিভাবকের নাম")}</Label>
                        <Input id="parentName" name="parentName" required autoComplete="name" />
                    </div>
                    <div>
                        <Label htmlFor="studentName" required>{pick("Student Name", "শিক্ষার্থীর নাম")}</Label>
                        <Input id="studentName" name="studentName" required />
                    </div>
                </div>

                {/* Phone + Class */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="phone" required>{pick("Phone Number", "ফোন নম্বর")}</Label>
                        <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="01XXXXXXXXX" />
                    </div>
                    <div>
                        <Label htmlFor="classLevel" required>{pick("Student's Class", "শিক্ষার্থীর শ্রেণি")}</Label>
                        {selectedCourse ? (
                            <Select id="classLevel" name="classLevel" required defaultValue="">
                                <option value="" disabled>{pick("Select class", "শ্রেণি বেছে নিন")}</option>
                                {parseClassOptions(selectedCourse.classes, bangla).map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </Select>
                        ) : (
                            <Select id="classLevel" name="classLevel" required defaultValue="" disabled>
                                <option value="">{pick("Select a course first", "আগে কোর্স বেছে নিন")}</option>
                            </Select>
                        )}
                    </div>
                </div>

                {/* Payment */}
                <div>
                    <Label htmlFor="paymentMethod" required>{pick("Payment Method", "ফি পরিশোধের পদ্ধতি")}</Label>
                    <p className="mb-2 text-center text-xs font-medium text-ink-mute">{pick("Paid in person at the centre — not online.", "ফি দিতে হয় কেন্দ্রে এসে — অনলাইনে নয়।")}</p>
                    <Select id="paymentMethod" name="paymentMethod" required defaultValue="bKash">
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Bank transfer">{pick("Bank transfer / Cash", "ব্যাংক ট্রান্সফার / নগদ")}</option>
                    </Select>
                </div>

                {/* Note */}
                <div>
                    <Label htmlFor="note">{pick("Additional Note", "অতিরিক্ত নোট")} <span className="font-normal text-ink-mute">({pick("optional", "ঐচ্ছিক")})</span></Label>                    <Textarea id="note" name="note" rows={2} placeholder={pick("Any questions or special requirements?", "কোনো প্রশ্ন বা বিশেষ প্রয়োজন?")} />
                </div>

                {status === "error" && <FieldError>{errorMsg}</FieldError>}

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={status === "submitting" || !selectedCourseId}
                >
                    {status === "submitting"
                        ? pick("Reserving your seat…", "সিট বুক হচ্ছে…")
                        : pick("Confirm Booking", "সিট নিশ্চিত করুন")}
                </Button>
            </form>

            {toast && <Toast message={toast.message} type={toast.type} onDismiss={clearToast} />}
        </>
    );
}
