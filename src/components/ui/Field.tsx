import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
    "w-full rounded-xl border-2 border-ink bg-white px-4 py-3 text-center text-sm font-semibold text-ink " +
    "placeholder:font-normal placeholder:text-ink-faint shadow-card-sm " +
    "focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-colors";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className = "", ...props }, ref) => (
        <input ref={ref} className={cn(fieldBase, className)} {...props} />
    ),
);
Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
    ({ className = "", children, ...props }, ref) => (
        <select ref={ref} className={cn(fieldBase, "cursor-pointer", className)} {...props}>
            {children}
        </select>
    ),
);
Select.displayName = "Select";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className = "", ...props }, ref) => (
        <textarea ref={ref} className={cn(fieldBase, "resize-y", className)} {...props} />
    ),
);
Textarea.displayName = "Textarea";

export function Label({
    htmlFor,
    required,
    children,
}: {
    htmlFor: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label htmlFor={htmlFor} className="mb-2 block text-center text-sm font-extrabold text-ink">
            {children}
            {required && <span className="ml-0.5 text-brand-red">*</span>}
        </label>
    );
}

export function FieldError({ children }: { children: React.ReactNode }) {
    if (!children) return null;
    return (
        <p className="mt-2 text-center text-sm font-bold text-brand-red" role="alert">
            {children}
        </p>
    );
}
