# Supabase Project Setup For ENOUGH.

I cannot create the Supabase cloud project without access to your Supabase account. The project files and database schema are ready in this workspace.

## Fastest Manual Path

1. Go to Supabase and create a new project named `ENOUGH`.
2. Open Authentication > Providers > Email.
3. Turn on email signups and email confirmations.
4. Add these redirect URLs:
   - `http://127.0.0.1:5173`
   - your production URL
5. Open SQL Editor.
6. Paste and run:
   - `supabase/migrations/20260506120000_enough_initial_schema.sql`
7. Open Project Settings > API.
8. Copy:
   - Project URL
   - anon public key
9. Paste them into `src/app.js`:

```js
const AUTH_CONFIG = {
  supabaseUrl: "https://usczkarpqyypmlgntebd.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY",
  emailRedirectTo: "https://your-live-domain.com",
};
```

## What This Schema Adds

- User profiles
- Private journal entries
- Private mood entries
- Private body notes
- Private completed practices
- Private purpose steps
- Private worship favorites
- Public gratitude wall
- Row Level Security policies so users only manage their own saved data

## If You Want Me To Create The Cloud Project

I need one of these:

- You sign into Supabase in a browser and give me access to use it, or
- You provide a Supabase personal access token, organization id, region, project name, and database password.

Do not share a service-role key in the frontend app.
