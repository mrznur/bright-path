'use client';

import { useEffect, useState } from 'react';

type Teacher = { id: string; name: string; subject: string; qualifications: string[]; bio: string; photo: string };
type Testimonial = { id: string; parentName: string; parentNameBn: string; parentRole: string; parentRoleBn: string; quote: string; quoteBn: string };
type FAQ = { id: string; question: string; answer: string; displayOrder: number };
type Site = {
  name: { en: string; bn: string }; phone: { en: string; bn: string }; tel: string; email: string;
  address: { en: string; bn: string }; hours: { en: string; bn: string };
  facebook: string; mapEmbedUrl: string; mapLink: string;
};

const fieldClass = 'mt-1.5 w-full rounded-xl border border-[#E8DCC8] px-3 py-2.5 text-sm outline-none focus:border-[#1E1B4B]';

export default function AdminContentPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [site, setSite] = useState<Site | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/admin/content').then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load site content.');
      setTeachers(data.teachers);
      setTestimonials(data.testimonials);
      setFaqs(data.faqs);
      setSite(data.site);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to load site content.'));
  }, []);

  async function save(type: string, id: string | undefined, data: Record<string, unknown>) {
    setError('');
    setNotice('');
    const response = await fetch('/api/admin/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, data }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Unable to save content.');
      return;
    }
    setNotice('Saved successfully.');
  }

  if (!site) return <p className="text-sm text-[#1E1B4B]/60">{error || 'Loading site content…'}</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">Database content</p>
        <h1 className="mt-2 text-3xl font-bold">Site content</h1>
        <p className="mt-2 text-sm text-[#1E1B4B]/60">Edit the public teachers, testimonials, FAQs and contact details.</p>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>}

      <section className="rounded-2xl border border-[#E8DCC8] bg-white p-6">
        <h2 className="text-xl font-bold">Site settings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {([
            ['name', 'en', 'Name (English)'], ['name', 'bn', 'Name (Bangla)'],
            ['phone', 'en', 'Phone (English)'], ['phone', 'bn', 'Phone (Bangla)'],
            ['address', 'en', 'Address (English)'], ['address', 'bn', 'Address (Bangla)'],
            ['hours', 'en', 'Hours (English)'], ['hours', 'bn', 'Hours (Bangla)'],
          ] as const).map(([group, language, label]) => (
            <label key={`${group}-${language}`} className="text-sm font-medium">{label}
              <input value={site[group][language]} onChange={(event) => setSite({ ...site, [group]: { ...site[group], [language]: event.target.value } })} className={fieldClass} />
            </label>
          ))}
          {(['tel', 'email', 'facebook', 'mapEmbedUrl', 'mapLink'] as const).map((field) => (
            <label key={field} className="text-sm font-medium">{field}
              <input value={site[field]} onChange={(event) => setSite({ ...site, [field]: event.target.value })} className={fieldClass} />
            </label>
          ))}
        </div>
        <button type="button" onClick={() => save('site', undefined, site as unknown as Record<string, unknown>)} className="mt-5 rounded-xl bg-[#1E1B4B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#312e68]">Save site settings</button>
      </section>

      <ContentList title="Teachers" items={teachers} onSave={(item) => save('teacher', item.id, { ...item, qualifications: item.qualifications })}>
        {(item, update) => <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Name" value={item.name} onChange={(value) => update({ name: value })} />
          <Input label="Subject" value={item.subject} onChange={(value) => update({ subject: value })} />
          <Input label="Photo path" value={item.photo} onChange={(value) => update({ photo: value })} />
          <Input label="Qualifications (one per line)" value={item.qualifications.join('\n')} onChange={(value) => update({ qualifications: value.split('\n').filter(Boolean) })} multiline />
          <Input label="Bio" value={item.bio} onChange={(value) => update({ bio: value })} multiline />
        </div>}
      </ContentList>

      <ContentList title="Testimonials" items={testimonials} onSave={(item) => save('testimonial', item.id, item)}>
        {(item, update) => <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Parent name" value={item.parentName} onChange={(value) => update({ parentName: value })} />
          <Input label="Parent name (Bangla)" value={item.parentNameBn} onChange={(value) => update({ parentNameBn: value })} />
          <Input label="Role" value={item.parentRole} onChange={(value) => update({ parentRole: value })} />
          <Input label="Role (Bangla)" value={item.parentRoleBn} onChange={(value) => update({ parentRoleBn: value })} />
          <Input label="Quote" value={item.quote} onChange={(value) => update({ quote: value })} multiline />
          <Input label="Quote (Bangla)" value={item.quoteBn} onChange={(value) => update({ quoteBn: value })} multiline />
        </div>}
      </ContentList>

      <ContentList title="FAQs" items={faqs} onSave={(item) => save('faq', item.id, item)}>
        {(item, update) => <div className="grid gap-3">
          <Input label="Question" value={item.question} onChange={(value) => update({ question: value })} />
          <Input label="Answer" value={item.answer} onChange={(value) => update({ answer: value })} multiline />
          <Input label="Display order" value={String(item.displayOrder)} onChange={(value) => update({ displayOrder: Number(value) })} />
        </div>}
      </ContentList>
    </div>
  );
}

function Input({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="text-sm font-medium">{label}{multiline
    ? <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} />
    : <input value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} />}</label>;
}

function ContentList<T extends { id: string }>({ title, items, onSave, children }: { title: string; items: T[]; onSave: (item: T) => void; children: (item: T, update: (changes: Partial<T>) => void) => React.ReactNode }) {
  const [values, setValues] = useState(items);
  useEffect(() => setValues(items), [items]);
  return <section className="rounded-2xl border border-[#E8DCC8] bg-white p-6">
    <h2 className="text-xl font-bold">{title}</h2>
    <div className="mt-4 space-y-6">
      {values.map((item, index) => <div key={item.id} className="border-t border-[#E8DCC8] pt-5 first:border-t-0 first:pt-0">
        {children(item, (changes) => setValues((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, ...changes } : entry)))}
        <button type="button" onClick={() => onSave(item)} className="mt-4 rounded-xl bg-[#1E1B4B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#312e68]">Save {title.slice(0, -1).toLowerCase()}</button>
      </div>)}
    </div>
  </section>;
}
