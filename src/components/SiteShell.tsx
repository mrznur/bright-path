"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiPhone, FiArrowUpRight } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { ContentProvider, useContent } from "@/components/ContentProvider";

function MobileDock() {
    const { site } = useContent();
    const { t } = useLanguage();
    return (
        <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
            <div className="mx-auto flex max-w-md items-center gap-2 rounded-2xl border-2 border-ink bg-white p-2 shadow-card">
                <a href={site.tel} className="flex flex-1 h-11 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand-gray text-sm font-extrabold text-ink shadow-card-sm">
                    <FiPhone /> {t("callUs")}
                </a>
                <Link href="/book" className="flex flex-1 h-11 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-brand-blue text-sm font-extrabold text-white shadow-card-sm">
                    Book a Seat <FiArrowUpRight />
                </Link>
            </div>
        </div>
    );
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname.startsWith("/admin")) return <>{children}</>;

    return (
        <ContentProvider>
            <LanguageProvider>
                <Navbar />
                <div className="pb-24 lg:pb-0">
                    <main>{children}</main>
                    <Footer />
                </div>
                <MobileDock />
            </LanguageProvider>
        </ContentProvider>
    );
}
