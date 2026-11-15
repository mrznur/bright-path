import { cn } from "@/lib/cn";

export function SeatMeter({
    enrolled,
    capacity,
    labelLeft = "Seats",
    labelFull = "Full",
    labelLeftSuffix = "left",
    className,
}: {
    enrolled: number;
    capacity: number;
    labelLeft?: string;
    labelFull?: string;
    labelLeftSuffix?: string;
    className?: string;
}) {
    const pct = capacity > 0 ? Math.min(100, Math.round((enrolled / capacity) * 100)) : 0;
    const seatsLeft = Math.max(capacity - enrolled, 0);
    const full = seatsLeft === 0;
    const bar = full ? "bg-brand-red" : pct >= 75 ? "bg-brand-yellow" : "bg-brand-blue";

    return (
        <div className={className}>
            <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-ink-mute">{labelLeft}</span>
                <span className={full ? "text-brand-red" : "text-ink-soft"}>
                    {full ? labelFull : `${seatsLeft} ${labelLeftSuffix}`}
                </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full border border-ink/20 bg-brand-gray">
                <div
                    className={cn("h-full rounded-full transition-[width] duration-500", bar)}
                    style={{ width: `${pct}%` }}
                    aria-hidden
                />
            </div>
        </div>
    );
}
