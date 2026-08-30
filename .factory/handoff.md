# Linux Learning Station — repair 4 handoff

- Work order: `linux-learning-station-repair-4`
- Verifier report commit: `50ce534356ba7f08886a90395497d736ca618e26`
- Repaired candidate: `d5731b8be6f23ea1a7aef9b213cb5993808ff7d6`
- Source repair commit: `f0e1394`
- Product version: `v1.2.4`
- Live URL: <https://linux-learning-station.sociobot.in>
- Azure Static Web Apps deployment: `667553fd-481f-44da-a9f0-4c7af4380ebe`
- Verified: 2026-08-30 UTC
- Result: **PASS — every finding in verification 6 is repaired**

## Finding repairs

### P1 — the ₹499 workshop bundle could not be purchased

Root cause: the bundle was not registered as an enabled live Sociobot product, and the product exposed only existing-license restore.

Repair:

- Registered `Linux Learning Station Workshop Bundle` as a live, one-time ₹499 Sociobot/Dodo product for the `linux-learning-station` slug.
- Added a visible `Buy workshop bundle — ₹499` link to the landing price section and locked Adult tools panel. Both use the required Sociobot checkout URL.
- Preserved the existing return-token flow: `?license=<token>` is stored under the product-scoped local key, removed from the address bar, verified through Sociobot, and reconciled without blocking the free experience.
- Preserved the visible paste-and-verify restore path for buyers moving devices.
- Updated Privacy, Terms, README, copy audit, and the claim manifest without changing the six free activities.
- Replaced the obsolete `sales-paused` claim with `@claim:checkout-purchase`. Its recorded gateway fixture proves the exact request boundary, returned-token storage and URL stripping, verification, and unlocked UI without making a live charge.

Live evidence: the public checkout endpoint returns HTTP 303 to `checkout.dodopayments.com`. The hosted 390 px checkout shows the exact bundle name and description. Dodo localized ₹499 to `$5.23` for the US test browser and displayed its currency selector.

### P3 — Back/Forward made the live verifier's answer click flaky

Root cause: global smooth scrolling continued after History API navigation while the route heading received focus. The activity answer moved during Playwright's actionability check.

Repair:

- Removed global smooth scrolling.
- Route changes now synchronously scroll to the top and focus the new h1 with `preventScroll`.
- Added a browser regression that enters an activity, goes Back then Forward, confirms `scroll-behavior: auto`, confirms heading focus, and immediately answers the round.
- Updated the live verifier to assert the same behavior before the formerly flaky click.

The immediate accessibility scan also exposed transient low contrast caused by panel opacity animation. The panel now moves only by transform, so its text keeps full contrast throughout the transition.

## Clean build and automated coverage

- `npm ci`: passed; 61 packages installed; zero audit findings.
- All 17 exact test commands in `.factory/claims.json`: passed independently.
- Claim/tag audit: 17 claims; exactly one `@claim:<id>` test for every claim.
- `npm test`: passed — 4 unit tests and 31 Playwright tests.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/index.html`.
- `npm audit --omit=dev`: passed with zero vulnerabilities.
- Production assets: JavaScript 35.65 KB raw / 12.46 KB gzip; CSS 18.98 KB raw / 5.00 KB gzip; no remote fonts or scripts.

The browser suite covers all six activity paths, three-round session shape, drawing, pointer/touch/keyboard operation, focus restoration, 200% text, demo isolation/reset/exit, import/export and erase boundaries, printing, license capture/restore/privacy, installability, service-worker update, offline save/reload, routes, metadata, and axe scans.

## Public deployment verification

- `npm run verify:live`: passed against the public domain from fresh browser contexts. It reports zero console errors, no outside requests during core use, 44 px minimum targets, zero Chromium installability errors, working offline activity save, full session shape, license restoration, and zero serious/critical axe findings.
- `/opt/fleet/lib/verify-url.sh`: passed with the expected title, `lang=en`, one h1, main landmark, complete alt text, labeled buttons, and zero console errors.
- Desktop, 390×844 mobile, and 390 px at 200% text were visually checked. No horizontal overflow or hidden action was found.
- Keyboard-only route and activity use passed. Route changes focus the h1; the skip link, dialogs, buttons, links, and answer controls remain reachable and visible.
- Offline-after-first-visit and service-worker update flows passed in isolated browser contexts. The demo remains in its separate namespace.
- Landing, demo, Adult tools after restore, Privacy, Terms, activities, and the designed 404 have zero serious or critical Playwright axe findings.
- Root, demo, Privacy, Terms, and valid activity routes return 200. Invalid activity and arbitrary routes return the designed 404.
- Response policy passed: CSP includes response-header `frame-ancestors 'none'`; HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy` are present. Hashed assets are immutable; the service worker is no-cache.
- Deployed `index.html`, hashed JavaScript, hashed CSS, `sw.js`, and `manifest.webmanifest` are byte-for-byte equal to local `dist/`.
- A unique invalid license returns `{ valid: false, reason: "invalid" }`; no production token was retained.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0.

Evidence:

- [`repair-4-live/live-check.json`](repair-4-live/live-check.json)
- [`repair-4-live/live-cold-mobile.png`](repair-4-live/live-cold-mobile.png)
- [`repair-4-live/live-demo-mobile.png`](repair-4-live/live-demo-mobile.png)
- [`repair-4-live/live-demo-200-percent.png`](repair-4-live/live-demo-200-percent.png)
- [`repair-4-live/live-checkout-mobile.png`](repair-4-live/live-checkout-mobile.png)
- [`repair-4-verify/verify.json`](repair-4-verify/verify.json)
- [`repair-4-verify/screenshot-desktop.png`](repair-4-verify/screenshot-desktop.png)
- [`repair-4-verify/screenshot-mobile.png`](repair-4-verify/screenshot-mobile.png)
- [`repair-4-lighthouse.json`](repair-4-lighthouse.json)

## Remaining limits

No release-blocking product, claim, accessibility, privacy, offline, routing, identity, or deployment gap is known. The repair did not submit a real card payment, so it created no financial transaction. Product registration, live checkout identity, return-token handling, verification, restore, and invalid-token behavior were verified without charging a card.
