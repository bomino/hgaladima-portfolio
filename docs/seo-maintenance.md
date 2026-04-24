# SEO maintenance

Notes for keeping the site's search presence healthy. None of this is urgent; all of it is worth doing as you grow.

## Pre-launch checklist (one-time)

Before you announce the site or link to it from your CV:

- [ ] **Replace every `{{ UPDATE: ... }}` placeholder** in src/*.md and src/_data/site.js. Grep:
  ```bash
  grep -r "UPDATE:" src/
  ```
- [ ] **Add your real ORCID** to `src/_data/site.js` (the `identity.orcid` field). This threads into Person JSON-LD `sameAs` and is how Google connects the site to your publication record.
- [ ] **Add your Google Scholar URL** — same threading.
- [ ] **Add your LinkedIn URL** — same threading.
- [ ] **Replace the placeholder photo** (`src/assets/photo.svg`) with a real headshot. JPG or WebP, ~400×400 minimum. Save as `photo.jpg` and update `src/index.njk` to reference `.jpg` instead of `.svg`.
- [ ] **Convert the OG image to PNG**. The default is an SVG which renders on Facebook/LinkedIn but not on Twitter/X. Any of these will work:
  - Online: [CloudConvert](https://cloudconvert.com/svg-to-png) — upload `src/assets/og-default.svg`, download 1200×630 PNG, save as `src/assets/og-default.png`. Update `src/_data/seo.js` to point at `.png`.
  - CLI: `rsvg-convert -w 1200 -h 630 src/assets/og-default.svg > src/assets/og-default.png`
  - Figma/Affinity Designer: open the SVG, export 1200×630 PNG.
- [ ] **Add a CV PDF** at `src/assets/galadima-cv.pdf`. The CV page (`/cv/`) links to it.

## Post-launch (first two weeks)

- [ ] **Register `hgaladima.com` in Google Search Console** (Domain property, DNS verification). Submit `sitemap.xml`.
- [ ] **Register `ztchi.hgaladima.com` separately** (the calculator has its own sitemap).
- [ ] **Skip `teach.hgaladima.com`** — it's noindex by design.
- [ ] *(optional)* **Bing Webmaster Tools**: free, imports from Search Console in ~30 seconds. Occasionally useful when Bing-powered aggregators pull in citations.
- [ ] **Test each page in the [Rich Results Test](https://search.google.com/test/rich-results)**. Paste the URL, verify the detected JSON-LD schema type matches what you expect (Person on home, BlogPosting on posts, Course on `/teaching/`).
- [ ] **Test each page in the [Schema.org validator](https://validator.schema.org/)**.
- [ ] **Test social previews** in [OpenGraph.xyz](https://www.opengraph.xyz/) or LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/). The OG image should render, title and description should match.
- [ ] **Run Lighthouse** in browser DevTools against the home page and one blog post. SEO score target: 100.

## When you add a new blog post

The CMS handles this automatically:
- Sitemap regenerates on build — nothing to do manually.
- The post's own BlogPosting JSON-LD is emitted from `post.njk` — nothing to configure.
- Default OG image applies unless you uploaded a custom one in the CMS form.

You can help Google discover the new post faster by:
- Pasting the URL into Search Console's **URL Inspection** tool → **Request indexing**.
- Linking the post from the home page (it already shows the 3 most recent automatically).

## When you change a URL

Changing a page's path (e.g., renaming `/research/` to `/publications/`) requires:
1. **Canonical tag** updates automatically via 11ty (the canonical is derived from `page.url`).
2. **Add a redirect rule** in Cloudflare Pages so old links don't 404. Dashboard → Redirect Rules → `/research/` → 301 → `/publications/`.
3. **Resubmit the sitemap** in Search Console. Google usually notices without this, but a manual submit speeds it up.

## Adding alt text to images

Every image a CMS user uploads should have alt text. Decap's image widget has an alt field; fill it in. For images hand-added in markdown: use the `![Alt text here](/path/to/image.jpg)` syntax — the text between `![` and `]` is the alt text.

Alt text rules:
- Describe what matters for the content, not the literal pixels.
- "Figure: confidence interval for the mean, width 0.42, centered at 1.8" > "chart".
- Short (under 125 chars).
- Don't start with "Image of" — screen readers already know.

## Adding publications to the Research page

The `src/research.md` template shows the pattern. For each new publication:

1. Add an `<li>` under `<ol class="pub-list">` with author, year, title, venue, DOI link.
2. Add a matching `<script type="application/ld+json">` block with `@type: ScholarlyArticle` inside the `<li>`.
3. The schema block feeds Google Scholar indexing — worth doing for recent work.

## What you do NOT need to do

Good hygiene, not micromanagement:
- Don't add `meta keywords` tags. Google ignores them and has since ~2009.
- Don't add fake review or rating schema. Google penalizes sites that do.
- Don't submit to generic "SEO directories" or buy backlinks. At best useless, at worst harmful.
- Don't obsess over keyword density. Write for humans; keywords follow naturally.
- Don't add Google Analytics / Facebook Pixel / tracking. The site's privacy-first posture is a feature, not a limitation.

## Honest ranking expectations

- **"Hadiza Galadima"** as a name-search: expect to rank #1 within 2–6 weeks of Search Console submission. Low competition.
- **Generic queries** like "chi-square calculator" or "biostatistics professor": years of consistent content work, or a major citation, or both. Don't expect miracles.
- **Niche long-tail** (e.g., "effect-sizes-first teaching biostatistics"): possible within months if you write about it.

SEO rewards consistency over months, not tricks over days.

## If something seems broken

- Page not appearing in Google after 4 weeks: check Search Console → **Pages** → find the URL → read the coverage status. Often a clear reason listed (e.g., "Excluded — duplicate content, Google chose different canonical").
- Social preview broken: clear Facebook/LinkedIn cache by re-pasting the URL into their official inspector tools. They cache aggressively.
- JSON-LD validation error: paste the emitted JSON into [validator.schema.org](https://validator.schema.org/) — the error message usually names the specific field.
