# Independent product verification 6 — FAIL

- Work order: `linux-learning-station-verify-6`
- Candidate commit: `d5731b8be6f23ea1a7aef9b213cb5993808ff7d6`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-30 UTC
- Decision: **FAIL — paid-unlock acceptance contract is incomplete**

Product source was not changed. This report was made from a clean worktree at the stated commit, followed by `npm ci`.

## Mandatory first checks

### Claim suite: PASS

`.factory/claims.json` exists and lists 17 claims. Every exact command declared in it ran sequentially through the production-preview demo entry point. The runner completed all commands with final Playwright status `{"status":"passed","failedTests":[]}`.

Passed claims: `six-free-activities`, `core-session-shape`, `offline-reload`, `installable-pwa`, `demo-sandbox`, `local-only`, `json-export`, `erase-progress`, `printable-code`, `input-paths`, `update-notice`, `paid-bundle`, `license-local-storage`, `license-request-privacy`, `daily-license-check`, `age-ranges`, and `sales-paused`.

### Cold first read: PASS

In a fresh 390 px live browser context, the first screen plainly says:

- What it does: “Start offline learning activities.”
- For whom: “For parents and teachers setting up a shared computer for children aged 5–10.”
- What to click first: **Try it with sample data**; its adjacent text explains that it opens all six activities with ages 7–8 sample progress and does not save to the real station.

The action opened the isolated demo in one click. Its visible banner states “Demo — sample data, nothing is saved” and contains **Reset demo** and **Start for real**.

## Clean-checkout quality gates: PASS

- `npm ci` — passed; 61 packages installed, 0 audit vulnerabilities.
- `npm run test:unit` — passed: 4/4 Vitest tests.
- `npm run lint` — passed: TypeScript `--noEmit`.
- `npm run build` — passed and produced `dist/`.
- `npm test` — passed: 4 unit tests and 30 Playwright tests; final status had no failed tests.
- `npm audit --omit=dev` — passed: 0 vulnerabilities.

Production output is 35.21 KB JavaScript (12.35 KB gzip) and 18.98 KB CSS (4.99 KB gzip), well inside the static-PWA budgets.

## Live deployment: PASS except the paid-unlock finding below

- Candidate parity: SHA-256 hashes of live hashed JS, CSS, hero image, and `sw.js` exactly equal this candidate's fresh `dist/` files.
- Privacy: cold-load and complete-demo request logs contained only `https://linux-learning-station.sociobot.in` document/assets. No analytics, ads, chat, iframe, third-party runtime script, or child-progress request was observed. The optional license path is separately limited to a token-only Sociobot request.
- Headers: HTML carries CSP with response-header `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and Permissions Policy. Hashed JS uses `public, max-age=31536000, immutable`; `sw.js` uses `no-cache`.
- PWA: fresh Chromium manifest and installability checks had zero errors. After worker control, `/demo` reloaded offline, showed **Offline**, and completed Pattern Quarry using the pointer path.
- Accessibility: `/opt/fleet/lib/verify-url.sh` passed (title, `lang=en`, one `h1`, `main`, alt coverage, labelled buttons, no console/page errors). Fresh axe scans of `/`, `/demo`, `/demo/activity/drawing`, `/privacy/`, and `/terms/` found zero serious or critical violations. The live demo has 44 px minimum targets, no horizontal overflow at 390 px, and the bundled reduced-motion rules are active.
- Representative flows: all six activity completion paths, guided three-round sessions, drawing, malformed/negative JSON rejection and recovery, erase, anonymous print code, age ranges, keyboard/touch drawing, demo isolation, worker update, and invalid-route 404 behaviour passed in the full suite.
- Server allowance: one client sent unique invalid tokens to `https://api.sociobot.in/api/v1/products/linux-learning-station/verify`. Requests 1–30 returned 200; requests 31–32 returned **429** with **`Retry-After: 1`**. Observed allowance: **30 verification requests per client window**.

## Defects by severity

### P1 — New ₹499 workshop licenses cannot be bought

The researched brief says schools and families can buy an offline bundle one time. The paid-unlock contract requires a Sociobot checkout link for a paid tier. The deployed landing page, Adult tools, README, and Terms instead say **“New licenses are not for sale now”** and expose no checkout or purchase action; source inspection confirms only `/verify` is used, not the required `/checkout` path.

The `sales-paused` claim passes because it tests this absence, but that does not satisfy the brief's one-time purchase requirement. Existing-token restoration is not a substitute for a purchase path. Register the product with the Sociobot billing engine and expose the hosted checkout link (with return-token capture and restore retained), or remove the paid bundle and its ₹499 promise from the scoped product/brief. Until then the candidate cannot be accepted as the requested monetized product.

### P3 — `npm run verify:live` is flaky on the deployed page

Fresh execution failed at `scripts/verify-live.mjs:114`: Playwright timed out waiting for the Pattern Quarry answer button to become stable immediately after browser Back/Forward and heading focus. Evidence is in `verification-artifacts-6/live-verifier.log`. A repeat interaction that waits for the smooth route scroll to settle succeeds, as do the product's regular and claim suites, so this did not show a user-facing activity failure. Stabilize the script (or avoid smooth scrolling for programmatic route-focus changes) before relying on this command as release evidence.

## Evidence

- `verification-artifacts-6/verify-url/verify.json`
- `verification-artifacts-6/live-verifier.log`
- Fresh deployment byte comparisons and request/header probes were performed during this verification.
