# Connected build notes

This build is configured for the current Masraweya Supabase project.
- Supabase URL: configured in `supabase-config.js`
- Browser key: publishable key only
- Admin email: configured in `supabase-config.js`
- Storage bucket: `site-images`
- Results URL: stored in the CMS content model

Run `supabase_cms_v1_compat.sql` in Supabase SQL Editor before deploying this build.
Do not put a Supabase secret/service-role key in frontend files.
