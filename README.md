# hgaladima.com

Personal portfolio + blog for Hadiza Galadima, PhD. Eleventy (11ty) static site served from `hgaladima.com` via Cloudflare Pages.

Sibling properties (separate deploys):
- `ztchi.hgaladima.com` — Z-t-Chi biostatistics calculator (student-facing)
- `teach.hgaladima.com` — Instructor mode / problem builder (noindex)

---

## For Dr. G: posting to the blog

You do not need to touch a terminal, git, or any code. Posting is:

1. Open `https://hgaladima.com/admin/` in any browser.
2. Click **Login with GitHub** (one-time OAuth).
3. Pick a collection — **Blog posts**, **Publications**, or **Talks** — and click *New*.
4. Fill in the fields. For blog posts, write in the visual markdown editor and drag images directly into the editor.
5. Click **Publish**. The site rebuilds and the change goes live in ~60 seconds.

Posts and data files are saved as plain markdown / JSON in the GitHub repo — you own your content forever.

### What lives in each collection

| Collection | Edits | What appears on the site |
|---|---|---|
| **Blog posts** | `src/blog/*.md` | New entry on `/blog/` and the home page Recent section |
| **Publications** | `src/_data/publications.json` | Adds an item to the list on `/research/` (links direct to the DOI) |
| **Talks** | `src/_data/talks.json` | Auto-routes to Upcoming / Recent / Earlier on `/speaking/` based on date |

### Pages with hand-edited content

The structural pages (`About`, `Research`, `Teaching`, `Speaking`, `Mentoring`, `CV`, `Contact`, home) live as Markdown / Nunjucks files in `src/`. They aren't currently exposed in the CMS — for tweaks, ask your engineering collaborator (or open the file directly on github.com and use the web editor).

---

## For developers

### Local dev

```bash
npm install
npm run dev     # http://localhost:8080 with live reload
npm run build   # produces _site/
npm run clean   # wipes _site/
```

Requires Node 18+. Cloudflare Pages pins to Node 20 via `NODE_VERSION` env var.

### Repository layout

```
.eleventy.js                 # 11ty config: filters, passthroughs, collections
.github/workflows/build.yml  # CI: build + offline link check on every push/PR
package.json                 # @11ty/eleventy + markdown-it deps
src/
├── _data/
│   ├── site.js              # Identity, nav, social URLs (sameAs in JSON-LD)
│   ├── seo.js               # Default OG/Twitter meta + descriptions
│   ├── publications.json    # 20 papers, drives /research/
│   └── talks.json           # 12 talks, auto-grouped by date on /speaking/
├── _includes/               # base.njk, head.njk, header.njk, footer.njk, post.njk
├── admin/                   # Decap CMS UI + config.yml (3 collections)
├── assets/                  # styles.css, photo.jpg, og-default.{svg,png}, etc.
├── blog/                    # Blog posts + blog.njk index
├── about.md / contact.md / cv.md / research.md / teaching.md
├── mentoring.md             # Prospective-students page
├── speaking.njk             # Talks page (data-driven from talks.json)
├── feed.njk                 # /feed.xml RSS
├── sitemap.njk              # /sitemap.xml
├── robots.njk               # /robots.txt
└── index.njk                # Home
functions/
├── api/auth.js              # Decap OAuth: redirect to GitHub authorize
└── api/callback.js          # Decap OAuth: exchange code → token → postMessage
docs/
├── setup.md                 # CF Pages + DNS one-time setup
├── decap-cms-setup.md       # GitHub OAuth app registration
└── seo-maintenance.md       # Pre/post-launch SEO checklist
```

### SEO

Every page emits:
- Unique `<title>` + `<meta name="description">`
- `<link rel="canonical">`
- Open Graph + Twitter Card (PNG OG image at `/assets/og-default.png`)
- Page-type-appropriate JSON-LD (Person, BlogPosting, Course, WebPage, CollectionPage)
- `link rel="alternate"` to `/feed.xml`

Search-engine + AI-crawler sitemaps regenerate on every build from the canonical data files. See `docs/seo-maintenance.md` for the post-launch checklist (Search Console, Bing Webmaster, etc.).

### CI

`.github/workflows/build.yml` runs on push + PR:
1. `npm ci`
2. `npm run build`
3. Verifies expected files exist (`index.html`, `sitemap.xml`, `robots.txt`, `feed.xml`, `blog/index.html`)
4. Internal-link check via `lycheeverse/lychee-action@v2` (URL paths only — fragments skipped to avoid false positives from markdown-it-anchor permalinks).

Independent of Cloudflare Pages' own build; catches regressions in shadow.

### Deployment

Cloudflare Pages auto-deploys on every push to `main`. See `docs/setup.md` for one-time project creation, custom-domain binding, and `www → apex` redirect. See `docs/decap-cms-setup.md` for the one-time GitHub OAuth app registration that powers the `/admin/` login.
