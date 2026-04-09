# Tour HQ

Static Tour HQ MVP for GitHub Pages, with an optional Supabase upgrade path.

## Live site
- https://philmauro13.github.io/VanaTourHQ/landing.html

## Current architecture
- Static HTML/CSS/JS pages
- localStorage persistence by default
- Progressive Supabase support for:
  - auth
  - profiles
  - tours
  - day sheets schema foundation

## Supabase setup
1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL editor
3. Copy `config.example.js` to `config.js`
4. Fill in your project URL and anon key in `config.js`
5. Deploy `config.js` with the site

## Important
- If `config.js` is missing, Tour HQ still works in localStorage demo mode
- For GitHub Pages, do **not** commit real secrets beyond the public anon key
- Current wired remote flows:
  - signup
  - login
  - create tour

## Next recommended build steps
1. Load tours from Supabase on the dashboard
2. Save day sheets to Supabase
3. Move documents to Supabase Storage
4. Add route/day ownership per active tour
