# Decap CMS setup — one-time GitHub OAuth app registration + CF env vars

Decap CMS (formerly Netlify CMS) is the browser-based admin UI at `https://hgaladima.com/admin/`. It authenticates against GitHub so Dr. G can create, edit, and publish content (blog posts, publications, talks) without ever leaving the browser.

> **Status (April 2026):** completed. The OAuth app is registered, env vars are set, and the admin is live. This doc is the canonical reference if the OAuth credentials need to be rotated, a TA needs to be added as a collaborator, or the project ever needs to be re-deployed.

## Architecture

Decap used to rely on Netlify's free public OAuth relay at `api.netlify.com/auth`. Netlify locked that down in mid-2024 — it now requires the site to be hosted on Netlify. Since we're on Cloudflare Pages, we **self-host the OAuth broker** as two tiny Pages Functions:

```
 1. User clicks "Login with GitHub"
    in the Decap admin UI
              │
              ▼
 2. Decap opens popup to
    hgaladima.com/api/auth?provider=github&...
              │
              ▼
 3. functions/api/auth.js redirects the popup to
    github.com/login/oauth/authorize with our
    client_id + redirect_uri=/api/callback
              │
              ▼
 4. User approves on github.com
              │
              ▼
 5. GitHub bounces the popup to
    hgaladima.com/api/callback?code=XYZ&state=ABC
              │
              ▼
 6. functions/api/callback.js exchanges the code for
    an access token (using client_secret) and postMessages
    the token back to the Decap admin window.
              │
              ▼
 7. Decap admin loads, ready to edit content.
```

No external dependencies, no Netlify account, no third-party relay. The client secret never leaves Cloudflare's edge.

## Step 1. Register the GitHub OAuth app

1. Go to [GitHub → Settings → Developer settings → OAuth Apps → New OAuth App](https://github.com/settings/developers).
2. Fill in:
   - **Application name**: `hgaladima.com CMS`
   - **Homepage URL**: `https://hgaladima.com`
   - **Authorization callback URL**: `https://hgaladima.com/api/callback`
     *(Not the old `api.netlify.com/auth/done` — that's deprecated. Our callback is served by `functions/api/callback.js` in this repo.)*
3. Click **Register application**.
4. On the next page, note the **Client ID** (visible immediately).
5. Click **Generate a new client secret**. Copy it **before closing the page** — GitHub shows it exactly once.

### Updating an existing OAuth app

If the OAuth app was created earlier with the Netlify callback URL, just edit it:
- Open the app in [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
- Change the **Authorization callback URL** to `https://hgaladima.com/api/callback`
- Click **Update application**
- Client ID and existing secret still work.

## Step 2. Add secrets to Cloudflare Pages

Unlike the old Netlify-relay setup where env vars were documentation-only, with the self-hosted relay **these are required at runtime**:

1. Cloudflare dashboard → **Workers & Pages** → `hgaladima-portfolio` project → **Settings** → **Environment variables**.
2. Under the **Production** environment, add:
   - `OAUTH_CLIENT_ID` = *(paste Client ID from step 1)* — type: *Plaintext*
   - `OAUTH_CLIENT_SECRET` = *(paste Client Secret)* — type: **Encrypted**
3. Click **Save**.
4. **Trigger a new deployment** so the vars take effect: **Deployments** → **Retry deployment** on the latest entry, or push any commit.

> Without these two vars, `/api/auth` returns `500 OAUTH_CLIENT_ID not configured` and login will never start.

## Step 3. Verify the config

Open `src/admin/config.yml`. The backend section should read:

```yaml
backend:
  name: github
  repo: bomino/hgaladima-portfolio
  branch: main
  base_url: https://hgaladima.com
  auth_endpoint: api/auth
```

If `base_url` still says `https://api.netlify.com`, the fix was missed — update it to `https://hgaladima.com`.

## Step 4. First login (Dr. G's side)

1. Visit `https://hgaladima.com/admin/`.
2. You'll see the Decap login screen with a **Login with GitHub** button.
3. Click it. A popup asks you to authorize the `hgaladima.com CMS` OAuth app to access your GitHub account.
4. Click **Authorize**. The popup shows "Signed in — returning to the admin panel…" briefly, then closes.
5. You're now logged into the admin UI.
6. Pick a collection — **Blog posts**, **Publications**, or **Talks** — and click *New*. Fill in the fields and click **Publish**.
7. Behind the scenes: Decap commits the new file to `main`, CF Pages rebuilds, your change is live in ~60 seconds.

### What each collection edits

| Collection | Source file | Output |
|---|---|---|
| Blog posts | `src/blog/*.md` (one file per post) | `/blog/` index + per-post pages |
| Publications | `src/_data/publications.json` (single file, list widget) | List on `/research/`, with title linking to the DOI |
| Talks | `src/_data/talks.json` (single file, list widget) | Auto-bucketed Upcoming / Recent / Earlier on `/speaking/` |

## Troubleshooting

### `Not Found` in the popup (api.netlify.com URL)
You're still hitting the old Netlify relay. Either:
- `src/admin/config.yml` hasn't been updated to point at `https://hgaladima.com` — fix and push.
- Or the admin page was cached. Hard-refresh (Ctrl+Shift+R / Cmd+Shift+R) the `/admin/` page.

### `500 OAUTH_CLIENT_ID not configured`
Env vars weren't set (or were set but no deploy happened since). Check CF Pages → Settings → Environment variables, then trigger a new deployment.

### `OAuth state mismatch`
Happens if the popup is reloaded mid-flow, or third-party cookies are blocked. Close the popup, retry from the admin page.

### `The redirect_uri MUST match the registered callback URL`
The callback URL in the GitHub OAuth app settings doesn't match `https://hgaladima.com/api/callback`. Fix in GitHub settings.

### Popup flashes, closes, nothing happens
Check the browser console for postMessage origin errors. The callback Function is hard-coded to post to `https://hgaladima.com` only — if the admin is being accessed via a different origin (e.g. `*.pages.dev` preview), it won't work. Always use the apex.

### `Backend not configured` inside the admin UI
`config.yml` has a placeholder `repo: UPDATE-GITHUB-OWNER/...`. Fix to `bomino/hgaladima-portfolio` and push.

### Dr. G loses her laptop / wants to add a collaborator
OAuth apps authorize accounts, not devices — just log in on a new device. To add a collaborator (TA, co-author): add them as a GitHub repo collaborator with write permission; they log in at `/admin/` with their own GitHub credentials.

## Security notes

- The OAuth app only receives the scopes it requested (`repo`). It can read/write this one repo on behalf of anyone who authorizes it. It cannot touch other repos without being re-authorized with broader scope.
- `OAUTH_CLIENT_SECRET` lives only on Cloudflare's edge. It is **never** sent to the browser. The token exchange happens server-side in `functions/api/callback.js`.
- Never commit the Client Secret to git. If you accidentally do, rotate it immediately on GitHub.
- The CSRF `state` cookie is HttpOnly + Secure + SameSite=Lax; Max-Age 600s (10 minutes). It's consumed once and cleared on successful callback.
- `postMessage` target origin is hard-coded to `https://hgaladima.com` to prevent token theft from malicious iframes.
