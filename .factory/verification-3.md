# Independent product verification 3 — PASS

- Work order: `linux-learning-station-verify-3`
- Candidate commit: `f6bfa79d4f8d43ea4538795cb06e015c6b84c772`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-29 UTC
- Decision: **PASS — release candidate accepted**

This was run from a clean worktree at the candidate commit. `npm ci` was run before the required claim commands; there was no pre-existing `node_modules` or generated `dist` used for those commands.

## Required first checks

### Claims: PASS

`.factory/claims.json` exists and declares 11 claims. Each exact command was run independently, starting at the documented demo entry point and allowing its own `pretest:e2e` production build:

1. `six-free-activities` — pass
2. `offline-reload` — pass
3. `demo-sandbox` — pass
4. `local-only` — pass
5. `json-export` — pass
6. `erase-progress` — pass
7. `printable-code` — pass
8. `input-paths` — pass
9. `update-notice` — pass
10. `paid-bundle` — pass
11. `daily-license-check` — pass

Each command reports `1 passed`. Logs are in `verification-artifacts-3/claim-*.txt`.

### Cold first read: PASS

In a brand-new desktop browser context, the first screen says **“Start offline learning activities”**, identifies **parents and teachers setting up a shared computer for children aged 5–10**, and puts **“Try it with sample data”** first. The adjacent sentence says that it opens a ready-to-use station with example progress and does not save to the real station. The action opened `/demo` in one click.

The cold-page request log contains only the product origin and no console/page errors. Evidence: `verification-artifacts-3/live-cold-first-read.json` and `live-cold-desktop.png`.

## Clean repository gates: PASS

- `npm ci`: pass, 59 packages, 0 audit vulnerabilities reported.
- `npm test`: pass — Vitest 4/4 and Playwright 20/20.
- `npm run lint`: pass (`tsc --noEmit`).
- `npm run build`: pass and produced `dist/`.
- Production build: JS 33,923 bytes raw / 12.01 KB gzip; CSS 18,842 bytes raw / 4.98 KB gzip; hero WebP 102,784 bytes. This is inside the 200 KB JS, 50 KB CSS, and 300 KB hero budgets.

Evidence: `verification-artifacts-3/npm-test.txt`, `npm-lint.txt`, and `npm-build.txt`.

## Live deployment and product QA: PASS

### Candidate parity and delivery

SHA-256 values match between the local candidate build and live deployment for `/`, `/sw.js`, `/manifest.webmanifest`, the hashed JS bundle, and the hashed CSS bundle. The deployed app is therefore the tested candidate, not a stale deployment.

`/`, `/demo`, a demo activity deep link, a real activity deep link, Privacy, Terms, manifest, worker, robots, and sitemap all return 200. A nonexistent route returns the designed 404. Evidence: `live-routes.txt` and command output recorded during verification.

### End-to-end use and recovery

- The one-click demo loads six usable activity slabs and its persistent demo banner.
- Pattern Quarry completed normally; the banner stayed present on `/demo/activity/patterns`; Reset demo restored the seeded two-win state.
- All six demo activity URLs render their named activity and retain demo mode.
- Export produced `learning-station-2026-08-29.json`.
- A structurally complete negative-score import was rejected with `That file is not a valid Learning Station export.`
- A trailing-space keyboard response produces the intentional recovery state `A useful try`; a correct Number Stones response produces `Good noticing!`.
- Moss Sketchbook accepted both keyboard-created drawing input and a touch-style pointer stroke, then saved a 10-point session.
- Advancing a round moved keyboard focus to the new task slab.

Evidence: `live-functional-qa.json`, `live-typing-boundary.txt`, `live-numbers.txt`, and `live-drawing-inputs.txt`.

### Privacy, security, and request allowance

The complete live demo flow made requests only to `https://linux-learning-station.sociobot.in`; no analytics, advertising, chat, third-party runtime scripts, or child-progress network request appeared. The live root includes CSP (with response-header `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. Hashed assets are immutable for one year; the service worker is served no-cache.

The optional Sociobot license-verify endpoint was checked with one client and unique invalid tokens: requests 1–30 returned 200; request 31 and later returned **429** with **`Retry-After: 3`**. Observed allowance: **30 requests per client window**. Evidence: `license-rate-limit.txt`.

### Accessibility, mobile, and PWA

- Live axe scans for `/`, `/demo`, a demo activity, Privacy, and Terms: zero serious/critical findings.
- Each scanned page has one `h1` and `main`; the cold page has `lang="en"`, descriptive title, alt text, labels, and a first-Tab skip link.
- At 390px there is no horizontal overflow; the demo is usable with six slabs. The checked visible links/buttons are all at least 44px in both dimensions.
- `prefers-reduced-motion: reduce` reduces activity transitions to `0.00001s`.
- A fresh live context became service-worker controlled. After going offline, `/demo` reloaded to the usable station, displayed `Offline`, retained the demo banner, and logged no errors.
- The independently run `@claim:update-notice` test passed its waiting-worker simulation and verified that Update now sends `SKIP_WAITING`.

Evidence: `live-a11y-pwa-mobile.json`, `live-cold-mobile.png`, `live-demo-mobile.png`, and `claim-update-notice.txt`.

## Defects by severity

No critical, high, medium, or low candidate defects were found.

### Non-blocking operational limitation

New ₹499 bundle sales are explicitly paused because the factory checkout registration is unavailable. The candidate does not expose a broken buy link, clearly says sales are paused, and keeps restore/verification of existing licenses available. This does not block the free core product or this release, but the factory must register the hosted checkout before advertising new sales.

## Scope notes

This is a static offline PWA. There is no product sign-in, backend persistence, CLI/library package, or product server health/concurrency surface to test. Microsoft Entra checks are therefore not applicable.
