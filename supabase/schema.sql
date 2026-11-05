create table if not exists public.courses (
  id text primary key default ('course-' || gen_random_uuid()::text),
  title text not null,
  title_bn text not null default '',
  level text not null,
  level_bn text not null default '',
  classes text not null,
  classes_bn text not null default '',
  subject text not null,
  subject_bn text not null default '',
  description text not null default '',
  description_bn text not null default '',
  monthly_fee integer not null check (monthly_fee >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.batches (
  id text primary key default ('batch-' || gen_random_uuid()::text),
  course_id text not null references public.courses(id) on delete cascade,
  teacher_name text not null,
  teacher_name_bn text not null default '',
  days text not null,
  days_bn text not null default '',
  time text not null,
  time_bn text not null default '',
  capacity integer not null check (capacity > 0),
  enrolled_count integer not null default 0 check (enrolled_count >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.teachers (
  id text primary key,
  name text not null,
  subject text not null,
  qualifications jsonb not null default '[]'::jsonb,
  bio text not null default '',
  photo text not null default '',
  active boolean not null default true
);

create table if not exists public.testimonials (
  id text primary key,
  parent_name text not null,
  parent_name_bn text not null default '',
  parent_role text not null,
  parent_role_bn text not null default '',
  quote text not null,
  quote_bn text not null default '',
  active boolean not null default true
);

create table if not exists public.faqs (
  id text primary key,
  question text not null,
  answer text not null,
  display_order integer not null,
  active boolean not null default true
);

create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  data jsonb not null
);

create table if not exists public.enquiries (
  id text primary key default ('enquiry-' || gen_random_uuid()::text),
  name text not null,
  phone text not null,
  class_level text not null,
  subject text not null,
  course text not null,
  question text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key default ('booking-' || gen_random_uuid()::text),
  course_id text not null references public.courses(id) on delete restrict,
  batch_id text not null references public.batches(id) on delete restrict,
  parent_name text not null,
  student_name text not null,
  phone text not null,
  class_level text not null,
  payment_method text not null check (payment_method in ('bKash', 'Nagad', 'Bank transfer')),
  note text not null default '',
  status text not null default 'pending_payment' check (status in ('pending_payment', 'payment_submitted', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;
alter table public.batches enable row level security;
alter table public.teachers enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.site_settings enable row level security;
alter table public.enquiries enable row level security;
alter table public.bookings enable row level security;

create policy "public can read active courses" on public.courses for select using (active = true);
create policy "public can read active batches" on public.batches for select using (active = true);
create policy "public can read active teachers" on public.teachers for select using (active = true);
create policy "public can read active testimonials" on public.testimonials for select using (active = true);
create policy "public can read active faqs" on public.faqs for select using (active = true);
create policy "public can read site settings" on public.site_settings for select using (true);
create policy "public can submit enquiries" on public.enquiries for insert with check (true);
create policy "public can submit bookings" on public.bookings for insert with check (true);

-- ── Enrolled count trigger ──────────────────────────────────────────
-- Keeps batches.enrolled_count in sync when booking status changes.
-- Increment when a booking becomes 'confirmed'.
-- Decrement when a booking moves away from 'confirmed'.

create or replace function public.sync_enrolled_count()
returns trigger language plpgsql as $$
begin
  -- Moving INTO confirmed: increment
  if NEW.status = 'confirmed' and (OLD.status is null or OLD.status <> 'confirmed') then
    update public.batches
      set enrolled_count = enrolled_count + 1
      where id = NEW.batch_id;

  -- Moving OUT OF confirmed: decrement (floor at 0)
  elsif OLD.status = 'confirmed' and NEW.status <> 'confirmed' then
    update public.batches
      set enrolled_count = greatest(enrolled_count - 1, 0)
      where id = NEW.batch_id;
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_sync_enrolled_count on public.bookings;
create trigger trg_sync_enrolled_count
  after update of status on public.bookings
  for each row execute function public.sync_enrolled_count();
