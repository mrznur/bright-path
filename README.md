# BrightPath Coaching Center

A bilingual (English/Bangla) website for a coaching center in Dhaka, Bangladesh. Built with Next.js, Supabase, and Tailwind CSS.

## What's inside

- **Public site** — home, courses, course details, fees & admission, teachers & results, FAQ, contact, seat booking
- **Admin panel** — login, dashboard, course/batch management, enquiries, bookings, site content editor
- **Database** — Supabase (Postgres) for all dynamic content: courses, batches, teachers, testimonials, FAQs, site settings, enquiries, bookings

## Tech stack

- Next.js 15 (App Router)
- React 19
- Supabase (Postgres)
- Tailwind CSS 3
- TypeScript
- Jose (JWT auth for admin)

## Getting started

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```
NEXT_PUBLIC_SUPABASE_URL=         # your Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key (server only)
ADMIN_EMAIL=                      # admin login email
ADMIN_PASSWORD=                    # admin login password
ADMIN_SESSION_SECRET=             # random string, 32+ characters
```

### 3. Set up the database

Create the following tables in your Supabase project:

- `courses` (id, title, title_bn, level, level_bn, classes, classes_bn, subject, subject_bn, description, description_bn, monthly_fee, active, created_at)
- `batches` (id, course_id, teacher_name, teacher_name_bn, days, days_bn, time, time_bn, capacity, enrolled_count, active, created_at)
- `teachers` (id, name, subject, qualifications, bio, photo, active)
- `testimonials` (id, parent_name, parent_name_bn, parent_role, parent_role_bn, quote, quote_bn, active)
- `faqs` (id, question, answer, question_bn, answer_bn, display_order, active)
- `site_settings` (id, data) — single row with JSON containing phone, address, hours, facebook, map URLs
- `enquiries` (id, name, phone, class_level, subject, course, question, status, created_at)
- `bookings` (id, batch_id, course_id, parent_name, student_name, phone, class_level, payment_method, note, status, created_at)

### 4. Seed the database

After logging into the admin panel, call the seed endpoint once to populate initial data:

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Cookie: brightpath_admin_session=<your-session-token>"
```

Or use the seed data files in `client/src/data/` as a reference to insert manually via Supabase Studio.

### 5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Project structure

```
BrightPath/
├── assets/              # Design mockups and reference images
├── supabase/            # Database schema/migrations
├── client/              # Next.js app
│   ├── src/
│   │   ├── app/         # Pages and API routes
│   │   │   ├── admin/    # Admin panel pages
│   │   │   ├── api/      # API routes (content, enquiries, bookings, admin)
│   │   │   ├── book/     # Seat booking page
│   │   │   ├── contact/  # Contact/enquiry form
│   │   │   ├── courses/  # Course catalog and details
│   │   │   ├── faq/      # FAQ page
│   │   │   ├── fees-admission/
│   │   │   └── teachers-results/
│   │   ├── components/   # Navbar, Footer, ContentProvider, etc.
│   │   ├── data/         # Seed data (courses, teachers, FAQs, etc.)
│   │   ├── lib/          # Supabase client, admin auth
│   │   └── types/        # TypeScript types
│   └── public/           # Logo, images, avatars
└── .gitignore
```

## Admin access

Go to `/admin/login` and sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env.local`.

## License

This is a private project for BrightPath Coaching Center.
