# Independent product verification 5 — PASS

- Work order: `linux-learning-station-verify-5`
- Candidate commit: `ba626cd6f56f9b14b882a40a5ed64d1e2b90a53e`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-29 UTC
- Decision: **PASS — candidate accepted**

Product source was not changed. This report was produced from the clean candidate checkout after `npm ci`.

## Mandatory first checks

### Claims: PASS

`.factory/claims.json` exists and declares 14 observable claims. Every exact declared test command was run from the demo entry point after the clean install. All passed. A final `npm run test:e2e -- --grep @claim:` run executed all 14 together; Playwright's final status is `passed` with no failed tests.

The passing claim coverage is: `six-free-activities`, `offline-reload`, `installable-pwa`, `demo-sandbox`, `local-only`, `json-export`, `erase-progress`, `printable-code`, `input-paths`, `update-notice`, `paid-bundle`, `daily-license-check`, `age-ranges`, and `sales-paused`.

The claim tests use the production preview and demo data. They cover a fresh service-worker-controlled offline reload and save, a real waiting-worker update, isolated demo reset/exit, six free activity completion paths, import rejection for malformed and impossible scores, keyboard/touch drawing, age-specific tasks, and daily license-check caching.

### Cold first read: PASS

In a fresh live desktop context, the first screen says:

- **What it does:** “Start offline learning activities.”
- **For whom:** “For parents and teachers setting up a shared computer for children aged 5–10.”
- **What to click first:** “Try it with sample data,” followed by “Opens all six activities with ages 7–8 sample progress. Nothing is saved to your real station.”

The one-click action opens the seeded demo. Its persistent banner says “Demo — sample data, nothing is saved” and provides **Reset demo** and **Start for real**. This meets the plain-words and demo-sandbox release gates.

## Clean checkout quality gates: PASS

- `npm ci` — passed; 59 packages installed; audit reported 0 vulnerabilities.
- `npm run test:unit` — passed: 4/4 Vitest tests.
- `npm run lint` — passed: TypeScript `--noEmit`.
- `npm run build` — passed and produced `dist/`.
- `npm test` — passed: 4 Vitest tests and 25 Playwright tests. `test-results/.last-run.json` reports `{"status":"passed","failedTests":[]}`.
- `npm audit --omit=dev` — passed with 0 vulnerabilities.

The exact production output is 35.10 KB JavaScript (12.32 KB gzip) and 18.95 KB CSS (4.99 KB gzip), within the static PWA budgets.

## Independent live verification: PASS

### Candidate parity and delivery

SHA-256 comparisons show that local `dist/index.html`, `sw.js`, `manifest.webmanifest`, hashed JS, hashed CSS, station SVG, icon, and hero image exactly match their live responses. This deployment is the candidate, not a stale build.

The checked routes all return 200: landing, `/demo`, all six demo activity deep links, real activity deep link, Privacy, Terms, manifest, robots, and sitemap. A nonexistent route returns the designed HTTP 404.

Response headers provide CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive Permissions Policy. Hashed JS/CSS use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`; HTML and manifest revalidate at 30 seconds.

### End-to-end, errors, and recovery

At desktop and 390 px mobile, all six demo activities opened on their `/demo/activity/*` route while retaining the demo banner. The independent flow exercised normal answers/entries and drawing save in each activity. The local suite confirms their complete free paths. Invalid typing with a trailing space returns “A useful try”; an empty required typing field has native invalid state and “Please fill out this field.”

The live demo has six slabs at 390 px, no horizontal overflow, and no visible link or button below 44 px. First keyboard Tab reaches the visible “Skip to activities” link with a 3 px clay outline and lichen halo. Under reduced motion, activity-slab transition duration is `0.00001s` and transform is `none`.

`/opt/fleet/lib/verify-url.sh` passed against the live site: HTTP 200, title, `lang="en"`, one h1, main landmark, complete image alt handling, labeled buttons, and no console/page errors. Its saved output is in `verification-artifacts-5/verify-url/`.

Fresh axe scans of landing, demo, a demo activity, Privacy, and Terms each found zero serious or critical violations. `npm run verify:live` independently passed its live metadata, mobile action, demo isolation, installability, offline, request, and axe checks.

### Privacy, PWA, and allowance

During a live demo flow, observed document, asset, module, stylesheet, and runtime requests all stayed on `https://linux-learning-station.sociobot.in`. There were no analytics, advertisements, chat, iframes, third-party scripts, external fonts, console errors, or child-progress network requests.

In a new live browser context, after service-worker control, setting the context offline and reloading `/demo` kept the demo banner and “Choose an activity,” showed “Offline,” and completed Pattern Quarry with “Good noticing!” without errors. Chromium reports no manifest or installability errors; the manifest uses standalone display, valid 192/512 icons, and a versioned start URL. The local `update-notice` claim additionally passes the waiting-worker/controller-change/cache-replacement path.

The only server-side product surface exercised is Sociobot license verification. From one client, invalid-license requests 1–30 returned 200; requests 31–35 returned **429** with `Retry-After: 3`. Observed allowance: **30 verification requests per client window**. There is no product sign-in, backend persistence/concurrency surface, CLI, or library package, so Entra, backend health, and consumer-install checks do not apply.

## Defects by severity

No critical, high, medium, or low release-blocking defects found.

The optional ₹499 bundle correctly says that new licenses are not for sale and exposes no broken checkout. Existing-license verification remains tested; factory checkout registration is operational work to complete before reopening sales, not a defect in the free offline product.
