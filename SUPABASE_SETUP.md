# Masraweya V5 — CMS connection plan

The public site is static and deploys directly to Cloudflare Pages. The V5 admin UI is intentionally not pretending to be a secure CMS.

## Recommended architecture
- Cloudflare Pages: public website
- Supabase Auth: admin email/password login
- Supabase Database: bilingual content, contact settings, results URL, news and activities
- Supabase Storage: school images
- Row Level Security: only the authenticated admin can edit content

Supabase's JavaScript client supports email/password authentication and persistent browser sessions. Cloudflare Pages Functions can also provide server-side functionality when needed.

## Suggested tables
- `site_settings`: `key`, `value_en`, `value_ar`, `value_json`
- `pages`: `slug`, `title_en`, `title_ar`, `body_en`, `body_ar`, `published`
- `news`: `title_en`, `title_ar`, `body_en`, `body_ar`, `image_url`, `published_at`
- `media`: `name`, `url`, `width`, `height`, `alt_en`, `alt_ar`

## Storage
Create a public-read bucket named `site-images`. Admin uploads should be protected by authenticated policies.

## Admin login
Create one admin user in Supabase Auth. The website should use the Supabase publishable key in the browser and RLS policies for authorization. Never place a Supabase service-role key in front-end code.

## Results
Store the real published results URL in `site_settings`, then the public website's Student Results buttons can all use the same value.
