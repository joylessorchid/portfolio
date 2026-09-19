# v2horizon.com

Personal site and CV of **Nikolay Skorikov** — AI product & infrastructure engineer.
Russian at `/`, English at `/en/`. Live: https://v2horizon.com

## Stack

- **Astro 7**, fully static output, ~2 KB of JavaScript per page
- Self-hosted fonts through the Astro Fonts API (Prata for display, Manrope for text, JetBrains Mono for meta — Latin + Cyrillic)
- Responsive WebP images via `astro:assets`
- One warm “paper” theme with dark sections; CSS-only motion: load-in reveals, scroll-driven reveals, marquee, hover states and cross-document view transitions (the project stage morphs into the case-study header) — no frameworks
- **Cloudflare Workers** static assets, with `_headers` (security headers, immutable caching) and `_redirects`

## Where things live

| Path | What |
| --- | --- |
| `src/data/profile.ts` | name, role, hero text, stats, contacts |
| `src/data/projects.ts` | projects, their screenshots, stage composition and case-study text |
| `src/data/experience.ts` | jobs and education |
| `src/data/skills.ts`, `services.ts` | stack and services |
| `src/i18n/ui.ts` | interface strings (RU/EN) |
| `src/assets/` | photo and project screenshots (originals; optimised at build) |
| `src/views/CvPage.astro` | the CV, rendered to PDF by `npm run export` |
| `public/cv/`, `public/og/` | generated PDFs and social previews (committed) |

All content is bilingual (`{ ru, en }`), so the site and the PDF CV are always generated from the same data. Copy is written in a neutral, third-person tone (no first-person claims, no calls to action beyond neutral button labels).

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # type check
npm run build    # -> dist/
npm run export   # rebuild CV PDFs, OG images and the touch icon (needs Edge or Chrome)
```

After editing anything in `src/data/`, run `npm run export` and commit the updated `public/` files.

## Deploy

Pushed to `main` → Cloudflare Workers Builds:

- root directory: `/`
- build command: `npm run build`
- deploy command: `npx wrangler deploy`

Node 24 is pinned in `.nvmrc`.
