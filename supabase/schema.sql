create extension if not exists pgcrypto;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  username text unique not null,
  full_name text,
  role text not null default 'crew' check (role in ('tour_manager', 'crew')),
  tour_id uuid references public.tours(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tours
create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  artist_name text not null,
  start_date date not null,
  end_date date not null,
  tm_name text,
  tm_email text,
  booking_agent text,
  vehicle_type text not null default 'bus' check (vehicle_type in ('bus', 'van', 'suv', 'other')),
  drive_speed_mph integer not null default 55,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Day Sheets
create table if not exists public.day_sheets (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  day_date date not null,
  city text,
  venue_name text,
  venue_address text,
  promoter_contact text,
  hotel_info text,
  notes text,
  is_show boolean not null default true,
  entries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tour_id, day_date)
);

-- Documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tour_id uuid references public.tours(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  bucket text not null default 'tour-hq-docs',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated-at function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

drop trigger if exists tours_set_updated_at on public.tours;
create trigger tours_set_updated_at
before update on public.tours
for each row execute procedure public.handle_updated_at();

drop trigger if exists day_sheets_set_updated_at on public.day_sheets;
create trigger day_sheets_set_updated_at
before update on public.day_sheets
for each row execute procedure public.handle_updated_at();

drop trigger if exists documents_set_updated_at on public.documents;
create trigger documents_set_updated_at
before update on public.documents
for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.tours enable row level security;
alter table public.day_sheets enable row level security;
alter table public.documents enable row level security;
alter table public.guest_list_requests enable row level security;

-- Profiles policies
create policy "users can view own profile" on public.profiles
for select using (auth.uid() = id);

create policy "users can insert own profile" on public.profiles
for insert with check (auth.uid() = id);

create policy "users can update own profile" on public.profiles
for update using (auth.uid() = id);

-- Tours policies
create policy "users can view own tours" on public.tours
for select using (auth.uid() = user_id);

create policy "users can create own tours" on public.tours
for insert with check (auth.uid() = user_id);

create policy "users can update own tours" on public.tours
for update using (auth.uid() = user_id);

-- Day sheets policies
create policy "users can view own day sheets" on public.day_sheets
for select using (
  exists (
    select 1 from public.tours
    where tours.id = day_sheets.tour_id and tours.user_id = auth.uid()
  )
);

create policy "users can create own day sheets" on public.day_sheets
for insert with check (
  exists (
    select 1 from public.tours
    where tours.id = day_sheets.tour_id and tours.user_id = auth.uid()
  )
);

create policy "users can update own day sheets" on public.day_sheets
for update using (
  exists (
    select 1 from public.tours
    where tours.id = day_sheets.tour_id and tours.user_id = auth.uid()
  )
);

-- Documents policies
create policy "users can view own documents" on public.documents
for select using (auth.uid() = user_id);

create policy "users can insert own documents" on public.documents
for insert with check (auth.uid() = user_id);

create policy "users can update own documents" on public.documents
for update using (auth.uid() = user_id);

create policy "users can delete own documents" on public.documents
for delete using (auth.uid() = user_id);

-- Guest List Requests
create table if not exists public.guest_list_requests (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete cascade,
  guest_name text not null,
  guest_email text,
  guest_count integer not null default 1,
  pass_type text not null default 'guest' check (pass_type in ('guest', 'industry', 'comp', 'vip')),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create policy "users can view own tour guest requests" on public.guest_list_requests
for select using (
  exists (select 1 from public.profiles where id = auth.uid() and tour_id = guest_list_requests.tour_id)
);
create policy "crew can submit guest requests" on public.guest_list_requests
for insert with check (auth.uid() = requested_by);
create policy "tour managers can update guest requests" on public.guest_list_requests
for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'tour_manager' and tour_id = guest_list_requests.tour_id)
);

-- Storage bucket (run this once manually if not auto-created)
-- insert into storage.buckets (id, name, public) values ('tour-hq-docs', 'tour-hq-docs', false) on conflict do nothing;

-- Storage policies
-- create policy "users can upload own files" on storage.objects
-- for insert with check (bucket_id = 'tour-hq-docs' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "users can read own files" on storage.objects
-- for select using (bucket_id = 'tour-hq-docs' and auth.uid()::text = (storage.foldername(name))[1]);

-- create policy "users can delete own files" on storage.objects
-- for delete using (bucket_id = 'tour-hq-docs' and auth.uid()::text = (storage.foldername(name))[1]);
