# Linux Learning Station — polish 2 handoff

- Work order: `linux-learning-station-polish-2`
- Status: complete; no review finding remains open
- Deployed product commit: `209248e`
- Clean-clone verification commit: `25b34094436ead96fd595c1bb945299c9748a1aa`
- Deployment ID: `d325d87e-cbec-42cb-86df-743efcf912d7`
- Live URL: <https://linux-learning-station.sociobot.in>
- Version: `v1.2.2`

## What changed

- Added the missing `installable-pwa` claim and a fresh-context Chromium test that checks service-worker control, manifest validity, standalone display, 192/512 icons, and zero installability errors.
- Replaced all six generic visible Start labels with “Start Pattern Quarry,” “Start Key Trail,” “Start Logic Bridges,” “Start Word Workshop,” “Start Number Stones,” and “Start Moss Sketchbook.”
- Reworded the Terms installation sentence in plain language and kept it covered by the new claim.
- Added accessible names to the legal and 404 wordmark links after the cold mobile audit exposed their hidden-text state.
- Extended the browser accessibility regression to scan Privacy and Terms at 390×844.
- Preserved the established concrete/moss workbench visual system, offline PWA architecture, isolated demo storage, real routing, and static deployment class.
- Updated the catalog line to a 103-character verb-first description and expanded the copy audit.

The complete F-1-1 through F-1-26 and F-2-1 through F-2-2 mapping is in [polish-2.md](polish-2.md).

## Verification

A clean clone at `25b34094436ead96fd595c1bb945299c9748a1aa` was created with no `node_modules` or `dist`. The following all passed:

```sh
npm ci
# Every exact `test` command in .factory/claims.json (14/14)
npm test
npm run lint
npm run build
npm audit --omit=dev
```

Results:

- 14 claim tests passed independently, each through its declared command and production build.
- `npm test`: 4 Vitest unit tests and 25 Playwright browser tests passed.
- The browser suite covers activity completion, demo isolation/reset/exit, offline reload and save, a real waiting-worker update, installability, local-only requests, import/export validation, erasure, printing, keyboard/touch drawing, paid-license verification, daily checks, age ranges, paused sales, deep links, metadata, focus, recovery, mobile targets, and axe scans.
- `npm run lint`: TypeScript passed with no errors.
- `npm run build`: `dist/` produced; JS 35.10 KB raw / 12.32 KB gzip and CSS 18.95 KB raw / 4.99 KB gzip.
- `npm audit --omit=dev`: zero vulnerabilities.

## Live evidence

After deployment, `npm run verify:live` opened new browser contexts and proved:

- the 390×844 first screen identifies the job, audience, first action, and all four facts without scrolling;
- one click reaches `/?demo=1` with the persistent banner, Reset demo, Start for real, two seeded wins, and all six named actions;
- demo progress changes from two to three wins, then Start for real discards it and re-entry restores two wins;
- all tested requests stay on the product origin and normal routes produce no console or page errors;
- real `/activity/patterns` survives first-run age selection; demo routing, back/forward focus, route titles, and canonicals are correct;
- unknown routes return the designed HTTP 404 with legal links;
- the live manifest has zero Chromium installability errors;
- a fresh controlled context reloads offline and completes/saves Pattern Quarry;
- all visible mobile links/buttons are at least 44 px and there is no horizontal overflow;
- axe reports zero serious or critical findings on landing, demo, Privacy, Terms, and 404.

Artifacts:

- [Live audit JSON](polish-2-live/live-check.json)
- [Cold mobile screenshot](polish-2-live/live-cold-mobile.png)
- [Live demo screenshot](polish-2-live/live-demo-mobile.png)
- [Baseline verifier result](polish-2-live/verify.json)
- [Lighthouse report](polish-2-live/lighthouse.json)

The required URL verifier passed with title, English language, one h1, main landmark, complete image alt handling, labeled buttons, and zero console errors. Lighthouse mobile scored Performance 100, Accessibility 100, Best Practices 100, and SEO 100; FCP was 0.9 s, LCP 1.4 s, TBT 20 ms, and CLS 0. Deployed hashes for HTML, worker, manifest, JS, and CSS match local `dist/`.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

Publish `dist/` as the static site root. For a repeatable production smoke test, run `npm run verify:live` or set `VERIFY_URL` to another deployment.

## Known gaps and next steps

No product, review, accessibility, privacy, offline, build, or deployment gap remains. New workshop licenses intentionally remain unavailable; the UI states this directly and the `sales-paused` claim verifies that no broken checkout is exposed.
