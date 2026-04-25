# Cloudflare Pages setup — hgaladima.com

One-time deploy and custom-domain binding for the portfolio site.

> **Status (April 2026):** completed. The site is live at `https://hgaladima.com`. This guide is preserved as the canonical reference if the project ever needs to be re-deployed (new account, new repo, new contributor onboarding).

## Prerequisites

- Cloudflare account with `hgaladima.com` already on your account (nameservers pointing to CF — same as for `ztchi.hgaladima.com` and `teach.hgaladima.com`).
- GitHub repo [`bomino/hgaladima-portfolio`](https://github.com/bomino/hgaladima-portfolio) cloned and pushed.
- For the CMS: a GitHub OAuth app registered. See [`decap-cms-setup.md`](./decap-cms-setup.md). `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` are required at runtime by the self-hosted OAuth Pages Functions.

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

## 6. Cloudflare Email Routing (for `info@` and `consulting@` aliases)

The contact page advertises two domain-routed addresses for filtering inquiries by intent:
- `info@hgaladima.com` — general / Z-t-Chi Calculator inquiries
- `consulting@hgaladima.com` — paid statistical-consulting inquiries

To set them up:

1. CF dashboard → `hgaladima.com` zone → **Email** → **Email Routing** → **Get started**.
2. Cloudflare auto-adds the MX + SPF records on the zone; accept them.
3. **Routing rules** → **Create address** → add `info@hgaladima.com` → forwards to a real inbox.
4. Verify the destination inbox (CF sends a confirmation link).
5. Repeat for `consulting@hgaladima.com`.

Email Routing is **receive-only**. To reply with the alias as the From: address, configure the destination mail client (Gmail Settings → Accounts → Send mail as) with a separate SMTP provider — most solo consultants just reply from their personal inbox and that's accepted.

## 7. Iterate

After this one-time setup, every `git push main` auto-deploys (~60s). Decap CMS pushes count too — when Dr. G clicks **Publish** in `/admin/`, a commit lands on main, CF rebuilds, the new post is live.

GitHub Actions runs a shadow build on every push (see `.github/workflows/build.yml`). It runs `npm ci`, `npm run build`, file-existence checks, and an offline link checker via `lycheeverse/lychee-action@v2`. The CF deploy is independent — GH Actions is just a regression catcher.

**Rollback**: CF Pages **Deployments** tab → pick any prior successful deploy → **Rollback to this deployment**.
