# SEO maintenance

Notes for keeping the site's search presence healthy. None of this is urgent; all of it is worth doing as you grow.

## Pre-launch checklist (one-time) — completed April 2026

All of the following are done; preserved here so it's clear what was set up.

- [x] **Replaced `{{ UPDATE: ... }}` placeholders** in `src/*.md` and `src/_data/site.js`. To verify nothing slipped through:
  ```bash
  grep -r "UPDATE:" src/
  ```
- [x] **ORCID** wired into `src/_data/site.js` → `identity.orcid` → Person JSON-LD `sameAs`.
- [x] **Google Scholar URL** wired into `identity.scholar`.
- [x] **LinkedIn URL** wired into `identity.linkedin`.
- [x] **Real headshot** at `src/assets/photo.jpg` (480×582 JPEG). Used as the nav avatar and login-screen logo.
- [x] **OG image as PNG** at `src/assets/og-default.png` (1200×630, 137KB). Generated from `og-default.svg` via `npx @resvg/resvg-js-cli`.
- [x] **CV file** at `src/assets/galadima-cv.docx`. Note: the CV page (`/cv/`) links to the .docx but the print stylesheet (Ctrl-P) produces a clean letterhead-formatted PDF on demand.

## Post-launch checklist

Some still pending — handle whenever convenient.

- [ ] **Register `hgaladima.com` in Google Search Console** (Domain property, DNS verification covers all subdomains + apex). Submit `sitemap.xml`.
- [ ] **Register `ztchi.hgaladima.com` separately** (the calculator has its own sitemap at `https://ztchi.hgaladima.com/sitemap.xml`).
- [ ] **Skip `teach.hgaladima.com`** — it's noindex by design (host-aware robots.txt + X-Robots-Tag header + meta robots; three-layer block).
- [ ] *(optional)* **Bing Webmaster Tools**: free, imports from Search Console in ~30 seconds.
- [ ] **Validate JSON-LD per page type** in the [Rich Results Test](https://search.google.com/test/rich-results):
  - Home → Person + WebSite
  - About / CV / Contact / Mentoring → WebPage
  - Teaching → Course
  - Research / Speaking / Blog index → CollectionPage
  - Per-blog-post pages → BlogPosting
- [ ] **Test social previews** in [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) or [opengraph.xyz](https://www.opengraph.xyz/). OG image, title, description should match.
- [ ] **Run Lighthouse** in DevTools — SEO score target: 100.

## When you add a new blog post (via /admin/)

The CMS handles SEO automatically:
- Sitemap regenerates on build; the new post URL appears in `/sitemap.xml`.
- BlogPosting JSON-LD is emitted from `post.njk`.
- RSS feed (`/feed.xml`) updates with the new entry.
- Default OG image applies unless you upload a custom one in the CMS form.

You can speed up Google's discovery by pasting the URL into Search Console → **URL Inspection** → **Request indexing**.

## When you add a new publication (via /admin/)

The Publications collection edits `src/_data/publications.json`. On the next build:
- The `/research/` page list updates (newest entries appear first).
- The sitemap regenerates with the new URL.
- The title links directly to the DOI (canonical academic source).

No manual sitemap or schema editing needed — the data drives everything.

## When you add a new talk (via /admin/)

The Talks collection edits `src/_data/talks.json`. On the next build:
- A future date auto-routes the entry into the **Upcoming** section on `/speaking/`.
- A past date in the last 3 years goes to **Recent**.
- Older dates go to **Earlier**.
- Bucketing happens at build time via the `groupTalksByRecency` filter in `.eleventy.js` — talks self-age out of "Upcoming" once the date passes.

## When you change a page URL

If you rename a page's path (e.g., `/mentoring/` → `/students/`):
1. **Canonical tag** updates automatically via 11ty (derived from `page.url`).
2. **Add a redirect rule** in Cloudflare Pages → Rules → Redirect Rules so old links don't 404.
3. **Resubmit the sitemap** in Search Console.

## Adding alt text to images

Every image uploaded via Decap should have alt text — the image widget has an alt field. For images hand-added in markdown, use `![Alt text](/path.jpg)` syntax.

Alt text rules:
- Describe what matters for the content, not the literal pixels.
- "Figure: confidence interval for the mean, width 0.42, centered at 1.8" > "chart".
- Short (under 125 chars).
- Don't start with "Image of" — screen readers already know.

## What you do NOT need to do

- **Don't** add `meta keywords` tags. Google ignored them since ~2009.
- **Don't** add fake review or rating schema. Google penalizes sites that do.
- **Don't** submit to generic "SEO directories" or buy backlinks.
- **Don't** add Google Analytics / Facebook Pixel / tracking. The privacy-first posture is a feature.
- **Don't** obsess over keyword density. Write for humans; keywords follow.

## Honest ranking expectations

- **"Hadiza Galadima"** as a name-search: should rank #1 within 2–6 weeks of Search Console submission. Low competition.
- **Generic queries** ("chi-square calculator", "biostatistics professor"): years of consistent content + a major citation. Don't expect miracles.
- **Niche long-tail** ("effect-sizes-first teaching biostatistics"): possible within months once a relevant blog post or paper is in the index.

SEO rewards consistency over months, not tricks over days.

## If something seems broken

- **Page not appearing in Google after 4 weeks**: Search Console → **Pages** → find the URL → read the coverage status. Usually a clear reason ("Excluded — Discovered, currently not indexed", "Excluded — duplicate content", etc.).
- **Social preview broken / stale**: clear Facebook/LinkedIn cache by re-pasting the URL into their inspector tools (they cache aggressively).
- **JSON-LD validation error**: paste the emitted JSON into [validator.schema.org](https://validator.schema.org/). Error message usually names the field.
- **Build failing in CI** (`.github/workflows/build.yml`): check the GH Actions tab — most failures are link-checker false positives or a typo in `_data/*.json` breaking 11ty parsing.
