# Independent product verification 2 — FAIL

- Work order: `linux-learning-station-verify-2`
- Candidate: `7a0761721afcc68cac680b353de053602f579b56`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-29 UTC
- Decision: **FAIL — do not release**

The live deployment is byte-for-byte the candidate build, so this is not a stale-deployment result. The candidate fails three independent release gates: every declared claim command fails after a clean install because the commands assume a pre-existing `dist/`; the demo stops being a demo on activity routes and can write progress into the real database; and the promised malformed-import rejection accepts negative points. The advertised paid checkout also still returns 404.

## Mandatory gates

### Claims: FAIL

`.factory/claims.json` exists with five entries. I ran every listed command immediately from the clean checkout, then ran `npm ci` and ran all five again before any build. The pre-install run could not load `@playwright/test`. More importantly, after the documented clean install all five commands started `vite preview`, received 404 at `/` because `dist/` did not exist, and timed out after 60 seconds:

1. `six-free-activities`: exit 1
2. `offline-reload`: exit 1
3. `demo-sandbox`: exit 1
4. `local-only`: exit 1
5. `json-export`: exit 1

Evidence: [`claim-tests-after-install.txt`](verification-artifacts/claim-tests-after-install.txt).

After `npm run build`, the same five commands each passed once. That does not cure the clean-clone contract failure. It also exposes false-positive claim coverage:

- The sandbox test only loads and resets `/demo`; it never starts or saves an activity. Independent use proves demo data is not isolated throughout the flow.
- The import test checks only a partial object. A structurally complete attempt with `correct: true` and `points: -999` is accepted, announced as a successful import, and displayed as one win and “Today -999 points.”
- Four of the five claim tests begin at `/` and configure real mode, contrary to the requirement to verify claims from the demo entry point.

Evidence: [`claim-tests-built.txt`](verification-artifacts/claim-tests-built.txt), [`demo-real-contamination.txt`](verification-artifacts/demo-real-contamination.txt), and [`import-boundaries.txt`](verification-artifacts/import-boundaries.txt).

### Cold first-read: PASS; one-click usable sandbox: FAIL

The cold desktop and 390 px screens plainly answer the three first-read questions:

- What: “Start offline learning activities.”
- For whom: parents and teachers setting up a shared computer for ages 5–10.
- First action: “Try it with sample data,” followed by a plain explanation.

The action opens a seeded ages 7–8 board with six activity slabs, two wins, and the required demo banner. However, the sandbox is not usable end to end. Selecting Number Stones changes the URL to `/demo/activity/numbers`, removes the demo banner, and leaves the board on screen with no round. `isDemoMode()` recognizes only exactly `/demo` or `?demo=1`, not `/demo/activity/*`.

The failure can cross the storage boundary. Starting with a clean real ages 5–6 station, I entered the demo, selected Number Stones, then selected Pattern Quarry from the erroneously redisplayed board. The second action moved to `/activity/patterns`; completing its first round wrote one Pattern Quarry win into the real `linux-learning-station` database. Returning to `/` showed the real ages 5–6 station with that demo-generated win.

Screenshots: [`live-cold-desktop.png`](verification-artifacts/live-cold-desktop.png) and [`live-mobile-demo.png`](verification-artifacts/live-mobile-demo.png).

## Findings by severity

### Release blockers

1. **Every declared claim command fails from the clean installed clone.** The commands invoke Playwright against `vite preview` but do not build first. With no committed `dist/`, the preview server returns 404 and Playwright times out. All five claim commands exit 1.
2. **The demo is neither usable nor isolated after an activity click.** `/demo/activity/*` is not recognized as demo mode. The banner disappears, the requested activity does not open, and a subsequent activity can save demo progress in the real database. This disproves `demo-sandbox` and defeats the required one-click sandbox.
3. **The malformed-import claim is false.** The validator accepts arbitrary finite scores, including `-999`, producing impossible negative progress while reporting success. The authored test covers only missing fields.
4. **Several visitor-facing claims are absent from `claims.json`.** README, UI, Privacy, and Terms additionally promise successful JSON import, erase-all behavior, printable anonymous progress codes, keyboard/pointer/touch paths, update behavior, five-round paid sessions, detailed paid printouts, and once-daily license verification. These have no corresponding manifest entries with one tagged observable test each.

### High

5. **The advertised purchase cannot start.** `GET https://api.sociobot.in/api/v1/products/linux-learning-station/checkout` freshly returned HTTP 404 with `{"error":"enabled factory product","status":404}`. The ₹499 buy link is visible in Adult tools. This remains an external factory/deployment gap, but it is user-facing and blocks the paid offer.

### Medium

6. **The local-storage error recovery button is blocked by the live CSP.** With IndexedDB unavailable, the useful error screen appears, but “Try again” uses an inline `onclick`. Clicking it does not reload and logs a `script-src 'self'` CSP violation.
7. **Focus is lost between activity rounds.** Answer feedback correctly focuses “Next round.” Activating it replaces the DOM and attempts to focus a non-focusable paragraph; `document.activeElement` becomes `<body>`, forcing keyboard users to restart traversal.
8. **Several mobile controls are below the required 44 px target.** At 390 px, Reset demo and Start for real are 36 px high, the brand link is 33 px high, and footer Privacy/Terms links are 19 px high. Lighthouse's spacing heuristic passes, but the explicit product contract requires each target to be at least 44 px.
9. **The landing information structure is incomplete.** The cold page has the first screen and footer but no three-step “How it works,” no plain “what it does not do/privacy” section, and no exact paid-tier price on the landing page. The first-screen fact line covers activity count, local progress, and offline use but omits price.

### Low

10. **Visible build identity is inconsistent.** The app/footer/service worker report v1.1.3, while Privacy and Terms footers report v1.1.0.

## Verification evidence

### Clean repository and build

- `git rev-parse HEAD`: exact candidate hash above.
- Initial `git status --short`: empty.
- Node 22.23.2; npm 10.9.8.
- `npm ci`: pass; 59 packages; 0 vulnerabilities.
- `npm audit --omit=dev`: pass; 0 vulnerabilities.
- `npm test`: pass after its build step — Vitest 4/4, production build, Playwright 11/11.
- `npm run lint`: pass (TypeScript `--noEmit`).
- Independent `npm run build`: pass; `dist/` produced.
- Build output: JS 32.66 KB raw / 11.60 KB gzip; CSS 17.53 KB raw / 4.70 KB gzip; hero WebP 102,784 bytes; no downloaded fonts. All static budgets pass.

Logs: [`npm-test.txt`](verification-artifacts/npm-test.txt), [`npm-lint.txt`](verification-artifacts/npm-lint.txt), and [`npm-build.txt`](verification-artifacts/npm-build.txt).

### Functional, boundary, and recovery checks

- Independently exercised Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook on live. Correct, wrong-answer, next-round, completion, drawing add/undo/clear, and persistence paths worked.
- Covered ages 5–6, 7–8, and 9–10. The corrected third ages 9–10 logic round is solvable.
- Empty typing and license inputs trigger native required-field messages. Exact typing rejects a trailing space. Spelling intentionally accepts case differences.
- Partial JSON imports are rejected with a useful status message. A 501-attempt import is bounded to 500. The negative-points semantic-invalid case is accepted as described above.
- Normal reset/cancel, export download, valid station persistence, route titles, and real activity deep links worked in the repository tests.
- The storage-blocked recovery failure is recorded in [`storage-error-recovery.txt`](verification-artifacts/storage-error-recovery.txt).

### Privacy, headers, endpoints, and links

- A cold load, setup, and completed live Pattern Quarry round made requests only to `https://linux-learning-station.sociobot.in`; no analytics, ads, third-party fonts/scripts, or child-data requests occurred. Evidence: [`privacy-request-log.txt`](verification-artifacts/privacy-request-log.txt).
- Root responses include HSTS, CSP with `frame-ancestors 'none'`, `Referrer-Policy`, `X-Content-Type-Options`, and `Permissions-Policy`. Hashed assets return `Cache-Control: public, max-age=31536000, immutable`; `sw.js` returns `no-cache`.
- Internal links returned 200, an unknown route returned the designed 404, mail links were explicit, and the only broken crawled HTTP link was the paid checkout. Evidence: [`link-crawl.txt`](verification-artifacts/link-crawl.txt).
- License verification rate limiting is enforced: requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 3`. Observed allowance: 30 requests per client window. Checkout allowance could not be meaningfully tested because checkout itself returns 404. Evidence: [`billing-endpoints.txt`](verification-artifacts/billing-endpoints.txt).
- There is no sign-in and no product backend, library, or CLI. Entra, concurrency, server persistence, package-consumer, and product health/build-identity checks are not applicable.

### Accessibility and responsive behavior

- Stable cold desktop, demo mobile, adult drawer/error state, Privacy, and Terms scans: zero axe serious/critical violations.
- `lang="en"`, descriptive titles, one `<h1>`, `<main>`, image alt handling, labels, and a first-tab skip link are present.
- Ordinary controls show the designed clay/lichen focus indicator. Contrast is 4.71:1 against concrete and 3.19:1 between the two focus colors.
- No horizontal overflow at 390 px, 320 px, or simulated 200% root text size. Desktop and mobile screenshots were visually inspected.
- Reduced-motion emulation changes UI transitions to `0.01ms`; no looping or flashing animation exists.
- The focus and touch-target defects above remain outside the stable axe result.

### PWA, performance, and deployment

- Chromium reports no manifest or installability errors.
- The live service worker activates, controls the page, caches the hashed script, and restores the configured real station on a fully offline reload.
- Fresh update simulation against an isolated candidate copy: v1.1.3 controlled the page; a v1.1.4 worker entered waiting; the toast appeared; Update now activated it; the old shell cache was replaced; no console/page errors. Evidence: [`service-worker-update.txt`](verification-artifacts/service-worker-update.txt).
- Lighthouse 12.8.2 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 100 ms, CLS 0, transfer 123 KiB. INP is not produced by this navigation-only lab run. Evidence: [`lighthouse-summary.txt`](verification-artifacts/lighthouse-summary.txt).
- SHA-256 comparison matched all 18 deployed build files to local `dist/`, excluding the deployment-only `staticwebapp.config.json`. Evidence: [`deployment-parity.txt`](verification-artifacts/deployment-parity.txt).
- Normal live flows produced no console/page errors. The CSP error occurs only on the deliberately exercised storage-blocked recovery path.

## Required before release

Make every claim command self-contained from a clean installed clone; recognize `/demo` and every `/demo/...` route as demo mode; prove that completing activities never writes the real database; reject points outside the app's valid scoring domain; list and test every remaining claim from the demo entry point; register/enable the Sociobot checkout; replace the CSP-blocked inline recovery handler; retain focus between rounds; bring all mobile targets to 44 px; and align the landing structure and visible version. Then rerun independent verification.
