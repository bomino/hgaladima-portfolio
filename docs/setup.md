# Cloudflare Pages setup — hgaladima.com

One-time deploy and custom-domain binding for the portfolio site. Assumes the GitHub repo already exists and has the scaffold pushed.

## Prerequisites

- Cloudflare account with `hgaladima.com` already on your account (nameservers pointing to CF — you did this when you set up `ztchi.hgaladima.com` and `teach.hgaladima.com`).
- GitHub repo `UPDATE-OWNER/hgaladima-portfolio` exists with the scaffolded code.
- (For CMS) A GitHub OAuth app registered — see `decap-cms-setup.md`. You'll need `CLIENT_ID` and `CLIENT_SECRET` later in this guide.

## 1. Create the Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git**.
2. Select the `hgaladima-portfolio` repo.
3. Project name: `hgaladima-portfolio` (this becomes your `*.pages.dev` URL).
4. Production branch: `main`.

**Build settings:**
- Framework preset: **Eleventy** if offered; otherwise **None**.
- Build command: `npm run build`
- Build output directory: `_site`
- Root directory: (leave empty)

**Environment variables (Production):**
- `NODE_VERSION` = `20`
- `OAUTH_CLIENT_ID` = (from the GitHub OAuth app — see CMS setup doc)
- `OAUTH_CLIENT_SECRET` = (from the GitHub OAuth app — mark as encrypted)

Click **Save and Deploy**. First build takes ~90 seconds. When it finishes, you'll see `https://hgaladima-portfolio.pages.dev` live. Load it in a browser and confirm the home page renders before moving on.

## 2. Bind the apex domain

Apex domains need CNAME flattening (they can't be a CNAME directly). CF handles this automatically if the domain is on your CF account.

1. In the Pages project → **Custom domains** tab → **Set up a custom domain**.
2. Enter `hgaladima.com`. CF detects the domain and creates the DNS record automatically.
3. Wait for the SSL certificate to issue (~1–5 minutes). Status goes: pending → active.
4. Repeat with `www.hgaladima.com`.

Verify:
```bash
curl -I https://hgaladima.com/         # expect 200, valid cert
curl -I https://www.hgaladima.com/     # expect 200 initially — we'll add a redirect next
```

## 3. Redirect www → apex

Canonicalize traffic on the apex. Two ways:

**Option A — Bulk Redirects (recommended, free).**
1. CF dashboard → **Rules** → **Redirect Rules** → **Create rule**.
2. Field: *Hostname*, Operator: *equals*, Value: `www.hgaladima.com`
3. Then: *Static*, Type: *301*, URL: `https://hgaladima.com${uri}`
4. Preserve query string: ✓
5. Deploy.

**Option B — Bulk Redirect Lists** if you prefer declarative config. Same effect.

Verify:
```bash
curl -I https://www.hgaladima.com/      # expect 301 Location: https://hgaladima.com/
curl -I https://www.hgaladima.com/blog/ # expect 301 Location: https://hgaladima.com/blog/
```

## 4. Confirm SEO artifacts

```bash
curl -s https://hgaladima.com/robots.txt
# Expect: User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://hgaladima.com/sitemap.xml

curl -s https://hgaladima.com/sitemap.xml | head -20
# Expect: <?xml version="1.0" ...?> and <url> entries

curl -s https://hgaladima.com/ | grep -E '(canonical|og:|twitter:|application/ld\+json)' | head -5
# Expect: canonical link, og:type, og:title, etc.
```

## 5. Register with Search Console (one-time, 10 min)

1. Go to [Google Search Console](https://search.google.com/search-console).
2. **Add property** → *Domain* (DNS verification covers all subdomains + apex + www).
3. Enter `hgaladima.com`.
4. Copy the TXT record GSC gives you → CF dashboard → **DNS** → add a `TXT` record at `@` with that value. TTL auto.
5. Wait 1–2 minutes, click **Verify** in Search Console.
6. Once verified: **Sitemaps** → add `https://hgaladima.com/sitemap.xml`.
7. Repeat separately for `ztchi.hgaladima.com` (its own sitemap).

Do **not** register `teach.hgaladima.com` — it's noindex by design.

## 6. Iterate

After this one-time setup, every `git push main` auto-deploys (~60s). Decap CMS pushes count too — when Dr. G clicks **Publish** in `/admin/`, a commit lands on main, CF rebuilds, the new post is live.

Rollback: CF Pages **Deployments** tab → pick any prior successful deploy → **Rollback to this deployment**.
