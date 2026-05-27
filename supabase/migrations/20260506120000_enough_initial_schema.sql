create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  focus text not null default 'Peace',
  intention text not null default 'Live grounded, loved, and whole.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pillar text not null check (pillar in ('mind', 'purpose', 'faith')),
  prompt text not null default '',
  title text not null default '',
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.body_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Body note',
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.completed_practices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  practice_title text not null,
  created_at timestamptz not null default now(),
  unique (user_id, practice_title)
);

create table if not exists public.purpose_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.worship_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.gratitude_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Anonymous',
  content text not null,
  hearts integer not null default 0 check (hearts >= 0),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.journal_entries enable row level security;
alter table public.mood_entries enable row level security;
alter table public.body_notes enable row level security;
alter table public.completed_practices enable row level security;
alter table public.purpose_steps enable row level security;
alter table public.worship_favorites enable row level security;
alter table public.gratitude_posts enable row level security;

create policy "Profiles are private" on public.profiles
  for all using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own journals" on public.journal_entries
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own moods" on public.mood_entries
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own body notes" on public.body_notes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own practices" on public.completed_practices
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own purpose steps" on public.purpose_steps
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own worship favorites" on public.worship_favorites
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can read gratitude wall" on public.gratitude_posts
  for select using (true);

create policy "Signed-in users create gratitude" on public.gratitude_posts
  for insert with check (auth.uid() = user_id);

create policy "Users update own gratitude" on public.gratitude_posts
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists journal_entries_user_created_idx on public.journal_entries (user_id, created_at desc);
create index if not exists mood_entries_user_created_idx on public.mood_entries (user_id, created_at desc);
create index if not exists gratitude_posts_created_idx on public.gratitude_posts (created_at desc);

