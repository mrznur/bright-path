"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    FiLogOut, FiMenu, FiX, FiBarChart2, FiBookOpen, FiMessageSquare,
    FiLayers, FiUsers, FiHelpCircle, FiAward, FiMessageCircle, FiSettings,
} from "react-icons/fi";

const links = [
    { href: "/admin", label: "Dashboard", icon: <FiBarChart2 /> },
    { href: "/admin/courses", label: "Courses", icon: <FiLayers /> },
    { href: "/admin/teachers", label: "Teachers", icon: <FiUsers /> },
    { href: "/admin/bookings", label: "Bookings", icon: <FiBookOpen /> },
    { href: "/admin/enquiries", label: "Enquiries", icon: <FiMessageSquare /> },
    { href: "/admin/faqs", label: "FAQs", icon: <FiHelpCircle /> },
    { href: "/admin/results", label: "Results", icon: <FiAward /> },
    { href: "/admin/testimonials", label: "Testimonials", icon: <FiMessageCircle /> },
    { href: "/admin/site", label: "Site", icon: <FiSettings /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    if (pathname === "/admin/login") return <>{children}</>;

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
    }

    return (
        <div className="flex min-h-screen bg-brand-gray">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r-2 border-ink bg-ink transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-16 items-center border-b-2 border-white/10 px-6">
                    <span className="text-xl font-extrabold text-white">
                        Bright<span className="text-brand-blue">Path</span>
                        <span className="text-brand-yellow">.</span>
                    </span>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                    {links.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-extrabold transition-all ${active ? "bg-brand-yellow text-ink shadow-card-sm" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                            >
                                {link.icon} {link.label}
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="mt-8 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-extrabold text-brand-red/80 hover:bg-white/10 hover:text-brand-red"
                    >
                        <FiLogOut /> Sign out
                    </button>
                </nav>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b-2 border-ink bg-white px-4 lg:hidden">
                    <span className="text-lg font-extrabold text-ink">Admin</span>
                    <button onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink">
                        {open ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</main>
            </div>
        </div>
    );
}
