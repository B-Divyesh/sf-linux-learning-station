# Linux Learning Station — build handoff

Work order: `linux-learning-station-build-1`

Completed: 2026-08-28

Artifact: static offline PWA; deploy root `dist/`

## What was built

- A first-run adult setup that selects ages 5–6, 7–8, or 9–10 without creating an account.
- Six complete, original activities: Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook. Each has age-adjusted prompts, immediate feedback, clear session endings, and locally saved results.
- Pointer/touch drawing with color, line width, undo, and clear, plus keyboard-operable “Add dot” and “Add square” controls.
- IndexedDB progress with an anonymous printable `MOSS-…` progress code, basic printable report, JSON export/import, and confirmed local reset.
- A privacy-first adult tool drawer with age settings, progress, install state, legal pages, and optional one-time bundle controls.
- The Sociobot paid-unlock contract: slug checkout link, URL license capture and stripping, `sb_license:linux-learning-station` storage, at-most-daily background verification, cached offline verdict, revoked/invalid notice, and paste-to-restore. All six activities, accessibility, safety, and data export remain free. The ₹499 workshop bundle adds five-round sessions and detailed recent-practice printouts.
- Install manifest with 192px/512px maskable icons, versioned service worker caches, navigation fallback, generated-asset precaching, offline legal pages, and a non-disruptive update toast.
- `/privacy/` and `/terms/`, robots and sitemap files, MIT license, full README, and the product-specific design/provenance record.
- Original generated hero artwork, reviewed for artifacts and optimized from the retained source to a 101 KB WebP.

## How to run and deploy

```sh
npm ci
npm test
npm run build
```

The exact deployment build is `npm ci && npm run build`. Publish `dist/`; `dist/index.html` is present at its root. `npm run preview` serves the production build locally.

## Verification performed

- `npm test`: pass.
  - Vitest: 4/4 unit tests.
  - Playwright 1.58.2: 6/6 browser tests.
  - Covered fresh setup at 390×844, all six activity entry points, pattern feedback, exact typing, spelling, keyboard drawing, adult/legal controls, and a reload with `context.setOffline(true)`.
- Playwright axe scan on the 390px home board: no serious or critical violations.
- Factory `verify-url.sh`: HTTP 200, no page/console errors, title present, `lang="en"`, exactly one `<h1>`, `<main>` present, no missing image alt text, and no unlabeled buttons.
- Lighthouse 12.8.2 mobile simulation:
  - Performance 97
  - Accessibility 100
  - Best practices 100
  - SEO 100
  - FCP 1.3s, LCP 2.1s, TBT 170ms, CLS 0
- Production asset budgets:
  - Initial JavaScript 28.50 KB raw / 10.45 KB gzip (budget ≤200 KB)
  - CSS 16.56 KB raw / 4.52 KB gzip (budget ≤50 KB)
  - Hero WebP 101 KB (budget ≤300 KB)
  - No web fonts, third-party runtime scripts, telemetry, or production npm dependencies
- Manual visual review at 1440×1000 and 390×844 confirmed no horizontal overflow, readable hierarchy, focus treatment, responsive stacking, and correct hero rendering.
- `npm audit`: 0 known vulnerabilities after updating Vite and Vitest patch releases.

Local verification artifacts were written to `.factory/evidence/` and are intentionally git-ignored.

## Known gaps and next steps

- The factory must register the live paid product/return URL before checkout can complete; the repository correctly uses the slug endpoint and has no provider product ID.
- Real home/classroom pilot outcomes (adult setup under five minutes and three child sessions in a week) require post-deployment observation and are not simulated metrics.
- Install UI availability is browser-controlled. When the install prompt is unavailable, Adult tools gives the honest browser-menu instruction.
- No cloud sync exists by design. Moving progress requires the adult JSON export/import path.
