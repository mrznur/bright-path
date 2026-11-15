"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function Accordion({
    items,
    defaultOpenId,
    className,
}: {
    items: { id: string; question: string; answer: React.ReactNode }[];
    defaultOpenId?: string;
    className?: string;
}) {
    const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

    return (
        <div className={cn("space-y-3", className)}>
            {items.map((item) => {
                const open = openId === item.id;
                return (
                    <div
                        key={item.id}
                        className={cn(
                            "overflow-hidden rounded-xl border-2 border-ink transition-shadow",
                            open ? "shadow-card" : "shadow-card-sm"
                        )}
                    >
                        <button
                            type="button"
                            aria-expanded={open}
                            onClick={() => setOpenId(open ? null : item.id)}
                            className="flex w-full items-center justify-between gap-4 bg-white px-6 py-5 text-left transition-colors hover:bg-brand-gray"
                        >
                            <span className="text-sm font-extrabold text-ink sm:text-base">
                                {item.question}
                            </span>
                            <span
                                className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-brand-yellow text-xl font-extrabold leading-none text-ink transition-transform duration-300",
                                    open && "rotate-45"
                                )}
                            >
                                +
                            </span>
                        </button>
                        {open && (
                            <div className="border-t-2 border-ink/10 bg-brand-gray px-6 py-4 text-sm font-medium leading-relaxed text-ink-mute">
                                {item.answer}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
