# Masraweya Language School — V5

Creative redesign with:
- English as default language + Arabic toggle
- RTL support for Arabic
- Animated reveal transitions
- Parallax hero motion
- Responsive mobile navigation
- Creative cards, ticker, results portal block and visual sections
- Student Results URL configuration
- Contact/WhatsApp/email configuration
- CMS-ready administration panel with image specifications and previews

## Deploy
Upload the entire folder to Cloudflare Pages. No build command is required.

## Important
`admin.html` is a CMS UI preview, not a secure online CMS yet. Connect Supabase Auth/Database/Storage before using it for real publishing.


## Student Results Link
The Student Results buttons use the configured URL in `config.js`. The Admin Panel also provides a Results URL field and stores an override in this browser via localStorage. For live publishing to every visitor, connect the panel to Supabase/CMS.


### V10 Image Update
Added a responsive image system across the site sections using school/learning/activity imagery. Images are loaded from Pexels remote URLs; replace them from the Admin Media Manager when the CMS is connected.
