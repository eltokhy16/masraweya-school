# Masraweya Language School Website V4

## What changed
- Removed the homepage "Visit Us" section that contained the large school-building image.
- Added `admin.html`, a clean control panel for editing the main website content.
- Added `content.json` as the website content source.
- Homepage reads editable content from `content.json`.
- Admin panel can edit Hero, About, Language/Academics, Academic Journey, Activities, Results, News, Gallery, Contact and Footer content.
- Responsive layout remains included.

## Important about GitHub Pages
GitHub Pages is a static host. A browser page cannot securely rewrite files inside your GitHub repository without an authenticated backend. Therefore this V4 panel includes:
1. Edit content.
2. Save a local draft.
3. Download an updated `content.json`.
4. Upload/replace `content.json` in GitHub Pages.

### Admin URL
After publishing to GitHub Pages:
`https://YOUR-USERNAME.github.io/masraweya-school/admin.html`

This is NOT a secure private admin login yet. Do not treat it as a protected CMS.

## Recommended next upgrade
For true live editing + secure login + image uploads while keeping hosting free, connect the panel to a free Supabase project:
- Supabase Auth for admin login.
- Supabase Database for content.
- Supabase Storage for school photos.
Then the admin panel can publish changes live without uploading files to GitHub.
