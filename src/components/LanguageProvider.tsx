'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'en' | 'bn';
type TranslationKey = 'home' | 'courses' | 'fees' | 'teachers' | 'faq' | 'contact' | 'callUs' | 'findCourse';

const translations: Record<TranslationKey, Record<Language, string>> = {
    home: { en: 'Home', bn: 'হোম' },
    courses: { en: 'Courses', bn: 'কোর্সসমূহ' },
    fees: { en: 'Fees & admission', bn: 'ফি ও ভর্তি' },
    teachers: { en: 'Teachers & results', bn: 'শিক্ষক ও ফলাফল' },
    faq: { en: 'FAQ', bn: 'সাধারণ প্রশ্ন' },
    contact: { en: 'Contact', bn: 'যোগাযোগ' },
    callUs: { en: 'Call us', bn: 'ফোন করুন' },
    findCourse: { en: 'Find a course', bn: 'কোর্স খুঁজুন' },
};

const LanguageContext = createContext<{ language: Language; setLanguage: (l: Language) => void; t: (k: TranslationKey) => string } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        const saved = window.localStorage.getItem('brightpath-lang');
        if (saved === 'en' || saved === 'bn') setLanguage(saved);
    }, []);

    useEffect(() => {
        window.localStorage.setItem('brightpath-lang', language);
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage, t: (key: TranslationKey) => translations[key][language] }), [language]);
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
    return context;
}