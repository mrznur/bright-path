import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <main className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
            <p className="text-8xl font-extrabold text-brand-yellow" style={{ WebkitTextStroke: "2px #111" }}>404</p>
            <h1 className="mt-4 text-3xl font-extrabold text-ink">Page not found</h1>
            <p className="mt-3 font-medium text-ink-mute">This page does not exist or has been moved.</p>
            <Link href="/" className={buttonClass("primary", "md", "mt-8")}>Go home</Link>
        </main>
    );
}
