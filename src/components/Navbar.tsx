"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiPhone } from "react-icons/fi";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

const navLinks = [
    { name: "Home",      href: "/" },
    { name: "Courses",   href: "/courses" },
    { name: "Teachers",  href: "/teachers-results" },
    { name: "Fees",      href: "/fees-admission" },
    { name: "FAQ",       href: "/faq" },
    { name: "Contact",   href: "/contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { language, setLanguage } = useLanguage();
    const { site } = useContent();

    return (
        <header className="sticky top-0 z-50 border-b-2 border-ink bg-white">
            <div className="container-page flex h-20 items-center justify-between gap-6">
                {/* Logo */}
                <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-tight text-ink">
                    Bright<span className="text-brand-blue">Path</span>
                    <span className="text-brand-yellow">.</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => {
                        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-bold transition-colors hover:text-brand-blue ${active ? "text-brand-blue" : "text-ink"}`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <button
                        onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                        className="rounded-xl border-2 border-ink px-3 py-1.5 text-xs font-extrabold shadow-card-sm transition-all hover:bg-brand-gray"
                    >
                        {language === "en" ? "বাংলা" : "EN"}
                    </button>
                    <a
                        href={site.tel}
                        className="hidden items-center gap-1.5 text-sm font-bold text-ink-mute hover:text-ink xl:flex"
                    >
                        <FiPhone /> {site.phone.en}
                    </a>
                    <Link
                        href="/book"
                        className="rounded-xl border-2 border-ink bg-brand-blue px-5 py-2.5 text-sm font-extrabold text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0"
                    >
                        Book a Seat
                    </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink md:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="border-t-2 border-ink bg-white px-4 pb-6 pt-4 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-4 py-3 text-base font-bold text-ink hover:bg-brand-gray"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                            className="flex-1 rounded-xl border-2 border-ink py-2.5 text-sm font-extrabold hover:bg-brand-gray"
                        >
                            {language === "en" ? "বাংলা" : "EN"}
                        </button>
                        <Link
                            href="/book"
                            onClick={() => setOpen(false)}
                            className="flex-1 rounded-xl border-2 border-ink bg-brand-blue py-2.5 text-center text-sm font-extrabold text-white shadow-card-sm"
                        >
                            Book a Seat
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
