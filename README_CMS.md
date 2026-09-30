# Masraweya CMS

This version prepares a real CMS using Supabase Auth, Database and Storage, while Cloudflare Pages continues to serve the public site.

## One-time Supabase setup
1. Create a Supabase project.
2. In Authentication > Users, create the admin user using the email you want for the panel and your password.
3. Copy the project URL and publishable/anon key into `supabase-config.js`:
   - `url`
   - `anonKey`
   - `adminEmail`
4. Open SQL Editor and run `supabase.sql`.
5. Copy the Auth user's UUID and run the commented `insert into public.admin_users ...` line in `supabase.sql`.
6. Create a PUBLIC Storage bucket named `site-images`.
7. Commit the files to the GitHub repo connected to Cloudflare Pages. Cloudflare will automatically deploy the commit.

## Important
The browser never receives a Supabase service-role key. Only the public anon/publishable key belongs in `supabase-config.js`; RLS controls write access.
