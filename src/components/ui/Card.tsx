import { cn } from "@/lib/cn";

/** Basic card: white bg, 2px black border, hard drop-shadow */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("rounded-2xl border-2 border-ink bg-white shadow-card", className)}>
            {children}
        </div>
    );
}
