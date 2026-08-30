# Independent product verification 8 — PASS

- Work order: `linux-learning-station-verify-8`
- Candidate: `457dcbaebb734ec7532b5ce3aa12835bdf256e75`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-30 UTC
- Decision: **PASS — release accepted**

The candidate satisfies the researched brief and acceptance contract. All 17 declared claim tests pass after the clean dependency install, all repository gates pass, the smallest useful product works end to end, and every publicly deployed artifact matches the candidate build.

## Mandatory first-read and demo gate

I opened the live page in fresh Chromium contexts at desktop and 390 × 844 mobile sizes.

- What it does: **“Start offline learning activities.”** The same screen names patterns, typing, logic, spelling, numbers, and drawing.
- For whom: **“For parents and teachers setting up a shared computer for children aged 5–10.”**
- What to click first: **“Try it with sample data.”** Adjacent copy explains that it opens all six activities with ages 7–8 sample progress without saving to the real station.
- One click opened a populated board with a persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**.

Evidence: [desktop screenshot](verification-artifacts-8/verify-url/screenshot-desktop.png), [390 px screenshot](verification-artifacts-8/verify-url/screenshot-mobile.png), and [manual mobile flow](verification-artifacts-8/manual-mobile.png).

## Declared claims: PASS (17/17)

`.factory/claims.json` exists. Every ID occurs exactly once as a `@claim:<id>` Playwright test. After the required `npm ci`, I ran every manifest command separately in manifest order; every command rebuilt the production app and passed its selected test.

Evidence: [claim-results.txt](verification-artifacts-8/claim-results.txt).

| Claim | Result |
| --- | --- |
| `six-free-activities` | PASS, 1/1 |
| `core-session-shape` | PASS, 1/1 |
| `offline-reload` | PASS, 1/1 |
| `installable-pwa` | PASS, 1/1 |
| `demo-sandbox` | PASS, 1/1 |
| `local-only` | PASS, 1/1 |
| `json-export` | PASS, 1/1 |
| `erase-progress` | PASS, 1/1 |
| `printable-code` | PASS, 1/1 |
| `input-paths` | PASS, 1/1 |
| `update-notice` | PASS, 1/1 |
| `paid-bundle` | PASS, 1/1 |
| `license-local-storage` | PASS, 1/1 |
| `license-request-privacy` | PASS, 1/1 |
| `daily-license-check` | PASS, 1/1 |
| `age-ranges` | PASS, 1/1 |
| `checkout-purchase` | PASS, 1/1 |

The commands were also invoked once before dependencies existed, as required by the “before anything else” ordering; they could not start because `tsc` was not installed. This was a prerequisite/setup result, not a failed test assertion. `npm ci` is the repository's documented clean-clone prerequisite, and all 17 commands then executed and passed.

I cross-checked the landing page, Adult tools, Privacy, Terms, README, and copy audit against the manifest. All user-reliable product claims map to the declared tests; no unlisted claim was found.

## Clean checkout and repository gates

- Initial source tree: clean `main` at exactly `457dcbaebb734ec7532b5ce3aa12835bdf256e75`.
- `npm ci`: PASS — 61 packages installed, zero reported vulnerabilities.
- `npm test`: PASS — Vitest 4/4; production prebuild; Playwright 35/35.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm run build`: PASS; `dist/index.html` produced.
- `npm audit --omit=dev`: PASS; zero vulnerabilities.
- `npm run verify:live`: PASS; fresh demo, routing, mobile, offline, installability, privacy, licensing, and axe checks completed with no console or page errors.
- `/opt/fleet/lib/verify-url.sh`: PASS — HTTP 200, useful title, `lang=en`, one `<h1>`, `<main>`, complete alt handling, labelled buttons, and no runtime errors. Evidence: [verify.json](verification-artifacts-8/verify-url/verify.json).

## Functional and recovery testing

- Completed every free activity. The five guided activities end after three rounds; drawing ends after one saved session.
- Confirmed distinct age-appropriate prompts for ages 5–6, 7–8, and 9–10.
- Confirmed demo seeding, reset, exit, and storage isolation: a changed demo moved from two to three wins, leaving and reopening restored two wins, and real setup remained empty.
- Exported and re-imported valid JSON. Partial records, negative scores, mismatched scores, invalid ages, and malformed data were rejected with a visible error.
- Erased real progress and returned to setup; printable progress contained an anonymous code and no name/email field.
- Exercised keyboard and touch-style drawing, Back/Forward route recovery, round focus, dialog cancel/focus trapping, blocked IndexedDB recovery, and corrupt cached-license recovery.
- Manual invalid-input checks: empty typing was blocked with **“Please fill out this field.”**; `quiet keys ` was correctly rejected as an inexact answer; the result explained **“The answer is quiet keys.”** and focused **Next round**. A deliberately wrong pattern answer likewise produced the answer and recovery action.

## Privacy, payment boundary, headers, and links

- A fresh cold load and core demo flow generated only same-origin requests. No analytics, ads, chat, frames, external runtime scripts, or progress upload appeared.
- License restore sent one cookieless, bodyless `GET` containing only the URL-encoded license token. No age, answer, drawing, activity, or progress data was present.
- The live ₹499 link returned HTTP 303 to hosted `checkout.dodopayments.com`. The versioned fixture asserts INR 499.00, one-time billing, no recurring charge, and returned-license storage/verification. No real purchase was submitted.
- The product-specific verification endpoint allowed requests 1–30, then request 31 returned **429** with **`Retry-After: 3`**; subsequent requests remained 429. Observed allowance: **30 requests per client window**.
- Live HTML sends CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive Permissions Policy.
- HTML revalidates after 30 seconds; hashed assets are cached for one year as immutable; `sw.js` uses `no-cache`.
- All visible internal links returned their intended 200 response; designed unknown routes returned 404. Mail links were present and the product checkout boundary was verified separately.
- There is no product sign-in or product-owned backend. Entra authority, backend concurrency/SQLite persistence, health identity, and library/CLI installation checks are not applicable.

## Accessibility, mobile, and motion

- Fresh live axe scans and the full suite found zero serious or critical findings across landing, demo, activity, Adult tools, Privacy, Terms, offline fallback, and 404 states.
- Keyboard-only use starts at the skip link. Enter operates demo and activity actions, results move focus to the recovery action, dialogs trap and restore focus, and route changes focus the new heading.
- The focus indicator is a 3 px solid clay outline. Its contrast is 4.71:1 on the concrete background and 5.58:1 on raised surfaces.
- At 390 px, `scrollWidth` equals `clientWidth`; the smallest visible interactive target measured 44 px. Text at 200% remained contained.
- Under `prefers-reduced-motion: reduce`, the maximum measured transition and animation duration was `0.00001s`; no looping or flashing motion exists.

## PWA, offline, performance, and deployment parity

- Chromium reported a valid manifest and zero installability errors, including 192 px and 512 px icons, standalone display, scope, and versioned start URL.
- After service-worker control, the live demo reloaded fully offline, opened an activity, saved a result, and returned to the board.
- The update claim installed a real waiting worker, showed the in-app notice, activated it, reloaded under the new controller, replaced the prior cache, and exposed the new worker marker.
- Production sizes: JavaScript 35.71 KB raw / 12.45 KB gzip; CSS 18.98 KB raw / 5.00 KB gzip; hero 102.78 KB; no downloaded fonts. All are below the supplied budgets.
- Fresh mobile Lighthouse: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.4 s**, TBT **40 ms**, CLS **0**, total transfer **124 KiB**. Evidence: [lighthouse.json](verification-artifacts-8/lighthouse.json). Navigation-only Lighthouse does not report INP.
- SHA-256 comparison matched all 19 publicly served build files, including HTML, legal pages, manifest, worker, hashed JS/CSS, map, images, icons, robots, and sitemap. `staticwebapp.config.json` correctly returned 404 because the platform consumes it rather than serving it. The live product is the candidate build.

## Findings by severity

- Release-blocking: none.
- High: none.
- Medium: none.
- Low: none.

## Residual test limits

No real card charge was submitted. Installability was verified with Chromium's manifest/installability APIs rather than a physical Linux desktop installation. These are test limits, not observed defects.
