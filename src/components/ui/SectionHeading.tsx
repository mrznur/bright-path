import { cn } from "@/lib/cn";

/** Small pill label above a section heading — yellow with black border */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-lg border-2 border-ink bg-brand-yellow px-3 py-1 text-xs font-extrabold text-ink shadow-card-sm",
            className
        )}>
            {children}
        </span>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    align = "left",
    className,
}: {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    align?: "left" | "center";
    className?: string;
}) {
    return (
        <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
            {eyebrow && <div className="mb-3"><Eyebrow>{eyebrow}</Eyebrow></div>}
            <h2 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{title}</h2>
            {description && <p className="mt-3 text-base font-medium leading-relaxed text-ink-mute">{description}</p>}
        </div>
    );
}
