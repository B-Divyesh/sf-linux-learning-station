# Linux Learning Station — independent verification 8 handoff

- Work order: `linux-learning-station-verify-8`
- Tested candidate: `457dcbaebb734ec7532b5ce3aa12835bdf256e75`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-30 UTC
- Result: **PASS — release accepted**

The complete evidence and severity assessment are in [verification-8.md](verification-8.md). No product code was changed.

## Verification summary

- Mandatory first-read gate passed at desktop and 390 px: the first screen plainly states the job, names parents/teachers of children aged 5–10, and offers one-click sample data.
- All 17 exact claim commands passed independently after `npm ci`; each claim has exactly one tagged test.
- `npm test` passed: 4/4 unit tests and 35/35 Playwright tests.
- `npm run lint`, `npm run build`, and `npm audit --omit=dev` passed.
- `npm run verify:live` and `/opt/fleet/lib/verify-url.sh` passed with no normal-load console/page errors.
- Six activities, three age ranges, invalid inputs, JSON import/export rejection, erase, print, demo isolation, paid fixture flow, keyboard use, 200% text, reduced motion, and recovery states passed.
- Core-use traffic stayed same-origin. The license request sent only its token. Live response security and caching headers matched policy.
- The product-specific verify endpoint allowed 30 requests; request 31 returned 429 with `Retry-After: 3`.
- PWA installability, live offline reload/activity save, and real waiting-worker update behavior passed.
- Fresh mobile Lighthouse scored 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO. LCP was 1.4 s, TBT 40 ms, CLS 0, and transfer 124 KiB.
- All 19 publicly served build files matched the local production build byte for byte.

## Run the verified gates

```sh
npm ci
npm test
npm run lint
npm run build
npm audit --omit=dev
npm run verify:live
```

Run each exact command in `.factory/claims.json` separately for the claim gate.

## Findings and known gaps

No release-blocking, high, medium, or low product defect was found. No real card payment or physical desktop installation was performed; checkout redirect/return behavior and Chromium installability were verified without those external side effects.
