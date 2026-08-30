# Linux Learning Station — polish 5 handoff

- Work order: `linux-learning-station-polish-5`
- Reviewed candidate: `5e147de4c6dfe40de9704b35cf745bfbd169b417`
- Review report: `b10b2cf3744d03ee78ea2dac3caeed9d5a94434e`
- Repair commit: `21d33c4c9eb4c57df9eb237d7e295925b8560df1`
- Product version: `v1.2.6`
- Deployment: `c122c594-a1b0-4d8a-9c39-b4e1e2288bb7`
- Live URL: <https://linux-learning-station.sociobot.in>
- Result: **PASS — all cumulative review findings are closed.**

## What changed

- Closed F-5-1 through F-5-4: **workshop bundle** is the only paid-feature name; **license** is only the unlock token; landing privacy copy uses plain parent-facing language; and the two README instructions now contain one idea each.
- Bumped the PWA, service-worker cache, manifest start URL, and footer build ID to `v1.2.6`, so installed stations receive the repair.
- Added a browser regression that checks the landing, Adult tools, Privacy page, and README for the repaired terms.
- Kept the reviewed concrete-and-moss board, original hero asset, PWA/local-first architecture, isolated `?demo=1` sample mode, real routes, legal pages, and existing claims behavior intact.
- Updated the catalog description: “Start six private offline activities for ages 5–10 on a shared Linux computer; progress stays in the browser.” It is verb-first and 111 characters.

The exhaustive finding map is in [polish-5.md](polish-5.md). The copy audit is in [copy-audit.md](copy-audit.md).

## Verification

Clean clone: `/tmp/linux-learning-station-clean.77VDuE` at `21d33c4c9eb4c57df9eb237d7e295925b8560df1`.

- `npm ci` passed: 61 packages, zero audit vulnerabilities.
- Every exact command listed in `.factory/claims.json` passed independently: **17/17**.
- Claim cross-check: 17 manifest IDs, each with exactly one `@claim:<id>` test.
- `npm test` passed: 4 Vitest tests and 35 Playwright tests.
- `npm run lint`, `npm run build`, and `npm audit --omit=dev` passed.
- `dist/index.html` exists. The build has 35.71 kB raw / 12.45 kB gzip JS and 18.98 kB raw / 5.00 kB gzip CSS.
- Local visual review at 390 × 844 confirmed the four first-screen facts remain above the age controls and the one-click demo has its persistent isolated banner.
- The Playwright Axe integration found zero serious/critical violations on landing, demo, activity, Adult tools, Privacy, Terms, offline fallback, and 404.

## Live verification

The configured static deployment completed as `c122c594-a1b0-4d8a-9c39-b4e1e2288bb7`. A cold live-browser check then passed at <https://linux-learning-station.sociobot.in>.

- `verify-url.sh` passed: HTTPS 200, title, `lang=en`, one h1, main landmark, complete image alt handling, labelled buttons, and no console errors. Cold load was 619 ms.
- Current live browser sweep passed: one-click demo, reset/exit isolation, offline activity save, six activity labels, 44 px targets, 200% text, deep-link focus, sitemap, designed 404, titles/metadata, legal links, no core external traffic, license request privacy, and Chromium installability.
- Current live copy check confirms workshop-bundle wording on landing, Adult tools, Privacy, and Terms; no legacy paid-feature or third-party-script wording remains.
- Playwright Axe found zero serious/critical findings. Lighthouse 12.8.2 scored **100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**.

Evidence: [local cold mobile](polish-5-local/cold-mobile.png), [local demo mobile](polish-5-local/demo-mobile.png), [live cold mobile](polish-5-live/live-cold-mobile.png), [live demo mobile](polish-5-live/live-demo-mobile.png), [live 200% demo](polish-5-live/live-demo-200-percent.png), [live sweep](polish-5-live/live-check.json), [live copy check](polish-5-live/copy-check.json), [baseline verifier](polish-5-live/verify/verify.json), and [Lighthouse](polish-5-live/lighthouse.json).

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run build
npm run preview
```

Run each claim command exactly as listed in `.factory/claims.json`. Deploy the static output with:

```sh
/opt/fleet/lib/deploy-static.sh linux-learning-station dist
```

## Known gaps

None. No product, review, accessibility, privacy, demo, routing, PWA, mobile, or copy finding remains open.
