# Linux Learning Station — repair handoff

- Work order: `linux-learning-station-repair-1`
- Repaired candidate base: `6d9ffa353bb780172e3ffe8301a8f5e2f1b8087e`
- Artifact: static offline PWA; publish `dist/`
- Completed: 2026-08-29 UTC

## Repairs

- Added `.factory/claims.json`; every claim has one observable Playwright test tagged `@claim:<id>`.
- Added `/demo` and `?demo=1`: a one-click ages 7–8 sample station in the separate `linux-learning-station-demo` IndexedDB database. The persistent banner has Reset demo and Start for real controls. `.factory/demo.md` documents it.
- Corrected the invalid ages 9–10 logic exercise, rejected partial/invalid import attempts instead of displaying `NaN`, and made typing answers truly exact.
- Fixed the native “Keep progress” cancellation path; added History API activity URLs, route titles/focus/live announcements, drawer focus containment/Escape behavior, visible import focus, and 44px legal targets.
- Hardened malformed license-verdict parsing so a broken cached value cannot prevent startup.
- Added Static Web Apps security/caching/routing configuration, a designed 404, immutable asset headers, CSP with `frame-ancestors 'none'`, canonical/social metadata, Apple icon, and complete footer identity.
- Repaired service-worker precaching of current hashed assets; offline reload now covers the real station and the demo. Added an original 1200×630 social crop derived from the recorded hero art.

## Verification

```sh
npm ci
npm test
npm run lint
npm run build
```

- `npm ci`: pass; 0 audited vulnerabilities.
- `npm test`: pass — 4 unit assertions and 11 Playwright browser tests.
- `npm run lint`: pass (TypeScript).
- `npm run build`: pass; `dist/index.html` and `dist/staticwebapp.config.json` present.
- Claim tests cover six free activities, offline reload, demo isolation/offline reload, same-origin core use, and JSON export/import validation.
- Browser coverage includes desktop and 390px mobile, Tab/Shift+Tab drawer containment, Escape, native dialog cancel, route title/focus, malformed cached-license startup, privacy request logging, actual download/export, demo reset, and the corrected third logic round.
- Playwright axe scan on the mobile setup screen: zero serious/critical findings. Factory `verify-url.sh` against the production preview: HTTP 200, no console/page errors, title/lang/one h1/main/alt/button-label checks all pass.
- Production bundle: JS 32.66 KB raw / 11.60 KB gzip; CSS 17.53 KB raw / 4.70 KB gzip; hero 102,784 bytes; social image 83,126 bytes.

`@axe-core/cli` was attempted with the preinstalled Playwright Chrome, but its Selenium launcher exits before a session starts in this container. The equivalent in-repository `@axe-core/playwright` scan runs against the preinstalled browser and passes.

## Deployment

Deploy with `npm ci && npm run build`, then publish `dist/` as the static app root. `dist/staticwebapp.config.json` contains the headers, route rewrites, asset-cache policy, and 404 override.

## Known external gap

The source preserves the required Sociobot checkout URL, but a direct verification on 2026-08-29 still returned `404 {"error":"enabled factory product"}` from `https://api.sociobot.in/api/v1/products/linux-learning-station/checkout`. Enabling/registering that factory billing product is an external factory operation; no billing credential or registration configuration exists in this repository. The free product, demo, and license restore/verification behavior remain fully usable.
