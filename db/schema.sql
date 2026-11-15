-- ============================================================================
-- BrightPath Coaching Center — Neon Postgres Schema
-- ============================================================================
-- Safe to re-run. Migrates older course rows (batch fields on courses)
-- into a dedicated batches table, then seeds missing rows.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- TEACHERS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teachers (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    name_bn    TEXT NOT NULL DEFAULT '',
    subject    TEXT NOT NULL DEFAULT '',
    subject_bn TEXT NOT NULL DEFAULT '',
    bio        TEXT NOT NULL DEFAULT '',
    bio_bn     TEXT NOT NULL DEFAULT '',
    image_url  TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- COURSES (catalog — one row per subject/level offering)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    title_bn        TEXT NOT NULL DEFAULT '',
    level           TEXT NOT NULL CHECK (level IN ('Primary', 'Junior', 'JSC', 'SSC', 'HSC')),
    level_bn        TEXT NOT NULL DEFAULT '',
    classes         TEXT NOT NULL DEFAULT '',
    classes_bn      TEXT NOT NULL DEFAULT '',
    subject         TEXT NOT NULL DEFAULT '',
    subject_bn      TEXT NOT NULL DEFAULT '',
    description     TEXT NOT NULL DEFAULT '',
    description_bn  TEXT NOT NULL DEFAULT '',
    teacher_id      TEXT REFERENCES public.teachers(id) ON DELETE SET NULL,
    monthly_fee     INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- BATCHES (schedule + seats — many per course)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.batches (
    id              TEXT PRIMARY KEY,
    course_id       TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    days            TEXT NOT NULL DEFAULT '',
    days_bn         TEXT NOT NULL DEFAULT '',
    time            TEXT NOT NULL DEFAULT '',
    time_bn         TEXT NOT NULL DEFAULT '',
    batch_size      INTEGER NOT NULL DEFAULT 15,
    enrolled_count  INTEGER NOT NULL DEFAULT 0,
    is_full         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_batches_course_id ON public.batches(course_id);

-- ---------------------------------------------------------------------------
-- SITE CONFIG (single row)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_config (
    id          TEXT PRIMARY KEY DEFAULT 'default',
    name        TEXT NOT NULL DEFAULT 'BrightPath Coaching Center',
    tagline_en  TEXT NOT NULL DEFAULT '',
    tagline_bn  TEXT NOT NULL DEFAULT '',
    phone_en    TEXT NOT NULL DEFAULT '',
    phone_bn    TEXT NOT NULL DEFAULT '',
    tel         TEXT NOT NULL DEFAULT '',
    address_en  TEXT NOT NULL DEFAULT '',
    address_bn  TEXT NOT NULL DEFAULT '',
    map_link    TEXT NOT NULL DEFAULT '',
    hours_en    TEXT NOT NULL DEFAULT '',
    hours_bn    TEXT NOT NULL DEFAULT '',
    facebook    TEXT NOT NULL DEFAULT ''
);

-- ---------------------------------------------------------------------------
-- TESTIMONIALS / FAQS / RESULTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
    id        TEXT PRIMARY KEY,
    quote     TEXT NOT NULL,
    quote_bn  TEXT NOT NULL DEFAULT '',
    author    TEXT NOT NULL,
    author_bn TEXT NOT NULL DEFAULT '',
    role      TEXT NOT NULL DEFAULT '',
    role_bn   TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id           TEXT PRIMARY KEY,
    question     TEXT NOT NULL,
    question_bn  TEXT NOT NULL DEFAULT '',
    answer       TEXT NOT NULL,
    answer_bn    TEXT NOT NULL DEFAULT '',
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.results (
    id               TEXT PRIMARY KEY,
    student_name     TEXT NOT NULL,
    student_name_bn  TEXT NOT NULL DEFAULT '',
    exam             TEXT NOT NULL,
    exam_bn          TEXT NOT NULL DEFAULT '',
    subject          TEXT NOT NULL,
    subject_bn       TEXT NOT NULL DEFAULT '',
    grade            TEXT NOT NULL,
    grade_bn         TEXT NOT NULL DEFAULT '',
    year             INTEGER NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- BOOKINGS / ENQUIRIES
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id      TEXT NOT NULL,
    batch_id       TEXT NOT NULL,
    parent_name    TEXT NOT NULL,
    student_name   TEXT NOT NULL,
    phone          TEXT NOT NULL,
    class_level    TEXT NOT NULL DEFAULT '',
    payment_method TEXT NOT NULL DEFAULT '',
    note           TEXT NOT NULL DEFAULT '',
    status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

CREATE TABLE IF NOT EXISTS public.enquiries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    class_level TEXT NOT NULL DEFAULT '',
    subject     TEXT NOT NULL DEFAULT '',
    course      TEXT NOT NULL DEFAULT '',
    question    TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- ---------------------------------------------------------------------------
-- MIGRATE legacy course rows that stored batch fields on the course
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'batch_id'
    ) THEN
        INSERT INTO public.batches (id, course_id, days, days_bn, time, time_bn, batch_size, enrolled_count, is_full)
        SELECT
            COALESCE(NULLIF(batch_id, ''), id || '-a'),
            id,
            COALESCE(days, ''),
            COALESCE(days_bn, ''),
            COALESCE(time, ''),
            COALESCE(time_bn, ''),
            COALESCE(batch_size, 15),
            COALESCE(enrolled_count, 0),
            COALESCE(is_full, FALSE)
        FROM public.courses
        ON CONFLICT (id) DO NOTHING;

        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'teacher_name'
        ) THEN
            UPDATE public.courses SET teacher_id = 'sultana' WHERE teacher_id IS NULL AND teacher_name ILIKE '%sultana%';
            UPDATE public.courses SET teacher_id = 'hossain' WHERE teacher_id IS NULL AND teacher_name ILIKE '%hossain%';
            UPDATE public.courses SET teacher_id = 'rahman' WHERE teacher_id IS NULL AND teacher_name ILIKE '%rahman%';
            UPDATE public.courses SET teacher_id = 'chowdhury' WHERE teacher_id IS NULL AND teacher_name ILIKE '%chowdhury%';
        END IF;

        ALTER TABLE public.courses DROP COLUMN IF EXISTS batch_id;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS days;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS days_bn;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS time;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS time_bn;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS batch_size;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS enrolled_count;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS is_full;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS teacher_name;
        ALTER TABLE public.courses DROP COLUMN IF EXISTS teacher_name_bn;
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- SEED DATA
-- ---------------------------------------------------------------------------
INSERT INTO public.teachers (id, name, name_bn, subject, subject_bn, bio, bio_bn) VALUES
('sultana', 'Ms. Roksana Sultana', 'মিসেস রোকসানা সুলতানা', 'English', 'ইংরেজি', 'M.A. in English Literature from Dhaka University. 12 years of classroom experience.', 'ঢাকা বিশ্ববিদ্যালয় থেকে ইংরেজি সাহিত্যে এম.এ.। ১২ বছর ধরে প্রাথমিক ও জুনিয়র শ্রেণিতে পড়াচ্ছেন। গল্পের মাধ্যমে পড়ানোর জন্য শিক্ষার্থীরা খুব পছন্দ করে।'),
('hossain', 'Mr. Karim Hossain', 'জনাব করিম হোসেন', 'Mathematics', 'গণিত', 'B.Sc. in Mathematics from BUET. Makes abstract concepts concrete for every level.', 'বুয়েট থেকে গণিতে বি.এস.সি.। বিমূর্ত ধারণাগুলোকে সহজ করে বোঝাতে পারেন — যে শ্রেণিতেই থাকুন না কেন।'),
('rahman', 'Mr. Tariq Rahman', 'জনাব তারিক রহমান', 'Physics', 'পদার্থবিজ্ঞান', 'M.Sc. in Physics from Jahangirnagar University. Former lecturer, board exam expert.', 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয় থেকে পদার্থবিজ্ঞানে এম.এস.সি.। প্রাক্তন প্রভাষক। বোর্ড ও ভর্তি পরীক্ষার প্রস্তুতিতে দক্ষ।'),
('chowdhury', 'Ms. Farida Chowdhury', 'মিসেস ফরিদা চৌধুরী', 'Chemistry & Science', 'রসায়ন ও বিজ্ঞান', 'M.Sc. in Chemistry. 9 years teaching JSC, SSC, and HSC Chemistry.', 'রসায়নে এম.এস.সি.। ৯ বছর ধরে জেএসসি, এসএসসি ও এইচএসসি রসায়ন পড়াচ্ছেন। মুখস্থের বদলে ধারণা পরিষ্কার করতে জোর দেন।')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (id, title, title_bn, level, level_bn, classes, classes_bn, subject, subject_bn, description, description_bn, teacher_id, monthly_fee) VALUES
('english-primary', 'English Foundation', 'ইংরেজির ভিত্তি', 'Primary', 'প্রাথমিক', 'Classes 3–5', 'শ্রেণি ৩–৫', 'English', 'ইংরেজি', 'Build reading, writing, and speaking skills through stories, games, and guided practice.', 'গল্প আর খেলায় মজে পড়া, লেখা আর কথা বলার চর্চা। ছোট ব্যাচে প্রতিটি শিক্ষার্থী আলাদা মনোযোগ পায়।', 'sultana', 1800),
('math-primary', 'Math Foundation', 'গণিতের ভিত্তি', 'Primary', 'প্রাথমিক', 'Classes 3–5', 'শ্রেণি ৩–৫', 'Mathematics', 'গণিত', 'Numeracy, basic arithmetic, and mental math through visual and hands-on methods.', 'ছবি আর হাতে-কলমে শেখা — সংখ্যা চেনা, মৌলিক গণিত আর মানসিক হিসাব। সংখ্যা নিয়ে ভয় কেটে যাবে।', 'hossain', 1800),
('english-junior', 'English Proficiency', 'ইংরেজি দক্ষতা', 'Junior', 'জুনিয়র', 'Classes 6–7', 'শ্রেণি ৬–৭', 'English', 'ইংরেজি', 'Grammar, comprehension, writing paragraphs and essays with exam strategy practice.', 'ব্যাকরণ, অনুধাবন, অনুচ্ছেদ আর রচনা লেখা — সম্পূর্ণ NCTB সিলেবাস, পরীক্ষার কৌশলসহ।', 'sultana', 1800),
('math-junior', 'Math Accelerator', 'গণিত অ্যাক্সিলারেটর', 'Junior', 'জুনিয়র', 'Classes 6–7', 'শ্রেণি ৬–৭', 'Mathematics', 'গণিত', 'Fractions, algebra basics, geometry, and word problems for analytical thinking.', 'ভগ্নাংশ, বীজগণিত, জ্যামিতি আর সমস্যা সমাধান — পরের শ্রেণিতে প্রয়োজন এমন বিশ্লেষণী চিন্তা গড়ে ওঠে।', 'hossain', 1800),
('science-jsc', 'Science (JSC)', 'বিজ্ঞান (জেএসসি)', 'JSC', 'জেএসসি', 'Class 8', 'শ্রেণি ৮', 'Science', 'বিজ্ঞান', 'Complete Class 8 Science syllabus with model tests and exam technique.', 'অষ্টম শ্রেণির সম্পূর্ণ বিজ্ঞান সিলেবাস — পদার্থ, রসায়ন, জীববিজ্ঞান সব অধ্যায়, মডেল টেস্ট আর পরীক্ষার কৌশল।', 'chowdhury', 1800),
('physics-ssc', 'Physics (SSC)', 'পদার্থবিজ্ঞান (এসএসসি)', 'SSC', 'এসএসসি', 'Classes 9–10', 'শ্রেণি ৯–১০', 'Physics', 'পদার্থবিজ্ঞান', 'Board-syllabus Physics with diagrams, numerical practice, and full model tests.', 'নবম-দশম শ্রেণির বোর্ড সিলেবাস পদার্থবিজ্ঞান — চিত্র দিয়ে স্পষ্ট বোঝাপড়া, সংখ্যাসূচক অনুশীলন আর সম্পূর্ণ মডেল টেস্ট।', 'rahman', 2200),
('chemistry-ssc', 'Chemistry (SSC)', 'রসায়ন (এসএসসি)', 'SSC', 'এসএসসি', 'Classes 9–10', 'শ্রেণি ৯–১০', 'Chemistry', 'রসায়ন', 'Full SSC Chemistry: atoms, reactions, periodic table, acids and bases.', 'এসএসসি রসায়নের সম্পূর্ণ সিলেবাস — পরমাণু ও অণু, বিক্রিয়া, পর্যায় সারণি, অ্যাসিড-ক্ষার, ব্যবহারিক পরীক্ষার পুনরাবৃত্তি।', 'chowdhury', 2200),
('math-ssc', 'Higher Math (SSC)', 'উচ্চতর গণিত (এসএসসি)', 'SSC', 'এসএসসি', 'Classes 9–10', 'শ্রেণি ৯–১০', 'Mathematics', 'গণিত', 'Algebra, trigonometry, coordinate geometry, and statistics for SSC Higher Math.', 'এসএসসি উচ্চতর গণিত — বীজগণিত, ত্রিকোণমিতি, স্থানাঙ্ক জ্যামিতি আর পরিসংখ্যান। বোর্ডের প্রশ্নপ্যাটার্ন বুঝে অনুশীলন।', 'hossain', 2200),
('physics-hsc', 'Physics (HSC)', 'পদার্থবিজ্ঞান (এইচএসসি)', 'HSC', 'এইচএসসি', 'Classes 11–12', 'শ্রেণি ১১–১২', 'Physics', 'পদার্থবিজ্ঞান', 'HSC Physics Parts 1 & 2: mechanics, waves, thermodynamics, optics, electricity.', 'এইচএসসি পদার্থবিজ্ঞান ১ম ও ২য় পত্র — বলবিদ্যা, তরঙ্গ, তাপগতিবিদ্যা, আলোকবিজ্ঞান, বিদ্যুৎ আর আধুনিক পদার্থবিজ্ঞান। নিয়মিত অধ্যায় পরীক্ষা ও মূল পরীক্ষার নমুনা।', 'rahman', 2800),
('chemistry-hsc', 'Chemistry (HSC)', 'রসায়ন (এইচএসসি)', 'HSC', 'এইচএসসি', 'Classes 11–12', 'শ্রেণি ১১–১২', 'Chemistry', 'রসায়ন', 'HSC Chemistry: organic reactions, equilibria, electrochemistry, industrial processes.', 'এইচএসসি রসায়ন — জৈব বিক্রিয়া, সাম্যাবস্থা, তড়িৎ রসায়ন আর শিল্প প্রক্রিয়া। ব্যবহারিক পরীক্ষার প্রস্তুতিসহ।', 'chowdhury', 2800)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.batches (id, course_id, days, days_bn, time, time_bn, batch_size, enrolled_count, is_full) VALUES
('ep-a', 'english-primary', 'Sun, Tue, Thu', 'রবি, মঙ্গল, বৃহস্পতি', '3:30 – 4:30 PM', 'বিকেল ৩:৩০ – ৪:৩০', 15, 10, FALSE),
('mp-a', 'math-primary', 'Sat, Mon, Wed', 'শনি, সোম, বুধ', '4:00 – 5:00 PM', 'বিকেল ৪:০০ – ৫:০০', 15, 14, FALSE),
('ej-a', 'english-junior', 'Sun, Tue, Thu', 'রবি, মঙ্গল, বৃহস্পতি', '5:00 – 6:00 PM', 'বিকেল ৫:০০ – ৬:০০', 15, 8, FALSE),
('mj-a', 'math-junior', 'Sat, Mon, Wed', 'শনি, সোম, বুধ', '5:00 – 6:00 PM', 'বিকেল ৫:০০ – ৬:০০', 15, 15, TRUE),
('sj-a', 'science-jsc', 'Sat, Mon, Wed', 'শনি, সোম, বুধ', '6:00 – 7:30 PM', 'সন্ধ্যা ৬:০০ – ৭:৩০', 14, 11, FALSE),
('ps-a', 'physics-ssc', 'Sun, Tue, Thu', 'রবি, মঙ্গল, বৃহস্পতি', '5:00 – 6:30 PM', 'বিকেল ৫:০০ – ৬:৩০', 14, 12, FALSE),
('cs-a', 'chemistry-ssc', 'Sat, Mon, Wed', 'শনি, সোম, বুধ', '5:00 – 6:30 PM', 'বিকেল ৫:০০ – ৬:৩০', 14, 9, FALSE),
('ms-a', 'math-ssc', 'Sun, Tue, Thu', 'রবি, মঙ্গল, বৃহস্পতি', '7:00 – 8:30 PM', 'সন্ধ্যা ৭:০০ – ৮:৩০', 14, 14, TRUE),
('ph-a', 'physics-hsc', 'Sat, Mon, Wed', 'শনি, সোম, বুধ', '7:00 – 8:30 PM', 'সন্ধ্যা ৭:০০ – ৮:৩০', 12, 10, FALSE),
('ch-a', 'chemistry-hsc', 'Sun, Tue, Thu', 'রবি, মঙ্গল, বৃহস্পতি', '7:00 – 8:30 PM', 'সন্ধ্যা ৭:০০ – ৮:৩০', 12, 7, FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_config (id, name, tagline_en, tagline_bn, phone_en, phone_bn, tel, address_en, address_bn, map_link, hours_en, hours_bn, facebook) VALUES
('default',
 'BrightPath Coaching Center',
 'Little steps. Lasting confidence.',
 'ছোট ছোট পদক্ষেপে গড়ে ওঠে আত্মবিশ্বাস।',
 '01712-345678',
 '০১৭১২-৩৪৫৬৭৮',
 'tel:+8801712345678',
 'House 12, Road 4, Dhanmondi, Dhaka 1205',
 'বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা ১২০৫',
 'https://maps.google.com/?q=Dhanmondi+Dhaka',
 'Sat–Thu: 8 AM – 9 PM · Fri: Closed',
 'শনি–বৃহস্পতি: সকাল ৮টা – রাত ৯টা · শুক্র: বন্ধ',
 'https://facebook.com/brightpathdhaka')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.testimonials (id, quote, quote_bn, author, author_bn, role, role_bn) VALUES
('t1', 'My daughter went from struggling with fractions to loving maths. Small class size makes a difference.', 'আমার মেয়ে ভগ্নাংশে কাঁদত, এখন গণিত পছন্দ করে। ছোট ক্লাসে আলাদা যত্ন পায় — এটাই আসল পার্থক্য।', 'Nasrin Akter', 'নাসরিন আক্তার', 'Parent of a Class 6 student', 'ষষ্ঠ শ্রেণির শিক্ষার্থীর অভিভাবক'),
('t2', 'Tariq sir explains Physics in a way my textbook never could. I went from 55 to 86 in my board exam.', 'তারিক স্যার এমনভাবে বোঝান যা বই পড়ে কখনো বুঝিনি। বোর্ড পরীক্ষায় ৫৫ থেকে ৮৬ — এটাই বড় প্রমাণ।', 'Rafiul Islam', 'রাফিউল ইসলাম', 'SSC 2024 student', 'এসএসসি ২০২৪ শিক্ষার্থী'),
('t3', 'Very professional. They called us within a day of booking to confirm everything.', 'খুবই পেশাদার। সিট বুক করার পরের দিনই ফোন করে সব নিশ্চিত করল। মনে হলো সত্যিই যত্ন নিচ্ছে।', 'Kamrul Hassan', 'কামরুল হাসান', 'Parent of a Class 9 student', 'নবম শ্রেণির শিক্ষার্থীর অভিভাবক'),
('t4', 'Farida ma''am''s Chemistry class is the reason I want to study medicine.', 'ফরিদা ম্যামের ক্লাস না পড়লে হয়তো চিকিৎসা পড়ার স্বপ্ন দেখতাম না। প্রতিটি বিক্রিয়া যে তিনি এত সহজে বোঝান — সেটাই জাদু।', 'Sadia Sultana', 'সাদিয়া সুলতানা', 'HSC 2025 student', 'এইচএসসি ২০২৫ শিক্ষার্থী')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.faqs (id, question, question_bn, answer, answer_bn, sort_order) VALUES
('faq-1', 'How do I reserve a seat?', 'কীভাবে সিট বুক করব?', 'Click ''Book a seat'' on any page, choose your course and batch, fill in the details, and submit. We will call you within 24 hours.', 'যেকোনো পাতায় ''সিট বুক করুন'' ক্লিক করে কোর্স আর ব্যাচ বেছে নিন, শিক্ষার্থীর তথ্য দিন, জমা দিন। ২৪ ঘণ্টার মধ্যে ফোন করে সব নিশ্চিত করব আর ফি পরিশোধের নিয়ম জানাব। অনলাইনে কোনো টাকা লাগে না।', 1),
('faq-2', 'What is the admission fee?', 'ভর্তি ফি কত?', 'One-time admission fee of ৳500 per child. Monthly fees range from ৳1,800 to ৳2,800 depending on level.', 'ভর্তির সময় একবার ৳৫০০ ভর্তি ফি, প্রতি শিক্ষার্থী। মাসিক ফি ৳১,৮০০ (প্রাথমিক/জুনিয়র) থেকে ৳২,৮০০ (এইচএসসি)। এছাড়া আর কোনো খরচ নেই।', 2),
('faq-3', 'How big are the batches?', 'ব্যাচের আকার কত?', 'Maximum 12–18 students depending on the course. This ensures individual attention for every student.', 'ব্যাচ ছোট রাখি — কোর্সভেদে সর্বাধিক ১২–১৮ জন। ফলে শিক্ষক প্রত্যেককে আলাদা মনোযোগ দিতে পারেন, কেউ পিছিয়ে গেলে বুঝতেও পারেন।', 3),
('faq-4', 'What payment methods are accepted?', 'ফি কীভাবে দিতে পারি?', 'We accept bKash, Nagad, and bank transfer or cash in person. No online payment required.', 'বিকাশ, নগদ, ব্যাংক ট্রান্সফার বা সরাসরি নগদ — যেকোনো পদ্ধতিতে দিতে পারেন। ফি দিতে হয় কেন্দ্রে এসে, অনলাইনে নয়।', 4),
('faq-5', 'Can I join mid-month?', 'মাসের মাঝখানে যোগ দিতে পারি?', 'Yes. We pro-rate the monthly fee for the remaining days of the first month.', 'হ্যাঁ। মাসের মাঝখানে যোগ দিলে বাকি দিনগুলোর জন্য ফি কমে যায় — যতদিন পড়বেন, শুধু ততটুকুই দেবেন।', 5),
('faq-6', 'Is there a sibling discount?', 'ভাই-বোনের কি কোনো ছাড় আছে?', 'Yes — 10% off the monthly fee for the second child. Excludes admission fee.', 'হ্যাঁ। দ্বিতীয় সন্তানের মাসিক ফিতে ১০% ছাড় মেলে। ভর্তি ফিতে ছাড় নেই, তৃতীয় সন্তানের জন্যও ছাড় নেই।', 6),
('faq-7', 'What if a batch is full?', 'ব্যাচ ভরে গেলে কী হবে?', 'You can still submit a booking request and we will put you on the waitlist.', 'এমন ক্ষেত্রেও বুকিং দিতে পারেন — অপেক্ষামাণ তালিকায় রাখব। সিট খালি হলে বা নতুন ব্যাচ শুরু হলে প্রথমেই জানিয়ে দেব।', 7),
('faq-8', 'Where is the centre located?', 'কেন্দ্রটি কোথায় অবস্থিত?', 'House 12, Road 4, Dhanmondi, Dhaka 1205. Open Sat–Thu, 8 AM to 9 PM. Fridays closed.', 'বাড়ি ১২, রোড ৪, ধানমন্ডি, ঢাকা ১২০৫। শনি–বৃহস্পতি সকাল ৮টা–রাত ৯টা, শুক্রবার বন্ধ।', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.results (id, student_name, student_name_bn, exam, exam_bn, subject, subject_bn, grade, grade_bn, year) VALUES
('r1', 'Rafiul Islam', 'রাফিউল ইসলাম', 'SSC 2024', 'এসএসসি ২০২৪', 'Physics', 'পদার্থবিজ্ঞান', 'A+', 'এ+', 2024),
('r2', 'Sadia Sultana', 'সাদিয়া সুলতানা', 'HSC 2024', 'এইচএসসি ২০২৪', 'Chemistry', 'রসায়ন', 'A+', 'এ+', 2024),
('r3', 'Tanvir Ahmed', 'তানভীর আহমেদ', 'SSC 2024', 'এসএসসি ২০২৪', 'Higher Math', 'উচ্চতর গণিত', 'A+', 'এ+', 2024),
('r4', 'Nusrat Jahan', 'নুসরাত জাহান', 'JSC 2023', 'জেএসসি ২০২৩', 'Science', 'বিজ্ঞান', 'A+', 'এ+', 2023),
('r5', 'Arif Hossain', 'আরিফ হোসেন', 'HSC 2023', 'এইচএসসি ২০২৩', 'Physics', 'পদার্থবিজ্ঞান', 'A', 'এ', 2023),
('r6', 'Fatima Begum', 'ফাতেমা বেগম', 'SSC 2023', 'এসএসসি ২০২৩', 'Chemistry', 'রসায়ন', 'A+', 'এ+', 2023),
('r7', 'Mahin Rahman', 'মাহিন রহমান', 'HSC 2024', 'এইচএসসি ২০২৪', 'Chemistry', 'রসায়ন', 'A+', 'এ+', 2024),
('r8', 'Sumaiya Akter', 'সুমাইয়া আক্তার', 'SSC 2024', 'এসএসসি ২০২৪', 'English', 'ইংরেজি', 'A+', 'এ+', 2024)
ON CONFLICT (id) DO NOTHING;
