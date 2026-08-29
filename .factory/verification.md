# Independent product verification — FAIL

- Work order: `linux-learning-station-verify-1`
- Candidate: `6d9ffa353bb780172e3ffe8301a8f5e2f1b8087e`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-29 UTC
- Decision: **FAIL — do not release**

The live deployment is byte-for-byte the candidate build, so the result is not caused by a stale deployment. Two explicit acceptance gates fail: `.factory/claims.json` is missing, and the first screen has no one-click sample-data demo. The paid checkout also returns 404.

## Mandatory gates

### Claims: FAIL

`.factory/claims.json` does not exist at the candidate commit. There were therefore no declared claim commands to run. The claims contract makes a missing manifest release-blocking.

Claim-like statements appear in the UI and README without registered tests, including offline operation, local-only progress, no telemetry/tracking, six free activities, JSON export/import, printable progress, and paid five-round sessions. The repository's ordinary Playwright offline test does not substitute for the required claim manifest and tagged one-test-per-claim coverage.

### Cold first-read and demo: FAIL

Cold desktop and 390×844 mobile contexts showed:

- Headline: “Set up this learning station”
- Supporting text: choose a child's age range; no accounts, ads, or internet-required activities
- Available first actions: age-band buttons for 5–6, 7–8, and 9–10

The screen indirectly identifies a child audience, but does not plainly identify the parent/teacher/shared-Linux use case or name the six activity types. Its prominent “One computer. Six ways to grow” and image caption are slogans rather than useful facts. Most importantly, there is no “Try it with sample data” action.

Both `/?demo=1` and `/demo` return the normal unseeded setup screen. Neither has sample data, an isolated storage namespace, a demo banner, “Reset demo,” or “Start for real.” `.factory/demo.md` is also absent.

## Findings by severity

### Release blockers

1. **Missing claims manifest and claim tests.** `.factory/claims.json` is absent. This independently fails the acceptance contract.
2. **No one-click isolated demo.** There is no demo action or working demo route/query mode. This independently fails the first-screen acceptance gate.

### High

3. **The advertised paid purchase cannot start.** `GET https://api.sociobot.in/api/v1/products/linux-learning-station/checkout` returned HTTP 404 with `{"error":"enabled factory product","status":404}`. The visible ₹499 “Buy the offline bundle” link targets this URL.
4. **A core age 9–10 logic exercise has no valid answer.** The exercise says exactly one sign is truthful; A says “B is true,” and B says “Both are false.” No truth assignment is consistent, yet the product marks “A is true” correct. This is incorrect educational content in one of the six core activities.
5. **Required deployment security configuration is absent.** Live responses have HSTS, `Referrer-Policy`, and `X-Content-Type-Options`, but no Content-Security-Policy or equivalent `frame-ancestors` protection. The repository has no `staticwebapp.config.json`.

### Medium

6. **Malformed imports can corrupt visible progress.** An attempt containing only `id`, `activity`, and `createdAt` passes `validateImport`; because `points` is missing, the board displays `NaN POINTS`. Validation does not enforce activity IDs, booleans, finite points, or valid dates.
7. **“Keep progress” does not close the reset dialog.** The app prevents every submit event, including the native `method="dialog"` cancel submission. Escape works and “Erase progress” completes after its async handler.
8. **Keyboard/focus behavior is incomplete.** Route changes do not move focus to or announce the new `<h1>`, activity titles do not update `document.title`, the adult drawer allows focus to move into the obscured page, and the opacity-zero import input receives keyboard focus without a visible ring. Visible Privacy/Terms links in the drawer measure about 19 px high, below the 44 px touch-target requirement.
9. **Corrupt license cache bricks startup.** Invalid JSON in `sb_license_verdict:linux-learning-station` throws before the storage error boundary. The page remains at “Opening the station…” with no `<h1>` or recovery action.
10. **Site structure and metadata are incomplete.** Activity states use hash routes; there is no canonical URL, Open Graph/Twitter metadata, Apple touch icon declaration, designed 404, or route-specific title. Unknown paths return the landing page with HTTP 200. The setup screen has no footer, and app/legal footers omit the required Privacy/Terms, Param Factory attribution, and version/build identity combination.
11. **Static caching misses the performance contract.** The hashed JS/CSS and images all return `cache-control: public, must-revalidate, max-age=30` rather than long-lived immutable caching.
12. **Copy/process artifacts are incomplete.** `.factory/copy-audit.md` is absent. “Type this trail exactly” accepts leading/trailing whitespace because input is trimmed, contradicting the instruction.

## Verification evidence

### Clean repository

- `git rev-parse HEAD`: exact candidate hash.
- Initial `git status --short`: empty.
- `npm ci`: pass; 59 packages installed; 0 vulnerabilities.
- `npm audit --omit=dev`: pass; 0 vulnerabilities.
- Available scripts inspected: no separate lint script. Type checking runs in `npm run build`.
- `npm test`: pass.
  - Vitest: 4/4.
  - Exact production build within the test: pass.
  - Playwright: 6/6, including its mobile axe and offline test.
- Independent `npm run build`: pass; `dist/` produced.

### Functional and boundary testing

- All six activities opened at 390 px. Existing tests completed patterns, typing, spelling, and drawing; independent testing completed a three-round logic session and exercised Number Stones.
- Wrong answers show the expected answer, move focus to “Next round,” and allow recovery.
- Progress persisted across reload. Export downloaded valid JSON with the expected age band and attempt count. A valid import changed the age band. Structurally invalid station data showed a useful error. Empty required spelling input used native validation. Print media showed the progress sheet and `MOSS-…` code while hiding screen UI.
- Reset erasure returns to first-run setup. The non-destructive “Keep progress” path is broken as described above.
- Normal activity use generated only same-origin requests. No analytics, third-party scripts, fonts, ads, or child-data requests were observed. Supplying a license explicitly made only the documented Sociobot verification request; the license query was stripped from the browser URL.

### Accessibility and responsive checks

- Cold setup, mobile board, adult drawer, Privacy, and Terms: zero axe serious/critical findings.
- Semantic baseline on the app: `lang="en"`, a title, one `<h1>`, and `<main>` present.
- Designed focus ring is visible on ordinary controls; the first Tab reaches the skip link.
- No horizontal overflow at 390 px or 320 px. Desktop 1440×900 and mobile 390×844 were visually inspected.
- Reduced-motion emulation reduced transition/animation duration to `0.01ms`.
- Defects in finding 8 remain outside axe's automated coverage.

### PWA, offline, update, and performance

- Chromium `Page.getAppManifest`: no manifest errors; `Page.getInstallabilityErrors`: none.
- Live service worker reached `activated` and controlled the page. After a warm reload, a fully offline reload restored the station, age band, progress, and activity list.
- Update simulation against an isolated copy: a changed `sw.js` entered `waiting`; the update toast appeared; “Update now” activated it; the old `station-v1.0.0-shell` cache was replaced by `station-v1.0.1-shell`; no console/page errors.
- Build assets: JS 28.50 KB raw / 10.45 KB gzip; CSS 16.56 KB raw / 4.52 KB gzip; hero WebP 102,784 bytes; no web fonts. Budgets pass.
- Lighthouse 12.8.2 against live mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 40 ms, CLS 0, total transfer 118 KiB.

### Deployment and endpoints

- SHA-256 comparison matched all 15 deployed build files to local `dist/`: root HTML, service worker, manifest, legal/offline/robots/sitemap files, both legal pages, hashed JS/CSS, hero, mark, and both icons.
- Normal live cold load produced no console or page errors. The malformed-cache test deliberately produced the startup error described above.
- Root, JS, and service-worker responses use `max-age=30`; required immutable asset caching is absent.
- Sociobot license verification rate limiting passed: requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 3`. Observed allowance: 30 requests per client window. Checkout rate behavior could not be meaningfully verified because checkout itself returns 404.
- No sign-in exists, so the Entra authority check is not applicable. There is no product backend, library, or CLI.

## Positive acceptance evidence

The six local activities, age bands, local persistence, JSON ownership controls, printable code, legal pages, original-asset provenance, responsive visual system, offline reload, installable manifest, service-worker update path, reduced motion, automated accessibility baseline, privacy request behavior, build reproducibility, size budgets, and live/candidate parity all worked. They do not override the explicit claims and demo release blockers.

## Required before release

Add the isolated one-click sample-data demo and `.factory/demo.md`; add `.factory/claims.json` with one tagged observable test per claim; register/fix the live checkout; correct the invalid logic problem; harden imports and cached license parsing; fix dialog and focus behavior; and add the required deployment headers, metadata, real 404, and immutable asset caching. Then rerun independent verification.
