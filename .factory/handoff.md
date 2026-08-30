# Linux Learning Station — verification 6 handoff

- Candidate: `d5731b8be6f23ea1a7aef9b213cb5993808ff7d6`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-30 UTC
- Result: **FAIL — do not release the paid product until new-license checkout is available.**

No product source was modified during this independent verification. The complete evidence is in [verification-6.md](verification-6.md).

The free offline station is healthy: all 17 required claim commands, the 30-test Playwright suite, unit tests, lint, production build, offline reload, installability, local-only request flow, accessible mobile layout, and deployment byte parity passed. The live license verification endpoint admitted 30 client requests, then returned 429 with `Retry-After: 1`.

Release blocker: the product advertises a ₹499 workshop bundle but explicitly says new licenses are not for sale and supplies no Sociobot checkout URL. That contradicts the researched brief's one-time purchasable offline bundle and the paid-unlock contract. Existing-token restore does not meet that requirement. Register and wire the hosted Sociobot checkout, then rerun the paid flow and this verification.

Non-blocking QA defect: the shipped `npm run verify:live` currently flakes after Back/Forward because the answer button is still moving during smooth scroll; the fresh failure log is at `verification-artifacts-6/live-verifier.log`.

---

# Linux Learning Station — polish round 3 handoff

- Work order: `linux-learning-station-polish-3`
- Released candidate: `ba626cd6f56f9b14b882a40a5ed64d1e2b90a53e`
- Adversarial report commit: `4d233475779382523940300c0717df7168b6de35`
- Verified repair commit: `740b537d81f40e10d5397bc9b2a0b72a25d183ab`
- Product version: `v1.2.3`
- Live URL: <https://linux-learning-station.sociobot.in>
- Azure Static Web Apps deployment: `c286e4cf-b709-4424-92cf-b8034203079c`
- Result: **PASS — no known open finding**

## What changed

All findings in `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`, and `polish-2.md` were rechecked. The complete finding-by-finding evidence map is in `polish-3.md`.

- Replaced wildcard activity rewrites with explicit routes for all six real and six demo activities. Invalid activity slugs now return the designed HTTP 404 and `/404` canonical.
- Kept the first screen plain and direct, with the sample-data action and all four facts visible at 390×844.
- Preserved the isolated `/?demo=1` flow, persistent banner, reset, and discard-on-exit behavior. Demo timestamps now stay relative to the visit.
- Made the mobile demo intro reflow at 200% text size. The page remains 390 px wide, and the full progress stamp stays inside the viewport width.
- Added the missing session-shape claim and completed three rounds in each guided activity plus one saved drawing in its test.
- Removed unproved merchant, refund, and revocation statements. Earlier-purchase questions now point to support.
- Changed paid-bundle verification to start through the visible Adult tools restore form. Added separate storage and token-only request privacy claims.
- Added all 12 activity routes to `sitemap.xml` and a route/sitemap regression.
- Updated the catalog description to a 105-character verb-first sentence and refreshed the landing copy audit.
- Bumped the manifest, service-worker cache, package, and visible footer to `v1.2.3` without changing the concrete-and-moss visual thesis.

## Clean-clone evidence

A new clone of remote `main` resolved to `740b537d81f40e10d5397bc9b2a0b72a25d183ab` with a clean status before installation.

- `npm ci`: passed; 61 packages installed; zero audit findings.
- Every one of the 17 exact commands in `.factory/claims.json`: passed independently from that clone.
- `npm test`: passed — 4 unit tests and 30 Playwright tests.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/index.html`.
- `npm audit --omit=dev`: passed with zero vulnerabilities.
- Build sizes: JavaScript 35.21 KB raw / 12.35 KB gzip; CSS 18.98 KB raw / 4.99 KB gzip; no downloaded fonts.

The browser suite covers all activity completion paths, three-round sessions, drawing, offline save/reload, installability, a real worker update, demo isolation, import/export boundaries, erasure, print, keyboard/pointer/touch, route focus, valid and invalid routing, 200% text, license restore/storage/request privacy, and axe scans.

## Live evidence after deployment

- `npm run verify:live`: passed from fresh browser contexts. It reports zero console errors, no third-party requests during core use, minimum target 44 px, zero Chromium installability errors, offline activity save success, full session-shape success, and UI license restoration success.
- Invalid `/activity/not-real` and `/demo/activity/not-real` return HTTP 404 with the designed 404 title and `/404` canonical.
- All 12 valid activity routes return 200 with their correct title, canonical, one h1, and main landmark. Root, demo, Privacy, and Terms links all resolve to 200.
- Deployed SHA-256 values match local `dist/` for `index.html`, `sw.js`, `manifest.webmanifest`, hashed JavaScript, and hashed CSS.
- Security headers include CSP with response-header `frame-ancestors 'none'`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- `/opt/fleet/lib/verify-url.sh`: passed with the expected title, `lang=en`, one h1, main landmark, complete image alt coverage, labeled buttons, and zero console errors.
- Playwright axe integration found zero serious or critical issues on landing, demo, Adult tools after license restore, Privacy, Terms, activities, and the designed 404.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0.

Evidence files:

- `.factory/polish-3-live/live-check.json`
- `.factory/polish-3-live/live-cold-mobile.png`
- `.factory/polish-3-live/live-demo-mobile.png`
- `.factory/polish-3-live/live-demo-200-percent.png`
- `.factory/polish-3-verify/verify.json`
- `.factory/polish-3-verify/screenshot-desktop.png`
- `.factory/polish-3-verify/screenshot-mobile.png`
- `.factory/polish-3-lighthouse.json`

## Known gaps and next steps

No product, claim, accessibility, privacy, offline, routing, mobile, metadata, or deployment gap remains from the cumulative reviews. New license sales intentionally remain unavailable, and the UI makes no checkout promise or purchase action.
