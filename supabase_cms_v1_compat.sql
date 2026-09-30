-- Masraweya CMS V1 compatibility layer
-- Run this AFTER the main CMS schema/policies already created.

create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_content (id, content)
values (
  1,
  '{
    "site": {
      "name": {
        "en": "Masraweya Language School",
        "ar": "مدرسة مصراوية للغات"
      },
      "sub": {
        "en": "Language School",
        "ar": "مدرسة لغات"
      },
      "tagline": {
        "en": "Inspiring minds. Building futures.",
        "ar": "نُلهم العقول. نبني المستقبل."
      },
      "resultsUrl": "https://script.google.com/macros/s/AKfycbw6y9W7_-A7eXX86JyJVSbQ1QkHcywCxOI2W8etQXmj4hbG1TwfXEOnFWsW_1OOD9JD/exec"
    }
  }'::jsonb
)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

drop policy if exists "Public can read site content V1" on public.site_content;
drop policy if exists "Admins manage site content V1" on public.site_content;

create policy "Public can read site content V1"
on public.site_content
for select
to anon, authenticated
using (true);

create policy "Admins manage site content V1"
on public.site_content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.site_content to anon, authenticated;
grant all on public.site_content to authenticated;
