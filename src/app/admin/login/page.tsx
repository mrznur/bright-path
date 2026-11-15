"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";

export default function AdminLoginPage() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("submitting");
        setErrorMsg("");
        const formData = new FormData(e.currentTarget);
        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
        });
        if (res.ok) {
            router.replace("/admin");
        } else {
            const json = await res.json().catch(() => ({}));
            setErrorMsg(json.error ?? "Invalid credentials");
            setStatus("error");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-gray px-4">
            <div className="w-full max-w-sm rounded-2xl border-2 border-ink bg-white p-8 shadow-card">
                <p className="text-2xl font-extrabold text-ink">
                    Bright<span className="text-brand-blue">Path</span>
                    <span className="text-brand-yellow">.</span>
                </p>
                <h1 className="mt-1 text-lg font-bold text-ink-mute">Admin sign in</h1>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <Label htmlFor="email" required>Email</Label>
                        <Input id="email" name="email" type="email" required autoComplete="username" />
                    </div>
                    <div>
                        <Label htmlFor="password" required>Password</Label>
                        <Input id="password" name="password" type="password" required autoComplete="current-password" />
                    </div>
                    {status === "error" && <FieldError>{errorMsg}</FieldError>}
                    <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "submitting"}>
                        {status === "submitting" ? "Signing in…" : "Sign in"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
