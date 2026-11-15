import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "yellow" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
    "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink font-extrabold " +
    "transition-all active:translate-y-0.5 active:shadow-card-sm " +
    "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
    primary:   "bg-brand-blue text-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
    secondary: "bg-brand-dark text-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
    yellow:    "bg-brand-yellow text-ink shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
    ghost:     "bg-white text-ink shadow-card-sm hover:bg-brand-gray hover:-translate-y-0.5",
    danger:    "bg-brand-red text-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5",
};

const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-7 text-sm",
};

export function buttonClass(
    variant: ButtonVariant = "primary",
    size: ButtonSize = "md",
    extra?: string,
) {
    return cn(base, variants[variant], sizes[size], extra);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", className, ...props }, ref) => (
        <button
            ref={ref}
            type={props.type ?? "button"}
            className={buttonClass(variant, size, className)}
            {...props}
        />
    ),
);
Button.displayName = "Button";
