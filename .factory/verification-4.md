# Independent product verification 4 — PASS

- Work order: `linux-learning-station-verify-4`
- Candidate commit: `89a68a5ee7a85e2d875391d48ef6d564066da0fa`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-29 UTC
- Decision: **PASS — candidate accepted**

This verification used a clean checkout at the stated commit. `npm ci` completed before the mandatory claim commands. Product source was not changed.

## Mandatory first checks

### Claims: PASS

`.factory/claims.json` is present and declares 13 claims. Every exact `test` command was run from the clean checkout, each against the production-preview demo entry point. All passed:

1. `six-free-activities`
2. `offline-reload`
3. `demo-sandbox`
4. `local-only`
5. `json-export`
6. `erase-progress`
7. `printable-code`
8. `input-paths`
9. `update-notice`
10. `paid-bundle`
11. `daily-license-check`
12. `age-ranges`
13. `sales-paused`

The final Playwright status file reports `{"status":"passed","failedTests":[]}`. In particular, the offline test used a fresh context, waited for service-worker control, disconnected, reloaded, and completed a round; the update test activated a real waiting worker; the local-only test recorded only same-origin requests.

### Cold first read: PASS

In a brand-new live browser context, the first screen reads **“Start offline learning activities.”** It says it is **“For parents and teachers setting up a shared computer for children aged 5–10.”** The primary first action is **“Try it with sample data,”** with the adjacent plain explanation that it opens all six activities with ages 7–8 sample progress and does not save to the real station. One click opened `/?demo=1`.

This directly answers what it does, who it is for, and what to click first. The cold live request log contained only `https://linux-learning-station.sociobot.in` and had no console or page errors. Evidence: `verification-artifacts-4/live-cold-desktop.png`.

## Clean repository gates: PASS

- `npm ci` — pass; 59 packages added, audit reports 0 vulnerabilities.
- `npm run test:unit` — pass: 4/4 tests.
- `npm run lint` — pass: `tsc --noEmit`.
- `npm run build` — pass and writes `dist/`.
- `npm test` — pass: Vitest 4/4 and Playwright 24/24.
- Exact production build sizes: JavaScript 35.11 KB raw / 12.24 KB gzip; CSS 18.84 KB raw / 4.99 KB gzip; hero WebP 102,784 bytes. All are within the static/PWA budgets.

## Live deployment, functional QA, and privacy: PASS

### Candidate parity and delivery

SHA-256 values for the locally built `index.html`, hashed JS, hashed CSS, `sw.js`, and `manifest.webmanifest` exactly match the corresponding live responses. This deployment is the tested candidate, not a stale build.

All checked product routes returned 200: landing, `/demo`, all six demo activity deep links, real activity deep link, Privacy, Terms, manifest, robots, and sitemap. An unknown route returned the designed 404.

The landing response has CSP including header-delivered `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`. Hashed JS/CSS carry `public, max-age=31536000, immutable`; `sw.js` is `no-cache`; HTML/manifest/offline page revalidate at 30 seconds.

### End-to-end use, boundaries, and recovery

- One-click demo showed the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo and Start for real controls, and six activity slabs.
- Live Pattern Quarry completed with **“Good noticing!”** after the correct answer. The local full suite separately completed every one of the six activity paths at 390 px.
- The live adult flow exported `learning-station-2026-08-29.json` and rejected a negative-score import with **“That file is not a valid Learning Station export.”**
- The suite covers intentional invalid/recovery flows: exact typing rejects trailing space as **“A useful try,”** malformed and impossible imports are rejected, erase returns the real station to setup, and blocked IndexedDB shows a recoverable Try again state.
- Keyboard-created drawing input and a touch-style pointer stroke are covered by the claim test. Advancing a round moves focus to the new task slab.

### Privacy and request allowance

During a complete live demo path, every observed document, asset, script, stylesheet, and runtime request stayed on the product origin. There were no third-party scripts, analytics, ads, chat, iframes, console errors, or child-progress requests. The core path does not contact the optional license endpoint unless an existing token is supplied.

The Sociobot product license verification endpoint was tested with fresh invalid tokens from one client. Requests 1–30 returned 200; requests 31–35 returned **429**. A rate-limited header probe returned a `Retry-After` header (1–4 seconds depending on the remaining fixed window). Observed allowance: **30 verification requests per client window**. This satisfies the documented over-limit behavior.

There is no sign-in or product backend; Entra, server persistence/concurrency, and CLI/library pack checks are not applicable.

## Accessibility, mobile, and PWA: PASS

- The required `/opt/fleet/lib/verify-url.sh` ran against production: HTTP 200, title, `lang="en"`, one `h1`, `main`, image alt attributes, and no console errors. Its artifacts are in `verification-artifacts-4/verify-url/`.
- Fresh axe scans of `/`, `/demo`, a demo activity, Privacy, and Terms found zero serious or critical violations. Each scanned route had exactly one `h1` and one `main`.
- At 390 px, the demo has six visible activity slabs and no horizontal overflow. Visible navigation, demo controls, activity starts, and footer controls meet the 44 px target floor. Screenshot: `verification-artifacts-4/live-demo-mobile.png`.
- Keyboard-only smoke: first Tab focuses the skip link, with a visible 3 px clay outline and lichen focus halo. The tested dialog focus trap and drawing keyboard action pass.
- Under `prefers-reduced-motion: reduce`, activity slab transition duration is `0.00001s` and transform is `none`.
- In a fresh live context, after worker control and disconnecting, `/demo` reloaded offline to **Choose an activity**, reported **Offline**, kept the demo banner, completed Pattern Quarry, and generated no errors. The focused update-notice claim also passed its controller-change/cache-marker check.

## Defects by severity

No critical, high, medium, or low release-blocking defects found.

### Non-blocking operational note

The optional ₹499 bundle correctly states that new licenses are not currently for sale and presents no broken checkout. Existing-license restoration and daily verification remain covered. The factory must complete checkout registration before marketing new sales, but the required free offline station is fully usable.
