-- ===========================================
-- 001_create_graves_tables.sql
-- Maakt de tabellen 'graves' en 'memories'
-- en zet basis Row Level Security-policies.
-- ===========================================

-- Tabel 'graves'
create table if not exists public.graves (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  name text not null,
  birth_date date not null,
  death_date date not null,
  biography text,
  grave_photo_url text,
  deceased_photo_url text,
  location_latitude double precision,
  location_longitude double precision,
  location_description text,
  user_id uuid not null references auth.users(id) on delete cascade
);

-- Tabel 'memories'
create table if not exists public.memories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now() not null,
  text text not null,
  date date not null,
  author text not null,
  grave_id uuid not null references public.graves(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null
);

-- RLS inschakelen
alter table public.graves enable row level security;
alter table public.memories enable row level security;

-- Beleidsregels voor 'graves'
create policy "insert_own_graves"
  on public.graves for insert
  with check (auth.uid() = user_id);

create policy "select_all_graves"
  on public.graves for select
  using (true);

create policy "update_own_graves"
  on public.graves for update
  using (auth.uid() = user_id);

create policy "delete_own_graves"
  on public.graves for delete
  using (auth.uid() = user_id);

-- Beleidsregels voor 'memories'
create policy "insert_memories"
  on public.memories for insert
  with check (true);

create policy "select_memories"
  on public.memories for select
  using (true);
