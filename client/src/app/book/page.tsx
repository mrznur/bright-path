'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiArrowUpRight, FiCheck, FiPhone } from 'react-icons/fi';
import { useContent } from '@/components/ContentProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useToast, ToastContainer } from '@/components/Toast';

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
function toEnglishDigits(value: string) {
  return value.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

// Bangladesh mobile: starts with 01, second digit 3-9, then 8 more digits = 11 total
const BD_PHONE_RE = /^(?:0)1[3-9]\d{8}$/;

function buildClassOptions(classes: string): { value: string; en: string; bn: string }[] {
  const BN_CLASS: Record<string, string> = {
    '3': 'তৃতীয় শ্রেণি', '4': 'চতুর্থ শ্রেণি', '5': 'পঞ্চম শ্রেণি',
    '6': 'ষষ্ঠ শ্রেণি', '7': 'সপ্তম শ্রেণি', '8': 'অষ্টম শ্রেণি',
    '9': 'নবম শ্রেণি', '10': 'দশম শ্রেণি', '11': 'একাদশ শ্রেণি', '12': 'দ্বাদশ শ্রেণি',
  };
  const nums = classes.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return [];
  const [first, last] = nums.length >= 2 ? [nums[0], nums[nums.length - 1]] : [nums[0], nums[0]];
  const result: { value: string; en: string; bn: string }[] = [];
  for (let n = first; n <= last; n++) {
    const s = String(n);
    result.push({ value: s, en: `Class ${n}`, bn: BN_CLASS[s] ?? `শ্রেণি ${n}` });
  }
  return result;
}

const inputClass =
  'w-full rounded-xl border border-[#E8DCC8] bg-white px-4 py-3 text-base text-[#1E1B4B] placeholder-[#1E1B4B]/30 outline-none focus:border-[#1E1B4B] transition-colors';
const inputErrorClass =
  'w-full rounded-xl border border-red-300 bg-white px-4 py-3 text-base text-[#1E1B4B] placeholder-[#1E1B4B]/30 outline-none focus:border-red-500 transition-colors';
const selectClass =
  'w-full rounded-xl border border-[#E8DCC8] bg-white px-4 py-3 pr-10 text-base text-[#1E1B4B] outline-none focus:border-[#1E1B4B] transition-colors appearance-none cursor-pointer';
const labelClass = 'block text-sm font-semibold text-[#1E1B4B] mb-1.5';

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#1E1B4B]/40">
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

export default function BookPage() {
  const params = useSearchParams();
  const { courses, site } = useContent();
  const { language } = useLanguage();
  const bangla = language === 'bn';
  const pick = (en: string, bn: string) => (bangla ? bn : en);
  const { toasts, toast, dismiss } = useToast();

  const course = useMemo(
    () => courses.find((item) => item.id === params.get('courseId') && item.batchId === params.get('batchId')),
    [courses, params],
  );

  const classOptions = useMemo(() => (course ? buildClassOptions(course.classes) : []), [course]);

  const [form, setForm] = useState({
    parentName: '',
    studentName: '',
    phone: '',
    classLevel: '',
    paymentMethod: 'bKash',
    transactionId: '',
    note: '',
    consent: false,
  });
  const [phoneError, setPhoneError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const needsTransactionId = form.paymentMethod !== 'Cash';

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhoneChange(raw: string) {
    const english = toEnglishDigits(raw);
    // Only allow digits and leading +
    const cleaned = english.replace(/[^\d+]/g, '');
    // Enforce max 11 chars (local format 01XXXXXXXXX)
    const capped = cleaned.startsWith('+') ? cleaned.slice(0, 14) : cleaned.slice(0, 11);
    set('phone', capped);
    // Live validation feedback
    if (capped.length > 0 && !BD_PHONE_RE.test(capped.replace(/[\s-]/g, ''))) {
      setPhoneError(pick('Must be an 11-digit BD number starting with 01', '০১ দিয়ে শুরু ১১ সংখ্যার নম্বর দিন'));
    } else {
      setPhoneError('');
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const cleanPhone = form.phone.replace(/[\s-]/g, '');
    if (!BD_PHONE_RE.test(cleanPhone)) {
      setPhoneError(pick('Please enter a valid 11-digit Bangladesh mobile number (e.g. 01712345678).', 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন ০১৭১২৩৪৫৬৭৮)।'));
      toast('error', pick('Enter a valid 11-digit BD mobile number.', 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।'));
      return;
    }
    if (needsTransactionId && !form.transactionId.trim()) {
      setError(pick('Please enter your transaction ID before submitting.', 'জমা দেওয়ার আগে ট্রানজেকশন আইডি দিন।'));
      toast('error', pick('Please enter your transaction ID.', 'ট্রানজেকশন আইডি দিন।'));
      return;
    }
    if (!form.parentName.trim()) {
      toast('error', pick("Parent / guardian name is required.", "অভিভাবকের নাম দিন।"));
      return;
    }
    if (!form.studentName.trim()) {
      toast('error', pick("Student's name is required.", "শিক্ষার্থীর নাম দিন।"));
      return;
    }
    if (classOptions.length > 1 && !form.classLevel) {
      toast('error', pick("Please select the student's class.", "শিক্ষার্থীর শ্রেণি বেছে নিন।"));
      return;
    }
    if (!form.consent) {
      toast('error', pick('Please confirm your consent.', 'সম্মতি নিশ্চিত করুন।'));
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, courseId: course?.id, batchId: course?.batchId }),
      });
      const data = await response.json();
      if (!response.ok) {
        const msg = data.error || pick('Unable to save booking. Please try again.', 'বুকিং সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।');
        setError(msg);
        toast('error', msg);
        return;
      }
      toast('success', pick('Booking submitted successfully!', 'বুকিং সফলভাবে জমা দেওয়া হয়েছে!'));
      setSubmitted(true);
    } catch {
      const msg = pick('Connection error. Please check your internet and try again.', 'সংযোগ সমস্যা। ইন্টারনেট দেখে আবার চেষ্টা করুন।');
      setError(msg);
      toast('error', msg);
    } finally {
      setSaving(false);
    }
  }

  if (!course) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#1E1B4B]">{pick('Batch not found', 'ব্যাচ খুঁজে পাওয়া যায়নি')}</h1>
        <p className="mt-3 text-base text-[#1E1B4B]/60">
          {pick('Please return to Courses and choose an available batch.', 'অনুগ্রহ করে কোর্স পেজে ফিরে একটি উপলব্ধ ব্যাচ বেছে নিন।')}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr] items-start">
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#F5C518] mb-1">
          {pick('Reserve a seat', 'আসন সংরক্ষণ করুন')}
        </p>
        <h1 className="text-3xl font-bold text-[#1E1B4B] mt-1 mb-1">
          {pick(course.title, course.titleBn)}
        </h1>
        <p className="text-base text-[#1E1B4B]/60 mb-8">
          {pick(course.level, course.levelBn)} · {pick(course.classes, course.classesBn)} · {pick(course.days, course.daysBn)} · {pick(course.time, course.timeBn)}
        </p>

        {!submitted ? (
          <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[#E8DCC8] bg-white p-6 sm:p-8">
            <p className="text-sm text-[#1E1B4B]/50">
              {pick('All fields are required unless marked optional.', 'ঐচ্ছিক চিহ্নিত ছাড়া সব ঘর পূরণ করা আবশ্যক।')}
            </p>

            {/* Parent name */}
            <div>
              <label className={labelClass}>{pick('Parent / guardian name', 'অভিভাবকের নাম')}</label>
              <input
                type="text"
                required
                value={form.parentName}
                onChange={(e) => set('parentName', e.target.value)}
                placeholder={pick('Your full name', 'আপনার পূর্ণ নাম')}
                className={inputClass}
              />
            </div>

            {/* Student name */}
            <div>
              <label className={labelClass}>{pick("Student's name", 'শিক্ষার্থীর নাম')}</label>
              <input
                type="text"
                required
                value={form.studentName}
                onChange={(e) => set('studentName', e.target.value)}
                placeholder={pick("Student's full name", 'শিক্ষার্থীর পূর্ণ নাম')}
                className={inputClass}
              />
            </div>

            {/* Phone — 11 digits, live validation */}
            <div>
              <label className={labelClass}>{pick('Phone number', 'ফোন নম্বর')}</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={11}
                placeholder={pick('e.g. 01712345678', 'যেমন ০১৭১২৩৪৫৬৭৮')}
                className={phoneError ? inputErrorClass : inputClass}
              />
              <div className="flex justify-between mt-1.5">
                {phoneError
                  ? <p className="text-sm text-red-600">{phoneError}</p>
                  : <p className="text-sm text-[#1E1B4B]/45">{pick('11-digit Bangladesh mobile number', '১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর')}</p>
                }
                <p className={`text-sm tabular-nums ${form.phone.length === 11 ? 'text-green-600' : 'text-[#1E1B4B]/35'}`}>
                  {form.phone.length}/11
                </p>
              </div>
            </div>

            {/* Class level */}
            <div>
              <label className={labelClass}>{pick("Student's class", 'শিক্ষার্থীর শ্রেণি')}</label>
              {classOptions.length > 1 ? (
                <SelectWrap>
                  <select
                    required
                    value={form.classLevel}
                    onChange={(e) => set('classLevel', e.target.value)}
                    className={selectClass}
                  >
                    <option value="">{pick('Select a class', 'শ্রেণি বেছে নিন')}</option>
                    {classOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{pick(opt.en, opt.bn)}</option>
                    ))}
                  </select>
                </SelectWrap>
              ) : (
                <input
                  type="text"
                  readOnly
                  value={classOptions[0] ? pick(classOptions[0].en, classOptions[0].bn) : pick(course.classes, course.classesBn)}
                  className={`${inputClass} bg-[#F5EDD8] cursor-default`}
                />
              )}
              <p className="mt-1.5 text-sm text-[#1E1B4B]/45">
                {pick(`This course is for ${course.classes}.`, `এই কোর্সটি ${pick(course.classes, course.classesBn)}-এর জন্য।`)}
              </p>
            </div>

            {/* Payment method */}
            <div>
              <label className={labelClass}>{pick('Payment method', 'পেমেন্ট পদ্ধতি')}</label>
            <SelectWrap>
              <select
                value={form.paymentMethod}
                onChange={(e) => { set('paymentMethod', e.target.value); set('transactionId', ''); }}
                className={selectClass}
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank transfer">{pick('Bank transfer', 'ব্যাংক ট্রান্সফার')}</option>
                <option value="Cash">{pick('Cash (at center)', 'নগদ (সেন্টারে)')}</option>
              </select>
            </SelectWrap>
            </div>

            {/* Transaction ID — shown for all non-cash methods */}
            {needsTransactionId && (
              <div>
                <label className={labelClass}>
                  {pick('Transaction ID', 'ট্রানজেকশন আইডি')}
                </label>
                <input
                  type="text"
                  required
                  value={form.transactionId}
                  onChange={(e) => set('transactionId', e.target.value.trim())}
                  placeholder={pick(
                    `Your ${form.paymentMethod} transaction ID`,
                    `আপনার ${form.paymentMethod} ট্রানজেকশন আইডি`,
                  )}
                  className={inputClass}
                />
                <p className="mt-1.5 text-sm text-[#1E1B4B]/45">
                  {pick(
                    'Send the payment first, then enter the transaction ID here.',
                    'আগে পেমেন্ট পাঠান, তারপর এখানে ট্রানজেকশন আইডি লিখুন।',
                  )}
                </p>
              </div>
            )}

            {/* Note */}
            <div>
              <label className={labelClass}>
                {pick('Note', 'মন্তব্য')}{' '}
                <span className="font-normal text-[#1E1B4B]/40">({pick('optional', 'ঐচ্ছিক')})</span>
              </label>
              <textarea
                rows={3}
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
                placeholder={pick('Any questions or special requests', 'কোনো প্রশ্ন বা বিশেষ অনুরোধ থাকলে লিখুন')}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(e) => set('consent', e.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer accent-[#1E1B4B]"
              />
              <span className="text-sm text-[#1E1B4B]/55 leading-relaxed">
                {pick(
                  'I agree that BrightPath may contact me regarding this seat request.',
                  'আমি সম্মতি দিচ্ছি যে ব্রাইটপাথ এই আসনের অনুরোধ সম্পর্কে আমাকে যোগাযোগ করতে পারে।',
                )}
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            <button
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5C518] py-3.5 text-base font-semibold text-[#1E1B4B] transition-colors hover:bg-[#1E1B4B] hover:text-white disabled:opacity-60"
            >
              {saving ? pick('Saving…', 'সংরক্ষণ হচ্ছে…') : pick('Submit booking', 'বুকিং জমা দিন')}{' '}
              <FiArrowUpRight />
            </button>

            <p className="text-sm text-[#1E1B4B]/45 text-center">
              {pick('Prefer to call?', 'সরাসরি কথা বলতে চান?')}{' '}
              <a href={site.tel} className="underline underline-offset-2 hover:text-[#1E1B4B]">
                {site.phone.en}
              </a>
            </p>
          </form>
        ) : (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
            <FiCheck className="text-3xl text-green-700" />
            <h2 className="mt-4 text-2xl font-bold text-green-900">
              {pick('Booking submitted', 'বুকিং জমা দেওয়া হয়েছে')}
            </h2>
            <p className="mt-3 text-base text-green-800">
              {pick(
                `We've received your booking. Please call ${site.phone.en} so the center can confirm your seat.`,
                `আপনার বুকিং পেয়েছি। আসন নিশ্চিত করতে ${site.phone.bn} নম্বরে ফোন করুন।`,
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── Payment sidebar ───────────────────────────────────────────── */}
      <aside className="rounded-2xl border border-[#E8DCC8] bg-[#F5EDD8] p-6 lg:sticky lg:top-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#F5C518] mb-2">
          {pick('Batch summary', 'ব্যাচের সারসংক্ষেপ')}
        </p>
        <h2 className="text-xl font-bold text-[#1E1B4B] mb-4">
          {pick('Payment instructions', 'পেমেন্ট নির্দেশনা')}
        </h2>

        <div className="bg-white rounded-xl border border-[#E8DCC8] p-4 mb-4 space-y-2">
          <p className="text-base text-[#1E1B4B]/60">
            <span className="font-semibold text-[#1E1B4B]">{pick('Monthly fee', 'মাসিক ফি')}:</span>{' '}
            ৳{course.monthlyFee.toLocaleString('en-US')}
          </p>
          <p className="text-base text-[#1E1B4B]/60">
            <span className="font-semibold text-[#1E1B4B]">{pick('Admission (one-time)', 'ভর্তি ফি (একবার)')}:</span> ৳500
          </p>
          <div className="border-t border-[#E8DCC8] pt-2">
            <p className="text-base font-bold text-[#1E1B4B]">
              {pick('First month total', 'প্রথম মাসের মোট')}: ৳{(course.monthlyFee + 500).toLocaleString('en-US')}
            </p>
          </div>
        </div>

        <p className="text-base text-[#1E1B4B]/65 mb-4">
          {pick(
            'No online gateway is connected. Send the fee manually to the number below, then enter your transaction ID in the form.',
            'অনলাইন গেটওয়ে নেই। নিচের নম্বরে ফি পাঠান, তারপর ফর্মে ট্রানজেকশন আইডি দিন।',
          )}
        </p>

        <div className="space-y-2 text-base mb-5">
          <p><span className="font-semibold">bKash:</span> {site.phone.en}</p>
          <p><span className="font-semibold">Nagad:</span> {site.phone.en}</p>
          <p className="text-base text-[#1E1B4B]/60">
            {pick('Bank transfer: contact the center for account details.', 'ব্যাংক ট্রান্সফার: অ্যাকাউন্ট তথ্যের জন্য সেন্টারে যোগাযোগ করুন।')}
          </p>
        </div>

        <a
          href={site.tel}
          className="flex items-center justify-center gap-2 w-full border border-[#E8DCC8] bg-white text-[#1E1B4B] text-base font-semibold py-3 rounded-xl hover:bg-[#1E1B4B] hover:text-white transition-colors"
        >
          <FiPhone /> {pick('Call to confirm', 'নিশ্চিত করতে ফোন করুন')}
        </a>

        <p className="mt-4 text-sm text-[#1E1B4B]/50 leading-relaxed">
          {pick(
            'Keep your transaction ID safe. The center will verify it when confirming your seat.',
            'ট্রানজেকশন আইডি সংরক্ষণ করুন। আসন নিশ্চিত করার সময় সেন্টার এটি যাচাই করবে।',
          )}
        </p>
      </aside>
    </section>
  );
}
