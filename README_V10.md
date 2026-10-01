# Masraweya CMS V10 — Google Drive Import

Google Drive is now used as the image source, not the public image host.

1. Paste a Google Drive file link into any image URL field.
2. Click **Use Google Drive**.
3. The Cloudflare Pages Function `/drive-image` fetches the public Drive image.
4. The Admin panel uploads the image into the existing Supabase `site-images` bucket.
5. The field is saved with the Supabase public URL, so the public website does not depend on Google Drive delivery.

The Drive file must be shared as **Anyone with the link → Viewer**.

Important: after uploading the V10 files to GitHub, Cloudflare Pages must deploy the `functions/drive-image.js` file too. No extra Supabase SQL is required.
