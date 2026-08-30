# Linux Learning Station — review 4 handoff

- Work order: `linux-learning-station-review-4`
- Reviewed commit: `cfb948258b4c7b77dc14b080f18d5061d25a3292`
- Live URL: <https://linux-learning-station.sociobot.in>
- Reviewed: 2026-08-30 UTC
- Result: **FAIL**

No product code was changed. The requested review is in [`review-4.md`](review-4.md).

## What was verified

- Fresh 390 px and desktop live visits clearly stated the job, audience, and sample-data first action.
- The one-click demo opened populated sample data with its persistent banner, Reset demo, Start for real, isolated IndexedDB, and same-origin request log.
- Every one of the 17 declared claim commands was run separately after `npm ci`; all passed.
- `npm test` (4 unit / 32 Playwright), `npm run lint`, and `npm run build` passed. Build output includes `dist/index.html`.
- Valid routes, invalid 404s, metadata, back-button focus, internal links, offline behavior, and live request/console behavior were checked.

## Findings left

Three review-3 financial/legal findings regressed on the live Terms and Privacy pages: unlisted provider-role, refund-handler, and refund-revocation assertions (`F-3-4` through `F-3-6`). The review also records insufficient checkout amount/frequency proof (`F-4-1`) and two plain-language issues (`F-4-2`, `F-4-3`).

## Run again

```sh
npm ci
npm test
npm run lint
npm run build
```

Then run each exact `test` command in `.factory/claims.json` and repeat the live legal-page audit. No real payment was made.
