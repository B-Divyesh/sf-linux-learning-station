# Linux Learning Station — polish 4 handoff

- Work order: `linux-learning-station-polish-4-retry1`
- Reviewed candidate: `cfb948258b4c7b77dc14b080f18d5061d25a3292`
- Review report: `95d386361011822906f7e4aebdcef31bc5ba3990`
- Product repair commits: `aa46b32`, `c647902`, `8ca16ad`, `7a062c4`
- Product version: `v1.2.5`
- Final deployment: `0ed1b7fe-0c85-405d-91be-2a0d51854835`
- Live URL: <https://linux-learning-station.sociobot.in>
- Result: **PASS — no review finding remains open**

## What changed

- Removed all unproved provider-role, refund-handler, and refund-revocation statements from Privacy and Terms.
- Rebuilt the checkout claim around a versioned recorded offer fixture tied to the production product slug and endpoint. The test now proves ₹499, one-time billing, no recurring charge, request privacy, and the returned-license unlock.
- Changed the visible header action to **Open adult tools**.
- Split the dense README deployment paragraph into short task-naming instructions.
- Added explicit `1 win` / `2 wins` regression coverage.
- Made the activity footer’s Adult tools action open a real panel and printable sheet, with focus returning after close.
- Kept every offline, reload, update, and license assertion inside a disposable `browser.newContext()` owned by the Playwright fixture. The tests never launch or close the fixture browser.
- Added a final teardown regression that closes a reloaded context, opens a fresh license-restore context, and proves the shared browser remains connected.
- Rebuilt the offline fallback with the shared product shell and external stylesheet, eliminating its inline-style CSP violation.
- Updated the catalog line to a 116-character, verb-first description.
- Preserved the brutalist concrete-and-moss identity and original documented hero asset.

The complete finding map is in [polish-4.md](polish-4.md).

## Exact verification evidence

Retry clean clone: `/tmp/linux-learning-station-clean.sSsBFH` at `7a062c4384d767da4f41bfc20e73ca93a539656d`.

- `npm ci`: passed; 61 packages installed; zero reported vulnerabilities.
- Every `test` command in `.factory/claims.json`: passed independently, 17/17.
- Claim cross-check: every manifest ID has exactly one `@claim:<id>` test.
- `npm test`: passed; 4 Vitest tests and 34 Playwright tests.
- `@claim:update-notice`: passed in the fixture-owned disposable context; no standalone browser was created or closed.
- Isolated-teardown regression: passed after closing a reloaded context and opening a fresh license-restore context; `browser.isConnected()` stayed `true` before and after the second teardown.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/index.html` present.
- `npm audit --omit=dev`: passed with zero vulnerabilities.
- Build sizes: JavaScript 35.70 KB raw / 12.46 KB gzip; CSS 18.98 KB raw / 5.00 KB gzip.
- Local browser audit: zero console errors and zero serious/critical axe findings across landing, demo, Privacy, Terms, offline fallback, and designed 404 states.
- Local 390 px check: first-screen facts end at 769.64 px; 200% text has `scrollWidth = clientWidth = 390px`.
- Offline check: after worker control and disconnection, `/demo` reloaded and saved a Pattern Quarry result.
- Demo isolation: one-click `?demo=1`, persistent banner, two-win seed, reset/exit restoration, empty real records, and separate `linux-learning-station-demo` records.

Local artifacts:

- [Browser report](polish-4-local/browser-check.json)
- [Cold mobile screenshot](polish-4-local/cold-mobile.png)
- [Demo mobile screenshot](polish-4-local/demo-mobile.png)
- [200% text screenshot](polish-4-local/demo-200-percent.png)
- [Baseline verifier](polish-4-local/verify/verify.json)
- [Lighthouse report](polish-4-local/lighthouse.json)

## Live verification after deployment

- The deployment completed successfully and the custom domain returned HTTPS 200.
- Fresh mobile contexts rechecked the first screen, one-click demo, banner/reset/exit, six activities, 200% text, deep-link focus, singular/plural copy, and the activity Adult tools panel.
- Privacy and Terms contain no Dodo, merchant-of-record, refund-handler, or refund-revocation statement.
- The checkout action shows ₹499 once. The versioned fixture proves INR 499.00 and one-time billing. The production endpoint returned HTTP 303 to hosted checkout.
- All 18 valid application/legal/offline routes returned 200. Invalid real/demo activity slugs and an unknown route returned the designed HTTP 404.
- Titles, descriptions, canonicals, Open Graph/Twitter fields, one h1, main landmark, legal links, route focus, and sitemap inventory passed.
- Core demo traffic stayed same-origin. License restoration sent one bodyless, cookieless, token-only request.
- Chromium reported zero manifest or installability errors. The controlled offline activity and full session-shape checks passed.
- Security headers include CSP with response-header `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer Policy, and Permissions Policy.
- SHA-256 parity matched 17/17 checked deployed files to local `dist/`.
- Live Lighthouse: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.4 s**, TBT **0 ms**, CLS **0**, total transfer **120 KiB**.
- `/opt/fleet/lib/verify-url.sh` passed with the expected title, `lang=en`, one h1, main, complete alt handling, labelled buttons, and no console errors.

Live artifacts:

- [Full live browser report](polish-4-live/live-check.json)
- [HTTP, headers, routes, claims, catalog, and parity report](polish-4-live/http-check.json)
- [Cold live mobile screenshot](polish-4-live/live-cold-mobile.png)
- [Live demo mobile screenshot](polish-4-live/live-demo-mobile.png)
- [Live demo at 200% text](polish-4-live/live-demo-200-percent.png)
- [Baseline verifier](polish-4-live/verify/verify.json)
- [Lighthouse report](polish-4-live/lighthouse.json)

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run preview
```

Run any claim exactly as listed in `.factory/claims.json`. Run the deployed sweep with `npm run verify:live`.

## Known gaps and next steps

No product or review defect is open. No real card was charged during verification; the checkout boundary uses the versioned recorded offer and returned-license fixture, plus a live production redirect check. Routine next steps are dependency maintenance and monitoring the external checkout endpoint.
