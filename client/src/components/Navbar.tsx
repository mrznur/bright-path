"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiPhone, FiMenu, FiX, FiHelpCircle } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

const navLinks = [
  { href: "/", key: "home" as const },
  { href: "/courses", key: "courses" as const },
  { href: "/fees-admission", key: "fees" as const },
  { href: "/teachers-results", key: "teachers" as const },
  { href: "/faq", key: "faq" as const },
  { href: "/contact", key: "contact" as const },
];

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { site } = useContent();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFF6E5] border-b border-[#E8DCC8]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-1 px-3 sm:gap-6 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 overflow-hidden rounded-xl"
          >
            <Image
              src="/logo.png"
              alt="BrightPath Coaching Center"
              width={1760}
              height={1120}
              className="h-auto w-12 rounded-xl object-cover sm:w-20"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm leading-5 font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "text-[#F5C518] underline underline-offset-4"
                      : "text-[#1E1B4B] hover:text-[#F5C518]"
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right group: call (wide screens only), language toggle, menu button (below lg) */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <a
              href={site.tel}
              className="hidden xl:flex items-center gap-2 bg-[#F5C518] text-[#1E1B4B] text-sm leading-5 font-semibold px-5 py-2 rounded-full hover:bg-[#1E1B4B] hover:text-[#ffffff] transition-colors"
            >
              {t("callUs")} <FiPhone className="text-base" />
            </a>

            {/* Fixed-size toggle so it never changes width or height when the language changes */}
            <div className="flex items-center gap-0.5 rounded-full border border-[#E8DCC8] p-0.5 sm:gap-1 sm:p-1">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`min-w-[2rem] rounded-full px-1.5 py-1 text-[11px] font-semibold leading-4 text-center transition-colors hover:bg-[#F5EDD8] sm:min-w-[2.25rem] sm:px-2 sm:text-xs ${
                  language === "en"
                    ? "bg-[#1E1B4B] text-white"
                    : "text-[#1E1B4B]/60"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("bn")}
                aria-pressed={language === "bn"}
                className={`min-w-[2.5rem] rounded-full px-1.5 py-1 text-[11px] font-semibold leading-4 text-center transition-colors hover:bg-[#F5EDD8] sm:min-w-[3rem] sm:px-2 sm:text-xs ${
                  language === "bn"
                    ? "bg-[#1E1B4B] text-white"
                    : "text-[#1E1B4B]/60"
                }`}
              >
                বাংলা
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative z-[60] flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DCC8] text-[#1E1B4B] transition-colors hover:bg-[#F5EDD8] lg:hidden sm:h-10 sm:w-10"
            >
              {open ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-[#1E1B4B]/20 backdrop-blur-sm lg:hidden"
            />
            <nav
              id="mobile-menu"
              onClick={(event) => event.stopPropagation()}
              className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[#E8DCC8] bg-[#FFF6E5] px-4 py-2 shadow-lg sm:px-6 lg:hidden"
            >
              {navLinks.filter((link) => link.key !== "faq").map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-3 text-base leading-6 font-medium border-b border-[#E8DCC8] last:border-b-0 ${
                      active ? "text-[#F5C518]" : "text-[#1E1B4B]"
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </header>

      {/* Floating call button, shown wherever the header Call us button is hidden */}
      <a
        href={site.tel}
        className="fixed bottom-4 right-4 z-50 xl:hidden flex items-center gap-2 bg-[#1E1B4B] text-white text-sm leading-5 font-semibold px-4 py-3 rounded-full shadow-lg transition-colors hover:bg-[#312e68]"
      >
        {t("callUs")} <FiPhone />
      </a>
      <Link
        href="/faq"
        className="fixed bottom-16 right-4 z-50 lg:hidden flex items-center gap-2 bg-[#F5C518] text-[#1E1B4B] text-sm leading-5 font-semibold px-4 py-3 rounded-full shadow-lg transition-colors hover:bg-[#e1b300]"
      >
        {t("faq")} <FiHelpCircle />
      </Link>
    </>
  );
}
