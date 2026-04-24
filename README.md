# hgaladima.com

Personal portfolio + blog for Dr. Hadiza Galadima. Eleventy (11ty) static site served from `hgaladima.com` via Cloudflare Pages.

Sibling properties (separate deploys):
- `ztchi.hgaladima.com` — Z-t-Chi biostatistics calculator (student-facing)
- `teach.hgaladima.com` — Instructor mode / problem builder (noindex)

---

## For Dr. G: posting to the blog

You do not need to touch a terminal, git, or any code. Posting is:

1. Open `https://hgaladima.com/admin/` in any browser.
2. Click **Login with GitHub** (one-time OAuth).
3. Click **New Post** under the Blog collection.
4. Fill in title, date, summary, tags. Write the post in the visual markdown editor. Drag images into the editor to upload them.
5. Click **Publish**. Your post goes live within ~60 seconds.

Posts you publish are saved as markdown files in the GitHub repo — you own your content forever.

### Updating portfolio pages

The six core pages (`About`, `Research`, `Teaching`, `CV`, `Contact`, home) live as markdown / Nunjucks files in `src/`. The CMS can edit them once they're configured as pages in the CMS UI. For now they're hand-edited; ask your engineering collaborator to add them to `admin/config.yml` if you want CMS editing.

### Placeholders

Every field Dr. G needs to fill in is marked with `{{ UPDATE: ... }}`. Do a find-and-replace across the repo to surface them all. Critical:
- ORCID ID (threads into Person JSON-LD for Google scholar profile)
- Google Scholar profile URL
- LinkedIn URL
- ODU faculty page URL
- Real 1200×630 headshot or branded social image

---

## For developers

### Local dev

```bash
npm install
npm run dev     # http://localhost:8080 with live reload
npm run build   # produces _site/
npm run clean   # wipes _site/
```

### Node version

Requires Node 18+. Cloudflare Pages uses the `NODE_VERSION=20` environment variable to pin the build runtime.

### Directory layout

```
src/
├── _data/        # site.js — nav, social links, ORCID
├── _includes/    # base.njk, head.njk, header.njk, footer.njk, post.njk
├── assets/       # styles.css, icon.svg, photo, og-default
├── admin/        # Decap CMS admin UI (served at /admin/)
├── blog/         # Markdown posts + blog.njk index
├── index.njk     # Landing page
├── about.md      # 6 portfolio pages
├── research.md
├── teaching.md
├── cv.md
├── contact.md
├── sitemap.njk   # Generates /sitemap.xml
└── robots.njk    # Generates /robots.txt
```

### SEO

Every page emits:
- Unique `<title>` + `<meta name="description">`
- `<link rel="canonical">`
- Open Graph + Twitter Card tags
- Page-type-appropriate JSON-LD (Person, WebSite, BlogPosting, Course, etc.)
- `og:image` fallback to `/assets/og-default.png`

See `docs/seo-maintenance.md` for how to keep SEO artifacts fresh.

### Deployment

Cloudflare Pages auto-deploys on every push to `main`. See `docs/setup.md` for one-time project creation and custom-domain binding. See `docs/decap-cms-setup.md` for the GitHub OAuth app registration (required once for CMS login).
