"use client";

import Link from "next/link";
import Image from "next/image";
import { FiFacebook } from "react-icons/fi";
import { useLanguage } from "@/components/LanguageProvider";
import { useContent } from "@/components/ContentProvider";

export default function Footer() {
  const { language, t } = useLanguage();
  const { site } = useContent();
  const bangla = language === "bn";
  const pick = (en: string, bn: string) => (bangla ? bn : en);

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1E1B4B] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Image
            src="/logo.png"
            alt={pick(site.name.en, site.name.bn)}
            width={1760}
            height={1120}
            className="h-auto w-[70px] rounded-lg object-contain"
          />
          <p className="text-sm text-white/70 leading-relaxed">
            {pick("BrightPath Coaching Center, Dhaka.", "ব্রাইটপাথ কোচিং সেন্টার, ঢাকা।")}
          </p>

          {/* Map */}
          <div className="mt-2 aspect-[4/3] w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <iframe
              src={site.mapEmbedUrl}
              title={pick(
                "Map showing the location of BrightPath Coaching Center",
                "ব্রাইটপাথ কোচিং সেন্টারের অবস্থান",
              )}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>

        {/* Explore */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">
            {pick("Explore BrightPath", "ব্রাইটপাথ ঘুরে দেখুন")}
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="break-words">
              <Link
                href="/courses"
                className="hover:text-white transition-colors"
              >
                {t("courses")}
              </Link>
            </li>
            <li>
              <Link
                href="/fees-admission"
                className="hover:text-white transition-colors"
              >
                {t("fees")}
              </Link>
            </li>
            <li>
              <Link
                href="/teachers-results"
                className="hover:text-white transition-colors"
              >
                {t("teachers")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                {t("faq")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">
            {pick("We're here to help", "আপনার সাহায্যের জন্য আমরা আছি")}
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              {pick("Phone", "ফোন")}:{" "}
              <a href={site.tel} className="hover:text-white transition-colors">
                {pick(site.phone.en, site.phone.bn)}
              </a>
            </li>
            <li className="break-words">
              <a
                href={site.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {pick(site.address.en, site.address.bn)}
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors w-fit"
              >
                <FiFacebook className="text-sm shrink-0" />{" "}
                {pick("BrightPath Facebook", "ব্রাইটপাথ ফেসবুক")}
              </a>
            </li>
            <li>
              {pick("Working Hours: ", "কার্যসময়: ")}
              {pick(site.hours.en, site.hours.bn)}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 px-4 xl:pb-4 text-xs text-white/30">
        <p>© {year} BrightPath Coaching Center. All rights reserved.</p>
      </div>
    </footer>
  );
}
