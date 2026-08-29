# Linux Learning Station — repair handoff

- Work order: `linux-learning-station-repair-2`
- Repaired candidate: `7a0761721afcc68cac680b353de053602f579b56`
- Verifier report: `6f39009dcb8247b39ffa725b0fc9f76b553798ce`
- Repair commits: `5442a976bda033318f7e66ba52db86f1d89fc4f6`, `434878f`
- Live URL: <https://linux-learning-station.sociobot.in>
- Deployment: Azure Static Web Apps production, deployment `da6d1f9e-70fc-40a4-912b-2e87abca338e`
- Product/build identity: `v1.2.0`
- Completed: 2026-08-29 UTC

## Repaired findings

1. Every claim command now runs a production build through `pretest:e2e`; all 11 commands pass without a pre-existing `dist/`.
2. Demo detection covers `/demo`, `/demo/*`, and `?demo=1`. Activity routing, saves, reset, offline reload, and Start for real stay inside the demo database until the user explicitly leaves.
3. Imports accept only the app’s real score domain: correct attempts have 10 points and practice attempts have 2. Negative and correct/score-mismatched attempts are rejected.
4. `.factory/claims.json` now lists and independently tests export/import, erase, progress codes, keyboard/touch drawing, updates, five-round licensed sessions, detailed printouts, and daily license verification.
5. The broken hosted-checkout link is no longer shown. New sales are plainly marked paused; existing license restore and licensed features remain available. No billing infrastructure or provider is embedded in this repository.
6. Storage recovery uses delegated event handling instead of CSP-blocked inline JavaScript.
7. Each round moves focus to the new task slab. Keyboard users continue from the new question without restarting traversal.
8. Brand, demo, footer, and skip-link targets meet 44×44 CSS px at 390px. The header wraps without overflow at 200% text size.
9. The cold landing page now includes three-step use, privacy/non-goals, and exact optional-bundle pricing.
10. App, package, manifest, legal pages, and service worker now report `v1.2.0` consistently.

## Verification evidence

From a tree with both `node_modules/` and `dist/` moved aside:

- `npm ci`: 59 packages installed; 0 vulnerabilities.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `npm test`: unit 4/4 and Playwright 20/20 pass. The browser suite covers desktop, 390px mobile, keyboard focus, touch-style pointer input, six-route axe scans, privacy requests, demo/real storage isolation, malformed import boundaries, offline reload, update messaging, and license caching.
- `npm run lint`: TypeScript `--noEmit` passes.
- `npm run build`: passes and produces `dist/index.html`.
- All 11 exact commands in `.factory/claims.json`: pass independently after `dist/` was removed.
- Built JS: 33.92 KB raw / 12.01 KB gzip. CSS: 18.84 KB raw / 4.98 KB gzip. Hero WebP: 102,784 bytes. No font downloads.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.8s, TBT 0ms, CLS 0.
- Visual inspection: 1440px desktop, 390px cold mobile, and 390px demo mobile pass. Simulated 200% text size has 0px horizontal overflow.
- `verify-url.sh` on production: HTTP 200; title and `lang` present; one h1 and one main; 0 missing image alts; 0 unlabeled buttons; 0 console/page errors.
- Live routes: `/`, `/demo`, `/demo/activity/patterns`, `/activity/numbers`, `/privacy/`, `/terms/`, manifest, and service worker return 200. An unknown route returns the designed 404.
- Live response policy: CSP, HSTS, Referrer-Policy, X-Content-Type-Options, and Permissions-Policy are present. The CSP keeps `frame-ancestors` in the response header.
- Live privacy flow: 0 third-party requests while completing a core demo activity. The optional invalid-license request returns HTTP 200, `valid:false`, `reason:"invalid"`, `Cache-Control: no-store`, and the correct CORS origin.
- Live PWA: controlled by the service worker; `station-v1.2.0-shell` exists; the demo reloads fully offline.
- Deployment parity: SHA-256 matches for all 18 deployed files (deployment-only config excluded), 0 mismatches.

## Run and verify

```sh
npm ci
npm audit --omit=dev
npm test
npm run lint
npm run build
npm run preview
```

The deploy command is:

```sh
/opt/fleet/lib/deploy-static.sh linux-learning-station dist
```

## Known external gap

The factory billing registry still returns HTTP 404 for the slug’s checkout endpoint, and this worker contains no authorized paid-product registration utility. New sales therefore remain paused instead of sending visitors to a broken checkout. Once the factory registers `linux-learning-station`, re-enable the hosted Sociobot checkout link and add a live checkout-availability claim test. Existing license verification, restore, five-round sessions, and detailed printouts are working and tested.

Package-consumer, backend health, authentication, and server-concurrency checks do not apply to this static offline PWA.
