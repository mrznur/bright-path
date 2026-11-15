# BrightPath Coaching Center

Bilingual (English / Bangla) coaching center website with public pages and a full admin dashboard for managing courses, batches, teachers, FAQs, testimonials, results, and site settings.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Neon Postgres**.

---

## Features

- **Public site**: Homepage, course catalog with live seat counts, course detail pages, fees page, teacher profiles, student results, FAQ, contact form, and a booking form with batch selection.
- **Admin dashboard** (`/admin`): Full CRUD for courses, batches, teachers, FAQs, testimonials, results, and site config. Manage bookings and enquiries.
- **Bilingual**: Every piece of content has English and Bangla versions. Toggle in the navbar.
- **Database-backed**: Content is served from Neon Postgres. Falls back to static seed data if `DATABASE_URL` is not set.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
DATABASE_URL=postgres://user:password@ep-xxx.region.aws.neon.tech/brightpath?sslmode=require
ADMIN_JWT_SECRET=replace_with_a_long_random_string
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=change_this_password
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `ADMIN_JWT_SECRET` | Secret used to sign admin session JWTs. Generate with `openssl rand -hex 32` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

## Database Setup

Run `db/schema.sql` in the Neon SQL editor. It creates all tables, seeds initial data, and is safe to re-run (uses `IF NOT EXISTS` / `ON CONFLICT DO NOTHING`).

Tables: `teachers`, `courses`, `batches`, `site_config`, `testimonials`, `faqs`, `results`, `bookings`, `enquiries`.

## Admin Access

- URL: `/admin/login`
- Credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
- Auth is JWT-based (signed with `ADMIN_JWT_SECRET`), stored as an `httpOnly` cookie, expires after 8 hours
- No user table — single admin only

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Neon Postgres (`@neondatabase/serverless`) |
| Auth | `jose` (JWT) |
| Icons | `react-icons` (Feather) |
| Deployment | Netlify |

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes (public + admin)
│   ├── book/           # Public booking page
│   ├── contact/        # Contact form page
│   ├── courses/        # Course catalog + detail
│   ├── faq/            # FAQ page
│   ├── fees-admission/ # Pricing page
│   └── teachers-results/ # Teachers + results page
├── components/
│   ├── site/           # BookingForm, EnquiryForm, CourseCard
│   ├── ui/             # Button, Input, Select, Card, Chip, Toast, etc.
│   └── ...             # Navbar, Footer, ContentProvider, LanguageProvider
├── data/               # Static seed data (fallback when DB is empty)
├── lib/                # db.ts, admin-auth.ts, admin-api.ts, cn.ts
└── types/              # TypeScript interfaces
```

## Deployment

The repo is connected to Netlify. Pushes to `main` trigger auto-deploy.

Make sure the four environment variables above are set in **Netlify → Site configuration → Environment variables**.
