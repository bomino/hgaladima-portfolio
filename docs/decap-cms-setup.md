# Decap CMS setup — one-time GitHub OAuth app registration

Decap CMS (formerly Netlify CMS) is the browser-based admin UI at `https://hgaladima.com/admin/`. It authenticates against GitHub so Dr. G can create, edit, and publish blog posts without ever leaving the browser.

This doc walks through the one-time setup to enable that login. You do this **once**, then forget about it.

## What you'll create

A **GitHub OAuth app** that Decap uses to request write access to this single repo. The OAuth app's client ID and secret are stored as Cloudflare Pages environment variables. Netlify's free public OAuth relay (`api.netlify.com/auth`) brokers the login flow — no Netlify account is needed.

## Step 1. Register the GitHub OAuth app

1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
   Direct link: https://github.com/settings/developers
2. Fill in:
   - **Application name**: `hgaladima.com CMS`
   - **Homepage URL**: `https://hgaladima.com`
   - **Application description** *(optional)*: `Browser-based content editor for the hgaladima.com blog.`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
     (Yes, the Netlify domain — this is correct. Decap uses Netlify's OAuth relay by default; no Netlify account is required.)
3. Click **Register application**.
4. On the next page, note the **Client ID** (visible immediately).
5. Click **Generate a new client secret**. Copy the secret **before closing the page** — GitHub shows it exactly once.

## Step 2. Add secrets to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → `hgaladima-portfolio` project → **Settings** → **Environment variables**.
2. Under **Production**, add:
   - `OAUTH_CLIENT_ID` = *(paste Client ID)*
   - `OAUTH_CLIENT_SECRET` = *(paste secret; mark as **Encrypted**)*
3. Save. Trigger a new deployment so the vars take effect (easiest: **Deployments** → **Retry deployment** on the latest entry).

> **Note**: With the default Netlify OAuth relay, these env vars are actually informational — Decap doesn't need them at runtime because the relay handles the OAuth dance. Keep them documented anyway in case you later move to a self-hosted OAuth provider.

## Step 3. Point Decap at the right repo

Open `src/admin/config.yml` and update the `backend.repo` line:

```yaml
backend:
  name: github
  repo: UPDATE-GITHUB-OWNER/hgaladima-portfolio   # ← change to your actual owner/repo
  branch: main
```

Commit and push. The next deploy picks this up.

## Step 4. First login (Dr. G's side)

1. Visit `https://hgaladima.com/admin/`.
2. You'll see the Decap login screen with a **Login with GitHub** button.
3. Click it. A popup asks you to authorize the `hgaladima.com CMS` OAuth app to access your GitHub account.
4. Click **Authorize**. You're now logged into the admin UI.
5. You can create a new post: **Blog posts** → **New Blog post** → fill title/date/summary → write in the editor → **Publish**.
6. Behind the scenes: Decap commits your new `.md` file to `main`, CF Pages rebuilds, your post is live in ~60 seconds.

## Troubleshooting

**"Invalid redirect URI" on login.** The callback URL in step 1 must be *exactly* `https://api.netlify.com/auth/done`. If you typed it differently, edit the OAuth app settings on GitHub.

**Popup blocked.** Allow popups for `hgaladima.com` in the browser. Decap opens a small window for the OAuth handshake.

**"Backend not configured" inside the admin UI.** The `backend.repo` in `config.yml` still says `UPDATE-GITHUB-OWNER`. Fix it and redeploy.

**Dr. G loses her laptop / wants to add a collaborator.** OAuth apps tie to the *app*, not a device. Just log in on a new device. To add a collaborator (e.g., TA): add them as a GitHub repo collaborator with write permission; they log in at `/admin/` with their own GitHub credentials. Decap will honor their commits the same way.

## Security notes

- The OAuth app only has access to what you grant it — by default, repo read/write for repos the user can already see.
- Never commit the Client Secret to git. If you accidentally do, rotate it on GitHub immediately.
- The Netlify OAuth relay is an open-source service (github.com/netlify/netlify-cms-oauth-provider). You can self-host it later if you prefer not to depend on it — the migration is ~30 minutes and documented in the Decap CMS docs.
- Decap stores login tokens in the browser's localStorage. Logging out clears them.
