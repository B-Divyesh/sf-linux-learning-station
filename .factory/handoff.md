# Linux Learning Station — repair 5 handoff

- Work order: `linux-learning-station-repair-5`
- Independent verifier report: [`verification-6.md`](verification-6.md), report commit `50ce534356ba7f08886a90395497d736ca618e26`
- Verified candidate named by the report: `d5731b8be6f23ea1a7aef9b213cb5993808ff7d6`
- Repair commit: `6ab52914c51302bc8efad07bedbac45bae303a68`
- Product/version/deployment class: Linux Learning Station v1.2.4, static offline PWA
- Live URL: <https://linux-learning-station.sociobot.in>
- Checked: 2026-08-30 UTC
- Result: **PASS — verifier P1/P3 remain fixed, and the controller’s shared-browser failure is repaired.**

## Repairs

### Verifier P1 — ₹499 workshop checkout

The preceding repair registered the one-time Sociobot/Dodo product and exposed `Buy workshop bundle — ₹499` on the landing page and in Adult tools. The live audit repeated the complete identity boundary: the visible link is exactly `https://api.sociobot.in/api/v1/products/linux-learning-station/checkout`, and the endpoint returned HTTP `303` to hosted `checkout.dodopayments.com`. The recorded checkout claim tests a fixture return token, strips it from the address bar, verifies it, stores its local verdict, and unlocks the bundle without a charge.

### Verifier P3 — Back/Forward actionability flake

The existing no-smooth-scroll route repair remains effective. `npm run verify:live` now goes Back then Forward, confirms the new route heading has focus and `scroll-behavior: auto`, and immediately answers Pattern Quarry. It passed against production on this repair.

### Controller regression — a preceding test closed the shared browser before `@claim:paid-bundle`

Root cause: offline, reload, update, and license tests borrowed Playwright’s runner context. If a preceding lifecycle test closed the shared `Browser`, the next test failed before its first action with the exact error:

```
browser.newContext: Target page, context or browser has been closed
```

The failure was reproduced before the fix with a launched browser, a preceding context, `browser.close()`, and a subsequent `browser.newContext()` call.

The suite now uses [`withIsolatedPage`](../tests/e2e/station.spec.ts) for every offline, reload, and license scenario. It calls `browser.newContext()` for each test and closes only that disposable context in `finally`; no `browser.close()` exists in `tests/e2e`. This covers offline reload, installability, demo readiness/reset, service-worker update, IndexedDB retry, paid bundle, returned checkout token, storage, token-only request privacy, daily recheck, and corrupt-license recovery.

[`regression: closing a prior isolated reload context…`](../tests/e2e/station.spec.ts) closes a prior isolated reload context, asserts the runner browser remains connected, opens a new context, and restores a license. The following exact [`@claim:paid-bundle`](../tests/e2e/station.spec.ts) test completed five paid rounds and verified the detailed printable history. The full ordered suite reaches both tests and passes.

## Verification evidence

- Clean dependency install: `npm ci` — 61 packages installed; `npm audit --omit=dev` — 0 vulnerabilities.
- Type/lint: `npm run lint` — passed.
- Unit: `npm run test:unit` — 4/4 passed.
- Production build: `npm run build` — passed; `dist/index.html` produced. JS is 35.65 KB raw / 12.46 KB gzip; CSS is 18.98 KB raw / 5.00 KB gzip.
- Fresh production mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 150 ms, and CLS 0.
- Claim manifest audit: 17 claims, 17 unique `@claim:` tests. Every exact command in `.factory/claims.json` was run independently from production preview and passed.
- Full browser suite: `npx playwright test --reporter=list` — **32/32 passed in 35.0 s**, including the isolated-context regression followed by `@claim:paid-bundle`.
- Local HTML/accessibility smoke: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 …` — 200, title, `lang=en`, one h1, main landmark, no missing image alt text, no unnamed buttons, and no console errors. Playwright axe scans in the suite and live audit found 0 serious/critical violations.
- Desktop and 390×844 mobile production screenshots were visually reviewed. The first action, age choices, privacy facts, and ₹499 purchase action are visible with no horizontal overflow; keyboard focus, dialog focus trap, drawing keyboard/touch input, 200% text, and reduced motion are covered by browser tests.
- PWA/privacy: fresh-context offline reload saved a round, a real waiting worker update activated, manifest installability had no errors, demo data reset stayed isolated, and core-use requests were same-origin only. License restore sent a token-only GET to Sociobot; test fixtures made no spend.
- Live audit: `npm run verify:live` — passed with zero console errors, no external core requests, 44 px minimum target, zero installability errors, offline activity pass, complete session shape, live checkout 303, valid route/404 handling, and zero serious/critical axe findings. The refreshed raw report is [`repair-4-live/live-check.json`](repair-4-live/live-check.json).
- Live response policy: HTTPS root returned CSP including response-header `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- Deployment parity: fresh local and live SHA-256 values matched for `index.html`, `sw.js`, `manifest.webmanifest`, the station mark, icons, hero image, hashed JS, and hashed CSS.

## Known limits and next steps

No release-blocking product, accessibility, privacy, offline, payment, routing, or test-isolation issue is known. The paid-flow tests use recorded Sociobot responses and did not submit a card payment. The repair is pushed to `origin/main`; because it changes test infrastructure only, the static PWA build bytes are unchanged from the audited live deployment.
