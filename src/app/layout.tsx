import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const sans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
    weight: ["400", "500", "600", "700", "800"],
});

const bangla = Noto_Sans_Bengali({
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-bangla",
    display: "swap",
    preload: false,
});

export const metadata: Metadata = {
    title: { default: "BrightPath Coaching Center · Dhaka", template: "%s · BrightPath" },
    description: "Bilingual coaching for Classes 3–12 in Dhanmondi, Dhaka. Small batches, qualified teachers and a calm place to learn.",
    icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${sans.variable} ${bangla.variable}`}>
            <body className="min-h-screen bg-white text-ink antialiased font-sans">
                <SiteShell>{children}</SiteShell>
            </body>
        </html>
    );
}
