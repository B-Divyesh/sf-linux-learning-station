# Linux Learning Station — polish 1 handoff

- Work order: `linux-learning-station-polish-1`
- Base: `59bf91f83ba65f6149830b5f5ded547b24066066`
- Repair commit: recorded after final commit
- Product: <https://linux-learning-station.sociobot.in>

## Delivered

Every `F-1-1` through `F-1-26` finding in `.factory/review-1.md` is repaired and mapped in `.factory/polish-1.md`. The PWA retains its concrete-and-moss visual system and static deployment class. The landing uses a direct `/?demo=1` isolated sample route with a persistent reset/exit banner. Exiting resets all changed sample progress before real mode. Real activity deep links survive first-run setup; route titles and social metadata update correctly; legal and 404 pages now share the site skeleton and complete metadata.

Claims are in `.factory/claims.json` and have observable Playwright coverage. The six-activity, offline, demo isolation, service-worker update, valid-license, age-range, and paused-sales checks now assert the outcome rather than the presence of controls.

## Verification

- `npm run lint` — pass
- `npm run build` — pass; `dist/` produced. Initial JS: 35.11 KB raw / 12.33 KB gzip; CSS: 18.84 KB raw / 4.98 KB gzip.
- `npm run test:unit` — pass (4 tests).
- Focused browser routes/accessibility run — pass (5 tests): deep link and metadata, direct demo status, keyboard/mobile regressions, axe sweep (cold/demo/activity/adult/legal), and title/focus regressions.
- Every exact claim command in `.factory/claims.json` was run independently after the final build and passed. These include offline completion after reload, all six activity completions, demo exit/reset, real update activation/controller/cache marker, valid license verification, and local-only request capture.
- Screenshots: `.factory/polish-1-mobile.png` (390 px first screen) and `.factory/polish-1-demo.png` (isolated sample board).
- The supplied `verify-url.sh` was not present in this repository or worker image. Its title/lang/main/alt/console checks are covered by the Playwright accessibility sweep; no console errors were observed in its browser flows.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Publish `dist/` as the static site root using the work order’s static deployment configuration. `staticwebapp.config.json` is emitted into `dist/`.

## Known gaps

None in the reviewed acceptance scope. No AI feature was added because it would undermine the product’s offline, account-free learning task.
