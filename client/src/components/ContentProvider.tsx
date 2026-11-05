'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Course, FAQ, Teacher, Testimonial } from '@/types';

type SiteSettings = {
  name: { en: string; bn: string };
  phone: { en: string; bn: string };
  tel: string;
  email: string;
  address: { en: string; bn: string };
  hours: { en: string; bn: string };
  facebook: string;
  mapEmbedUrl: string;
  mapLink: string;
};

type Content = {
  courses: Course[];
  teachers: Teacher[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  site: SiteSettings;
};

const ContentContext = createContext<Content | null>(null);
const CONTENT_CACHE_KEY = 'brightpath-public-content-v2';
const CONTENT_CACHE_TTL = 5 * 60 * 1000;

function getCachedContent(): Content | null {
  try {
    const raw = window.localStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { content?: Content; expiresAt?: number };
    if (!cached.content || !cached.expiresAt || cached.expiresAt <= Date.now()) {
      window.localStorage.removeItem(CONTENT_CACHE_KEY);
      return null;
    }
    return cached.content;
  } catch {
    return null;
  }
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setError(false);
    const cachedContent = getCachedContent();
    if (cachedContent) setContent(cachedContent);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    fetch('/api/content', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load site content.');
        return response.json() as Promise<Content>;
      })
      .then((freshContent) => {
        setContent(freshContent);
        try {
          window.localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
            content: freshContent,
            expiresAt: Date.now() + CONTENT_CACHE_TTL,
          }));
        } catch {
          // Rendering does not depend on browser storage.
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [retry]);

  if (!content) {
    if (error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFF6E5] px-4 text-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1B4B]">Unable to load site content</h1>
            <p className="mt-2 text-sm text-[#1E1B4B]/65">Please try again in a moment.</p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-5 rounded-xl bg-[#1E1B4B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#312E81]"
            >
              Try again
            </button>
          </div>
        </main>
      );
    }
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF6E5] px-4 text-center" aria-busy="true">
        <div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E8DCC8] border-t-[#1E1B4B]" />
          <p className="mt-4 text-sm text-[#1E1B4B]/60">Loading site content…</p>
        </div>
      </main>
    );
  }

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const content = useContext(ContentContext);
  if (!content) throw new Error('useContent must be used inside ContentProvider');
  return content;
}