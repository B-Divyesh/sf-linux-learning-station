# Independent product verification 7 — PASS

- Work order: `linux-learning-station-verify-7`
- Candidate: `1b06d3446bf65863337444a4c20bc77f2fb2f82d`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-30 UTC
- Decision: **PASS — release accepted**

The candidate satisfies the researched brief and supplied acceptance contract. The mandatory cold-read/demo gate passes, all 17 declared claim commands pass from the clean installed clone, the full repository gates pass, and the live deployment matches the candidate build. Fresh testing found no release-blocking, high, medium, or low product defect.

## Mandatory gates

### Cold first-read and one-click demo: PASS

I opened the live root in a new 390 × 844 Chromium context with empty storage.

- What it does: **“Start offline learning activities.”** The first screen also names patterns, typing, logic, spelling, numbers, and drawing.
- For whom: **“For parents and teachers setting up a shared computer for children aged 5–10.”**
- What to click first: **“Try it with sample data.”** Adjacent copy says it opens all six activities with ages 7–8 sample progress and does not save to the real station.
- One click opened an already-populated activity board with a persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**.

Evidence: [`first-read-live-mobile.png`](first-read-live-mobile.png), [`screenshot-desktop.png`](verification-artifacts-7/verify-url/screenshot-desktop.png), and [`screenshot-mobile.png`](verification-artifacts-7/verify-url/screenshot-mobile.png).

### Declared claims: PASS (17/17)

`.factory/claims.json` exists. Each ID occurs exactly once as a `@claim:<id>` Playwright test. I ran every manifest `test` value separately, in manifest order, after `npm ci`; every command rebuilt the production app and its one selected test passed.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `six-free-activities` | `npm run test:e2e -- --grep @claim:six-free-activities` | PASS, 1/1 |
| `core-session-shape` | `npm run test:e2e -- --grep @claim:core-session-shape` | PASS, 1/1 |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS, 1/1 |
| `installable-pwa` | `npm run test:e2e -- --grep @claim:installable-pwa` | PASS, 1/1 |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | PASS, 1/1 |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS, 1/1 |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS, 1/1 |
| `erase-progress` | `npm run test:e2e -- --grep @claim:erase-progress` | PASS, 1/1 |
| `printable-code` | `npm run test:e2e -- --grep @claim:printable-code` | PASS, 1/1 |
| `input-paths` | `npm run test:e2e -- --grep @claim:input-paths` | PASS, 1/1 |
| `update-notice` | `npm run test:e2e -- --grep @claim:update-notice` | PASS, 1/1 |
| `paid-bundle` | `npm run test:e2e -- --grep @claim:paid-bundle` | PASS, 1/1 |
| `license-local-storage` | `npm run test:e2e -- --grep @claim:license-local-storage` | PASS, 1/1 |
| `license-request-privacy` | `npm run test:e2e -- --grep @claim:license-request-privacy` | PASS, 1/1 |
| `daily-license-check` | `npm run test:e2e -- --grep @claim:daily-license-check` | PASS, 1/1 |
| `age-ranges` | `npm run test:e2e -- --grep @claim:age-ranges` | PASS, 1/1 |
| `checkout-purchase` | `npm run test:e2e -- --grep @claim:checkout-purchase` | PASS, 1/1 |

I cross-checked the landing page, Adult tools, Privacy, Terms, README, and `.factory/copy-audit.md` against the manifest. The observable claims are represented by the 17 entries; no unlisted release claim was found.

## Clean repository and production build

- Initial checkout: clean `main`, exactly `1b06d3446bf65863337444a4c20bc77f2fb2f82d`.
- `npm ci`: PASS; 61 packages installed; zero reported vulnerabilities.
- `npm test`: PASS — Vitest 4/4, production prebuild, Playwright 32/32.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm run build`: PASS; `dist/index.html` produced.
- `npm audit --omit=dev`: PASS; zero vulnerabilities.
- `npm run verify:live`: PASS; checkout, demo isolation, routes, installability, offline activity, session shape, privacy log, and axe checks passed.
- Production bundle: JavaScript 35.65 KB raw / 12.46 KB gzip; CSS 18.98 KB raw / 5.00 KB gzip; no downloaded font payload.

## Functional and recovery evidence

The full suite covers every activity and both free and paid session shapes. It completes the five guided activities, saves a drawing, tests ages 5–6/7–8/9–10, verifies demo reset/isolation, exports and imports JSON, rejects partial and negative-score files, erases real progress, prints an anonymous code, uses keyboard and touch-style drawing, restores a fixture license, and handles a returned checkout license.

I additionally exercised the smallest useful live flow in a new mobile context using the keyboard:

1. Tab reached the skip link first, then the wordmark, Demo, Privacy, and the sample-data action.
2. Enter opened the seeded demo; Enter opened Pattern Quarry.
3. A deliberately wrong first answer produced **“A useful try.”**
4. **Next round** moved focus to the new round content.
5. Correct recovery on rounds two and three ended at **“22 points saved.”**
6. Empty Key Trail input was blocked with the native **“Please fill out this field.”** message; a trailing-space answer was rejected rather than silently trimmed.

The full suite also verifies blocked-IndexedDB recovery, corrupt cached-license recovery, dialog cancel, focus trapping, Back/Forward activity stability, route titles, and a real waiting-service-worker replacement.

## Privacy, headers, links, and server allowance

- A fresh cold load and complete core demo flow generated only same-origin product requests. There were no analytics, ads, chat, frames, third-party runtime scripts, child-progress uploads, console errors, or page errors.
- The optional restore test captures one token-only `GET` to Sociobot with no request body, cookies, age range, answers, drawing, or progress.
- Live HTML carries CSP with response-header `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive Permissions Policy.
- Hashed JavaScript returns `Cache-Control: public, max-age=31536000, immutable`; `sw.js` returns `Cache-Control: no-cache`; HTML revalidates after 30 seconds.
- The visible ₹499 buy link freshly returned HTTP 303 to hosted `checkout.dodopayments.com`.
- Fresh rate-limit probe of `GET /api/v1/products/linux-learning-station/verify`: requests 1–30 returned 200; request 31 returned **429** with **`Retry-After: 3`**. Requests 32–36 remained 429. Observed allowance: **30 verification requests per client window**.
- There is no product sign-in or product-owned backend. Entra authority, backend concurrency/persistence, health identity, and library/CLI consumer-install checks are not applicable.

## Accessibility, mobile, and motion

- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, useful title, `lang=en`, one `<h1>`, `<main>`, complete image alt handling, labelled buttons, and zero console/page errors. Evidence: [`verify.json`](verification-artifacts-7/verify-url/verify.json).
- Fresh axe scans and the full suite found zero serious or critical findings on landing, demo, activities, Adult tools, Privacy, Terms, and designed 404 states.
- At 390 px, `scrollWidth` equalled `clientWidth` and the smallest visible control was 44 px.
- The first keyboard focus is the skip link with a 3 px visible clay outline. Dialog focus wraps correctly and round changes retain a useful focus target.
- Under `prefers-reduced-motion: reduce`, tested transition and animation durations were `0.00001s`; there is no looping or flashing motion.
- Desktop and 390 px screenshots were visually inspected. Content remains legible and ordered, and the primary action, price, privacy facts, footer, and activity choices remain usable.

## PWA, offline, update, performance, and deployment parity

- Chromium reports a valid manifest and zero installability errors, including 192 px and 512 px icons and `display: standalone`.
- After worker control, the live `/demo` reloads fully offline and completes/saves an activity.
- The claim and full suites install a real newer worker, observe it waiting, show the update notice, activate it, reload under the new controller, replace the prior cache, and verify the new marker.
- Fresh mobile Lighthouse: Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.0 s**, LCP **1.4 s**, TBT **150 ms**, CLS **0**, total transfer **124 KiB**. Navigation-only Lighthouse does not report INP. Evidence: [`lighthouse.json`](verification-artifacts-7/lighthouse.json).
- SHA-256 comparisons matched live and local `dist/` bytes for `index.html`, `sw.js`, manifest, hashed JS/CSS, hero, station mark, both icons, social card, 404, offline page, legal pages, robots, and sitemap. The live deployment is the candidate, not a stale build.

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Residual limits

The checkout boundary was verified through the live 303 redirect and recorded return-license fixtures; no real card charge was submitted. Installability was checked through Chromium's manifest/installability APIs rather than installing to a physical Linux desktop. These are test limits, not observed product defects.
