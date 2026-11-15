import { cn } from "@/lib/cn";

type Tone = "neutral" | "yellow" | "purple" | "blue" | "green" | "red";

const tones: Record<Tone, string> = {
    neutral: "bg-brand-gray   text-ink          border-ink/20",
    yellow:  "bg-brand-yellow text-ink          border-ink",
    purple:  "bg-brand-purple-light text-brand-purple border-brand-purple/30",
    blue:    "bg-brand-blue-light  text-brand-blue   border-brand-blue/30",
    green:   "bg-brand-green-light text-green-700    border-green-300",
    red:     "bg-brand-red-light   text-brand-red    border-brand-red/30",
};

export function Chip({
    tone = "neutral",
    className,
    children,
}: {
    tone?: Tone;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-0.5 text-xs font-extrabold",
                tones[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}
