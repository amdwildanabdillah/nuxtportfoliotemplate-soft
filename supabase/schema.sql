-- ============================================================
--  SCHEMA SUPABASE UNTUK TEMPLATE PORTFOLIO
--  Jalankan SEKALI: Supabase Dashboard → SQL Editor → New query →
--  tempel seluruh isi file ini → Run.
--  Aman dijalankan ulang (memakai "if not exists" / "on conflict").
-- ============================================================

-- ---------- 1. TABEL ----------
create table if not exists public.main_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  layout_type text not null default 'cards' check (layout_type in ('cards', 'video', 'gallery', 'development', 'videography', 'photography')),
  bento_image_url text,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sub_categories (
  id uuid primary key default gen_random_uuid(),
  main_category_id uuid not null references public.main_categories(id) on delete cascade,
  name text not null,
  slug text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  main_category_id uuid not null references public.main_categories(id) on delete cascade,
  sub_category_id uuid references public.sub_categories(id) on delete set null,
  title text not null,
  slug text unique,
  client_name text,
  desc_short text,
  desc_long text,
  cover_type text not null default 'image',   -- image | youtube | drive
  cover_url text,
  tech_stack text[] not null default '{}',
  live_url text,
  github_url text,
  is_archived boolean not null default false,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_type text not null default 'image',
  media_url text not null,
  sort_order int not null default 0
);

create table if not exists public.site_settings (
  id int primary key,
  contact_email text,
  contact_whatsapp text,
  portfolio_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  svg_icon text,
  is_active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'work' check (kind in ('work', 'organization', 'education', 'certificate')),
  title text not null,
  organization text,
  location text,
  period_start date,
  period_end date,
  is_current boolean not null default false,
  description text,
  link_url text,
  image_url text,
  logo_url text,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (main_category_id, is_archived, sort_order);
create index if not exists project_media_project_idx on public.project_media (project_id, sort_order);

-- ---------- 2. KEAMANAN (RLS) ----------
-- Pengunjung boleh MEMBACA. Hanya admin yang sudah login boleh MENGUBAH.
do $$
declare t text;
begin
  foreach t in array array['main_categories','sub_categories','projects','project_media','site_settings','social_links','experiences']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ---------- 3. STORAGE (tempat upload gambar) ----------
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

drop policy if exists "portfolio images public read" on storage.objects;
create policy "portfolio images public read" on storage.objects
  for select using (bucket_id = 'portfolio-images');

drop policy if exists "portfolio images admin write" on storage.objects;
create policy "portfolio images admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'portfolio-images') with check (bucket_id = 'portfolio-images');

-- ---------- 4. DATA AWAL ----------
-- Kategori awal. Ubah / tambah sesuka hati (layout_type: cards | video | gallery).
insert into public.main_categories (name, slug, layout_type, sort_order, description) values
  ('Projects', 'projects', 'cards', 0, 'A selection of things I have built and worked on.'),
  ('Videos', 'videos', 'video', 1, 'Moving images and sound, one story at a time.'),
  ('Gallery', 'gallery', 'gallery', 2, 'Single frames that say more than words can.')
on conflict (slug) do nothing;

insert into public.site_settings (id, contact_email) values (1, 'hello@example.com')
on conflict (id) do nothing;
