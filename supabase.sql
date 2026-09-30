-- Masraweya CMS setup for Supabase
create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

insert into public.site_content (id, content) values (1, '{"site":{"resultsUrl":"https://script.google.com/macros/s/AKfycbw6y9W7_-A7eXX86JyJVSbQ1QkHcywCxOI2W8etQXmj4hbG1TwfXEOnFWsW_1OOD9JD/exec"}}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

create policy "public can read site content" on public.site_content for select using (true);
create policy "admins can insert site content" on public.site_content for insert with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
create policy "admins can update site content" on public.site_content for update using (exists (select 1 from public.admin_users a where a.user_id = auth.uid())) with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
create policy "admins can read themselves" on public.admin_users for select using (auth.uid() = user_id);

-- After creating your Supabase Auth user, run:
-- insert into public.admin_users (user_id) values ('YOUR-AUTH-USER-UUID');

-- Storage: create a PUBLIC bucket named school-media in Dashboard > Storage.
-- Then add policies that allow authenticated admins to upload/update/delete objects.
