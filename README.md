# Offer When

A React app to track job applications and HR contacts: add entries with HR name, company, email, phone, job ID, and email content. Update status, mark as done, edit, or remove entries. Uses Supabase for auth (Google) and per-user data.

## Setup

1. Copy `.env.example` to `.env` and set `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`.
2. In Supabase: run `supabase/schema.sql` and `supabase/rls.sql` in the SQL Editor. Enable the Google provider under Authentication > Providers.
3. **Google OAuth (fix redirect_uri_mismatch):**
   - In **Supabase Dashboard** go to **Authentication > Providers > Google**. Copy the **Callback URL** (e.g. `https://xxxx.supabase.co/auth/v1/callback`).
   - In **Google Cloud Console** go to **APIs & Services > Credentials**, open your OAuth 2.0 Client ID (or create one for “Web application”).
   - Under **Authorized redirect URIs** add the **exact** Supabase callback URL from step 1.
   - Under **Authorized JavaScript origins** add `http://localhost:3000` (and your production URL when you deploy).
   - Save. Wait a few minutes if the error persists.
4. Run the app:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Add email** – HR name, company, email, phone, job ID (from a list you manage), email content, status
- **Edit** – Update any field of an existing entry
- **Status** – Change status from the dropdown on each card (Sent, Replied, Interview Scheduled, etc.)
- **Check mark** – Mark entries as done
- **Delete** – Remove an entry (with confirmation)
- **Job IDs** – Manage a list of job IDs in “Manage Job IDs”; select one when adding/editing an email
- **Persistence** – Data is saved in localStorage (no backend)

## Build

```bash
npm run build
```

Build output is in the `build` folder.
