# Courtney Chan portfolio

A static site built with [Astro](https://astro.build), deployed to GitHub Pages.

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # writes the site to dist/
```

Needs Node 22 or newer.

## Where things live

| What | Where |
| --- | --- |
| Case studies | `src/content/work/*.md` |
| Lenses, hero copy, contact links | `src/data/lenses.ts` |
| Colors, type, spacing | `src/styles/global.css` |
| Old Squarespace URL redirects | `astro.config.mjs` |

## Add or edit a case study

Each case study is one Markdown file. The top block sets everything the index and the page header show:

```yaml
title: Shopping UX
headline: Long time requested feature to shop more efficiently!   # the problem line: card title and page heading
blurb: For years, the Coop+ platform did not provide flexibility...   # one sentence, shown over the card image on hover (required)
summary: Long time requested feature to shop more efficiently     # description for search and link previews
lenses: [consumer]          # ai, consumer, enterprise: which lens pages list it
tags: [Checkout, B2C]
metrics:                    # optional, shown large above the cover; the numbers count up on scroll
  - value: +3%
    label: above the 2025 B2C revenue goal
    tags: [Revenue growth, Exceeded annual goal]   # optional pills under the label
thumb: https://...          # card image; falls back to the cover
order: 2                    # position in the grid
draft: false                # true keeps it out of the site
```

In the body:

- `<p class="kicker">Label</p>` before a `##` heading puts a small label in the left column.
- `---` draws a rule between sections.
- `<figure><img ...></figure>` is one full-width image; `<div class="gallery">` holds several side by side (`gallery tall` for phone screenshots).

`src/content/work/enterprise-2-0.md` is a draft outline for the Enterprise 2.0 case study.

## Archived pages

The explorations (design challenges, class project, logo re-brand), the Design Workflow page and the About page are not part of the site. Their pages, content and images are kept in `archive/`, which is not published and not tracked by git. Delete the folder if you don't want them.

## Lenses

`/for/ai/`, `/for/consumer/` and `/for/enterprise/` are the home page filtered to one audience, each with its own intro line. On the page the tabs switch between them without reloading. Link the one that fits a given application. Edit the intros in `src/data/lenses.ts`.

## Images

Images still load from Squarespace's servers. Before cancelling Squarespace, copy them into this project:

```sh
npm run images -- --dry   # list what will be downloaded
npm run images            # save to public/images/ as WebP (max 1800px wide) and rewrite the references
```

It is safe to run again: images already saved are skipped.

Image alt text was drafted from file names where the old site had none. Review it.

## Deploy to GitHub Pages

1. Move `deploy-workflow.yml` to `.github/workflows/deploy.yml` (`mkdir -p .github/workflows && mv deploy-workflow.yml .github/workflows/deploy.yml`).
2. Create a GitHub repository and push this folder to its `main` branch.
3. In the repository: Settings → Pages → Source → **GitHub Actions**.
4. Every push to `main` builds and deploys (`.github/workflows/deploy.yml`). The site appears at `https://<user>.github.io/<repo>/`, which works as a preview before the domain moves.

## Move chanyongxue.com

Do this after the images are copied and the preview looks right.

1. Settings → Pages → Custom domain → `www.chanyongxue.com`.
2. Where the domain's DNS is managed, replace the Squarespace records with:
   - `CNAME` for `www` → `<user>.github.io`
   - `A` for the apex (`@`) → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Once the DNS check passes, turn on **Enforce HTTPS**.
4. Re-run the deploy workflow so links are built for the new domain.
5. Check that old links such as `/coopai` redirect, then cancel Squarespace. If the domain itself is registered through Squarespace, keep the domain registration or transfer it first.

GitHub's reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
