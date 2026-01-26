-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. NEWS TABLE
create table if not exists public.news (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image_url text,
  published_at timestamptz,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- 2. ANNOUNCEMENTS TABLE
create table if not exists public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text,
  is_urgent boolean default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- 3. EVENTS TABLE
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  event_date timestamptz not null,
  location text,
  category text check (category in ('Sports', 'Academic', 'General', 'Other')),
  created_at timestamptz default now()
);

-- 4. GALLERY TABLE
create table if not exists public.gallery (
  id uuid default uuid_generate_v4() primary key,
  title text,
  image_url text not null,
  category text,
  created_at timestamptz default now()
);

-- 5. HERO SLIDES TABLE
create table if not exists public.hero_slides (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  title text, -- Green small text
  subtitle text, -- Big white text
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table public.news enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;

-- CREATE POLICIES

-- DROP POLICIES IF THEY EXIST (to allow updates/re-runs)
drop policy if exists "Public can read news" on public.news;
drop policy if exists "Authenticated can insert news" on public.news;
drop policy if exists "Authenticated can update news" on public.news;
drop policy if exists "Authenticated can delete news" on public.news;

drop policy if exists "Public can read announcements" on public.announcements;
drop policy if exists "Authenticated can insert announcements" on public.announcements;
drop policy if exists "Authenticated can update announcements" on public.announcements;
drop policy if exists "Authenticated can delete announcements" on public.announcements;

drop policy if exists "Public can read events" on public.events;
drop policy if exists "Authenticated can insert events" on public.events;
drop policy if exists "Authenticated can update events" on public.events;
drop policy if exists "Authenticated can delete events" on public.events;

drop policy if exists "Public can read gallery" on public.gallery;
drop policy if exists "Authenticated can insert gallery" on public.gallery;
drop policy if exists "Authenticated can update gallery" on public.gallery;
drop policy if exists "Authenticated can delete gallery" on public.gallery;

drop policy if exists "Public can read hero_slides" on public.hero_slides;
drop policy if exists "Authenticated can insert hero_slides" on public.hero_slides;
drop policy if exists "Authenticated can update hero_slides" on public.hero_slides;
drop policy if exists "Authenticated can delete hero_slides" on public.hero_slides;

-- CREATE POLICIES

-- Public Access (Read-only)
create policy "Public can read news" on public.news for select using (true);
create policy "Public can read announcements" on public.announcements for select using (true);
create policy "Public can read events" on public.events for select using (true);
create policy "Public can read gallery" on public.gallery for select using (true);
create policy "Public can read hero_slides" on public.hero_slides for select using (true);

-- Authenticated Access (Write - Insert, Update, Delete)
create policy "Authenticated can insert news" on public.news for insert to authenticated with check (true);
create policy "Authenticated can update news" on public.news for update to authenticated using (true);
create policy "Authenticated can delete news" on public.news for delete to authenticated using (true);

create policy "Authenticated can insert announcements" on public.announcements for insert to authenticated with check (true);
create policy "Authenticated can update announcements" on public.announcements for update to authenticated using (true);
create policy "Authenticated can delete announcements" on public.announcements for delete to authenticated using (true);

create policy "Authenticated can insert events" on public.events for insert to authenticated with check (true);
create policy "Authenticated can update events" on public.events for update to authenticated using (true);
create policy "Authenticated can delete events" on public.events for delete to authenticated using (true);

create policy "Authenticated can insert gallery" on public.gallery for insert to authenticated with check (true);
create policy "Authenticated can update gallery" on public.gallery for update to authenticated using (true);
create policy "Authenticated can delete gallery" on public.gallery for delete to authenticated using (true);

create policy "Authenticated can insert hero_slides" on public.hero_slides for insert to authenticated with check (true);
create policy "Authenticated can update hero_slides" on public.hero_slides for update to authenticated using (true);
create policy "Authenticated can delete hero_slides" on public.hero_slides for delete to authenticated using (true);

-- 5. STORAGE BUCKET SETUP
-- Note: 'storage' schema comes with Supabase.
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

-- Storage Policies
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- 1. Public Read Access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- 2. Authenticated Upload Access
create policy "Authenticated Upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'images' );

-- 3. Authenticated Delete Access
create policy "Authenticated Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'images' );

-- 6. ADMINISTRATION TABLE
create table if not exists public.administration (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null,
  image_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.administration enable row level security;

-- Drop existing to prevent errors
drop policy if exists "Public can read administration" on public.administration;
drop policy if exists "Authenticated can insert administration" on public.administration;
drop policy if exists "Authenticated can update administration" on public.administration;
drop policy if exists "Authenticated can delete administration" on public.administration;

create policy "Public can read administration" on public.administration for select using (true);
create policy "Authenticated can insert administration" on public.administration for insert to authenticated with check (true);
create policy "Authenticated can update administration" on public.administration for update to authenticated using (true);
create policy "Authenticated can delete administration" on public.administration for delete to authenticated using (true);

-- 7. ACADEMICS TABLES

-- Academic Levels (O-Level, A-Level)
create table if not exists public.academic_levels (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Departments
create table if not exists public.departments (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  head_of_department text,
  created_at timestamptz default now()
);

-- Subjects
create table if not exists public.subjects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  level_id uuid references public.academic_levels(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  description text,
  created_at timestamptz default now()
);

-- RLS Policies for Academics
alter table public.academic_levels enable row level security;
alter table public.departments enable row level security;
alter table public.subjects enable row level security;

-- Drop existing policies to prevent "already exists" errors
drop policy if exists "Public can read academic_levels" on public.academic_levels;
drop policy if exists "Public can read departments" on public.departments;
drop policy if exists "Public can read subjects" on public.subjects;
drop policy if exists "Authenticated can insert academic_levels" on public.academic_levels;
drop policy if exists "Authenticated can update academic_levels" on public.academic_levels;
drop policy if exists "Authenticated can delete academic_levels" on public.academic_levels;
drop policy if exists "Authenticated can insert departments" on public.departments;
drop policy if exists "Authenticated can update departments" on public.departments;
drop policy if exists "Authenticated can delete departments" on public.departments;
drop policy if exists "Authenticated can insert subjects" on public.subjects;
drop policy if exists "Authenticated can update subjects" on public.subjects;
drop policy if exists "Authenticated can delete subjects" on public.subjects;

create policy "Public can read academic_levels" on public.academic_levels for select using (true);
create policy "Public can read departments" on public.departments for select using (true);
create policy "Public can read subjects" on public.subjects for select using (true);

create policy "Authenticated can insert academic_levels" on public.academic_levels for insert to authenticated with check (true);
create policy "Authenticated can update academic_levels" on public.academic_levels for update to authenticated using (true);
create policy "Authenticated can delete academic_levels" on public.academic_levels for delete to authenticated using (true);

create policy "Authenticated can insert departments" on public.departments for insert to authenticated with check (true);
create policy "Authenticated can update departments" on public.departments for update to authenticated using (true);
create policy "Authenticated can delete departments" on public.departments for delete to authenticated using (true);

create policy "Authenticated can insert subjects" on public.subjects for insert to authenticated with check (true);
create policy "Authenticated can update subjects" on public.subjects for update to authenticated using (true);
create policy "Authenticated can delete subjects" on public.subjects for delete to authenticated using (true);
-- 8. ADMISSIONS TABLES

-- Admissions Settings (Status, Year, Dates)
create table if not exists public.admissions_settings (
  id uuid default uuid_generate_v4() primary key,
  status text not null default 'Closed',
  academic_year text,
  application_deadline timestamptz,
  reporting_date timestamptz,
  updated_at timestamptz default now()
);

-- Admissions Steps
create table if not exists public.admissions_steps (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Required Documents
create table if not exists public.admissions_requirements (
  id uuid default uuid_generate_v4() primary key,
  document_name text not null,
  purpose text,
  is_mandatory boolean default true,
  created_at timestamptz default now()
);

-- RLS Policies for Admissions
alter table public.admissions_settings enable row level security;
alter table public.admissions_steps enable row level security;
alter table public.admissions_requirements enable row level security;

-- Drop existing to prevent errors
drop policy if exists "Public can read admissions_settings" on public.admissions_settings;
drop policy if exists "Public can read admissions_steps" on public.admissions_steps;
drop policy if exists "Public can read admissions_requirements" on public.admissions_requirements;
drop policy if exists "Admin handle admissions_settings" on public.admissions_settings;
drop policy if exists "Admin handle admissions_steps" on public.admissions_steps;
drop policy if exists "Admin handle admissions_requirements" on public.admissions_requirements;

create policy "Public can read admissions_settings" on public.admissions_settings for select using (true);
create policy "Public can read admissions_steps" on public.admissions_steps for select using (true);
create policy "Public can read admissions_requirements" on public.admissions_requirements for select using (true);

create policy "Admin handle admissions_settings" on public.admissions_settings for all to authenticated using (true);
create policy "Admin handle admissions_steps" on public.admissions_steps for all to authenticated using (true);
create policy "Admin handle admissions_requirements" on public.admissions_requirements for all to authenticated using (true);

-- Initial seed for settings if none exist
insert into public.admissions_settings (status, academic_year)
select 'Upcoming', '2026'
where not exists (select 1 from public.admissions_settings);
-- 9. ADMISSIONS PHASE 2 TABLES

-- Admissions Inquiries
create table if not exists public.admissions_inquiries (
  id uuid default uuid_generate_v4() primary key,
  parent_name text not null,
  email text not null,
  phone text,
  student_level text,
  message text,
  status text default 'Pending',
  created_at timestamptz default now()
);

-- Admissions Downloads
create table if not exists public.admissions_downloads (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  file_url text not null,
  file_type text default 'PDF',
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- RLS Policies for Phase 2
alter table public.admissions_inquiries enable row level security;
alter table public.admissions_downloads enable row level security;

-- Drop existing to prevent errors
drop policy if exists "Public can insert inquiries" on public.admissions_inquiries;
drop policy if exists "Public can read downloads" on public.admissions_downloads;
drop policy if exists "Admin handle inquiries" on public.admissions_inquiries;
drop policy if exists "Admin handle downloads" on public.admissions_downloads;

-- Public can insert inquiries and read downloads
create policy "Public can insert inquiries" on public.admissions_inquiries for insert with check (true);
create policy "Public can read downloads" on public.admissions_downloads for select using (true);

-- Admin can manage everything
create policy "Admin handle inquiries" on public.admissions_inquiries for all to authenticated using (true);
create policy "Admin handle downloads" on public.admissions_downloads for all to authenticated using (true);
-- 10. CONTACT TABLES

-- Contact Settings (School Address, Phones, Emails, Hours)
create table if not exists public.contact_settings (
  id uuid default uuid_generate_v4() primary key,
  address text not null,
  phone_main text not null,
  phone_admissions text,
  email_general text not null,
  email_admissions text,
  office_hours text not null,
  map_embed_url text, -- For Google Maps iframe
  updated_at timestamptz default now()
);

-- Contact Messages (Inquiries from the form)
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'Unread', -- Unread, Read, Replied, Archived
  created_at timestamptz default now()
);

-- RLS Policies for Contact
alter table public.contact_settings enable row level security;
alter table public.contact_messages enable row level security;

-- Drop existing to prevent errors
drop policy if exists "Public can read contact_settings" on public.contact_settings;
drop policy if exists "Public can insert contact_messages" on public.contact_messages;
drop policy if exists "Admin handle contact_settings" on public.contact_settings;
drop policy if exists "Admin handle contact_messages" on public.contact_messages;

-- Public Access
create policy "Public can read contact_settings" on public.contact_settings for select using (true);
create policy "Public can insert contact_messages" on public.contact_messages for insert with check (true);

-- Admin Access
create policy "Admin handle contact_settings" on public.contact_settings for all to authenticated using (true);
create policy "Admin handle contact_messages" on public.contact_messages for all to authenticated using (true);

-- Initial seed for contact settings if none exist
insert into public.contact_settings (address, phone_main, email_general, office_hours, map_embed_url)
select 
    'Bugisu High School, Mbale, Uganda', 
    '+256 000 000 000', 
    'info@bugisuhighschool.com', 
    'Mon - Fri: 8:00 AM - 5:00 PM',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.097062909087!2d34.17268087521489!3d1.0894636989000828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1778b63874ea2aa9%3A0x8da182477d64c8fa!2sBugisu%20High%20School!5e0!3m2!1sen!2sug!4v1768122083514!5m2!1sen!2sug'
where not exists (select 1 from public.contact_settings);
