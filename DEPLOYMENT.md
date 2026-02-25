# Deploy Offer When on Vercel (free)

## 1. Push your code to GitHub

If the project is not in a Git repo yet:

```bash
cd email-tracker-app
git init
git add .
git commit -m "Initial commit"
```

Create a new repository on [GitHub](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Sign in to Vercel

- Go to [vercel.com](https://vercel.com) and sign in (use “Continue with GitHub” so Vercel can see your repos).

## 3. Import the project

- Click **Add New…** → **Project**.
- Select the GitHub repo that contains `email-tracker-app` (or the repo root if the app is the whole repo).
- If the app lives in a **subfolder** (e.g. `email-tracker-app`), set **Root Directory** to that folder.
- Vercel will detect Create React App. Keep:
  - **Build Command:** `npm run build`
  - **Output Directory:** `build`
- Do **not** build yet if you still need to add env vars.

## 4. Add environment variables

In the import screen (or later in **Project → Settings → Environment Variables**), add:

| Name                         | Value                    | Environment  |
|-----------------------------|--------------------------|--------------|
| `REACT_APP_SUPABASE_URL`    | Your Supabase project URL | Production (and Preview if you want) |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Production (and Preview if you want) |

Then click **Deploy**.

## 5. Note your live URL

After the build finishes, Vercel gives you a URL like:

`https://your-project-name.vercel.app`

Use this as your **production** app URL in the next step.

## 6. Configure Supabase and Google for production

### Supabase

- **Supabase Dashboard** → **Authentication** → **URL Configuration**
- Set **Site URL** to your Vercel URL, e.g. `https://your-project-name.vercel.app`
- Add the same URL under **Redirect URLs** if you use a custom redirect list.

### Google OAuth

- **Google Cloud Console** → **APIs & Services** → **Credentials** → your OAuth 2.0 Client ID
- Under **Authorized JavaScript origins**, add:  
  `https://your-project-name.vercel.app`
- Leave **Authorized redirect URIs** as-is (Supabase callback URL does not change).

Save and wait a few minutes, then try signing in with Google on the live site.

## 7. Optional: custom domain

In the Vercel project: **Settings** → **Domains** → add your domain and follow the DNS instructions.

---

**Summary:** Push to GitHub → Import repo on Vercel → Set `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` → Deploy → Set Vercel URL in Supabase and in Google OAuth origins.
