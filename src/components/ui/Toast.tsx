"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import { cn } from "@/lib/cn";

export type ToastType = "success" | "error";

interface ToastProps {
    message: string;
    type: ToastType;
    onDismiss: () => void;
    duration?: number; // ms, default 4000
}

export function Toast({ message, type, onDismiss, duration = 4000 }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const t1 = setTimeout(() => setVisible(true), 10);
        // Auto-dismiss
        const t2 = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
        }, duration);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [duration, onDismiss]);

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={cn(
                "fixed bottom-6 right-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border-2 border-ink p-4 shadow-card transition-all duration-300 sm:right-6",
                type === "success" ? "bg-brand-green-light" : "bg-brand-red-light",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
        >
            {type === "success"
                ? <FiCheckCircle className="mt-0.5 shrink-0 text-xl text-brand-green" />
                : <FiAlertCircle className="mt-0.5 shrink-0 text-xl text-brand-red" />
            }
            <p className="flex-1 text-sm font-bold text-ink">{message}</p>
            <button
                onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
                className="ml-1 shrink-0 text-ink-mute hover:text-ink"
                aria-label="Dismiss"
            >
                <FiX />
            </button>
        </div>
    );
}

/** Hook-style helper: returns [toast state, show(), clear()] */
export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    function show(message: string, type: ToastType) {
        setToast({ message, type });
    }

    function clear() {
        setToast(null);
    }

    return { toast, show, clear };
}
