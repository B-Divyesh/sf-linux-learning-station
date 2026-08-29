# Linux Learning Station — review 2 handoff

- Work order: `linux-learning-station-review-2`
- Reviewed commit: `497e0f4927d61e73ae1d9ddfb2de0b11e3bf332f`
- Decision: **FAIL**

This was an independent read-only product review. No product code was changed.

The live product passed the cold mobile/desktop first-read, one-click demo, isolated-storage, privacy-request, route/metadata, 404, navigation/focus, visual-identity, and prior-finding checks. A clean clone at the reviewed commit passed `npm ci` and all 13 exact claim commands. Local `npm test` (4 unit + 24 Playwright), `npm run lint`, and `npm run build` passed.

Two findings remain in [review-2.md](review-2.md):

1. Terms promises that the PWA can be installed, but no `installable-pwa` claim/test exists.
2. The six demo activity cards visibly use generic **Start** buttons instead of naming the activity that will open.

To verify after repair:

```sh
npm ci
npm test
npm run lint
npm run build
```

Then run every `test` command in `.factory/claims.json` from a clean clone and perform a fresh 390 px `/demo` scan.
