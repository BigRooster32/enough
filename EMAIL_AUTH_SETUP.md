# Email Sign-Up Setup

The app is now wired for Supabase Auth email verification. The database schema is in `supabase/migrations/20260506120000_enough_initial_schema.sql`.

## What to do

1. Create a Supabase project.
2. In Supabase, open Authentication > Providers > Email.
3. Enable email signups and confirmation emails.
4. Add your site URL and redirect URL.
5. Copy your Project URL and anon public key.
6. Paste them into `src/app.js`:

```js
const AUTH_CONFIG = {
  supabaseUrl: "https://usczkarpqyypmlgntebd.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_PUBLIC_KEY",
  emailRedirectTo: "https://your-live-domain.com"
};
```

## Important

The current local app still saves wellness data in browser storage. Supabase Auth will send verification emails after keys are added. The Supabase database tables are prepared in the migration file, but the frontend still needs one more integration pass to read/write those tables for cross-device saved journals and moods.
