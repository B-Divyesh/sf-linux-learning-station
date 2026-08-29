# Polish 2 — cumulative adversarial repair map

- Work order: `linux-learning-station-polish-2`
- Reviewed release candidate: `89a68a5ee7a85e2d875391d48ef6d564066da0fa`
- Product repair commits: `2d07f5e2dd158ce60a0691854cf2ec173ea5819f`, `209248e`
- Live URL: <https://linux-learning-station.sociobot.in>
- Final deployment: `d325d87e-cbec-42cb-86df-743efcf912d7`
- Result: every review-1 and review-2 finding is resolved.

Local screenshots: [first screen](polish-2-mobile.png) and [demo board](polish-2-demo.png). Cold deployed screenshots: [first screen](polish-2-live/live-cold-mobile.png) and [demo board](polish-2-live/live-demo-mobile.png). The repeatable live audit and raw result are in `scripts/verify-live.mjs` and `polish-2-live/live-check.json`.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The six-free test opens and completes every activity without a license gate. It now also asserts each visible action name. | `@claim:six-free-activities`; live demo screenshot. |
| F-1-2 | The promise says “after the first visit.” The test reloads offline, completes Pattern Quarry, and saves its result. | `@claim:offline-reload`; live audit `offlineActivity: passed`. |
| F-1-3 | The update test installs a real waiting worker, applies it, observes controller change/reload, and confirms cache replacement. | `@claim:update-notice`. |
| F-1-4 | Start for real discards changed demo storage and never copies it to real storage. | `@claim:demo-sandbox`; live audit `2 wins → 3 wins → exit → 2 wins`. |
| F-1-5 | Real and demo deep links retain their requested activity; titles, descriptions, canonicals, OG/Twitter metadata, legal shells, focus, and 404 remain route-specific. | `real activity deep links…`; live checks of `/activity/patterns`, `/demo/activity/patterns`, `/terms/`, `/privacy/`, and a 404. |
| F-1-6 | Copy distinguishes five guided three-round activities from the open drawing session. | `@claim:six-free-activities`; first-screen screenshot. |
| F-1-7 | Installability is now an explicit tested claim rather than an unsupported statement. | `@claim:installable-pwa`; live Chromium reports zero manifest/installability errors. |
| F-1-8 | “Age range” is used consistently and each range opens distinct Number Stones content. | `@claim:age-ranges`; copy audit. |
| F-1-9 | Copy states only the durable condition that new licenses are not for sale and exposes no checkout action. | `@claim:sales-paused`; live page check. |
| F-1-10 | A stored token with no cached verdict receives a valid mocked Sociobot response and enables five rounds plus detailed print. | `@claim:paid-bundle`. |
| F-1-11 | The untested credential assertion remains removed from README. No equivalent marketing claim was added. | README/source review; claims cross-check. |
| F-1-12 | Status begins as Online and changes to Ready offline only under an active controlling worker. | `demo entry and offline status…`; live cold check. |
| F-1-13 | Privacy, offline, free-count, and price facts appear before the age picker and fit within the 390×844 first screen. | `polish-2-live/live-cold-mobile.png`; live fact bounding-box assertion. |
| F-1-14 | Board and completion copy consistently says activity, not trail. | `@claim:six-free-activities`; live demo screenshot. |
| F-1-15 | The section heading is the self-contained “How it works.” | First-screen screenshot; copy audit. |
| F-1-16 | The price heading is “Optional activity bundle — ₹499 once.” | First-screen screenshot; copy audit. |
| F-1-17 | Setup actions say “Start activities for ages …” and state that the board opens. | `@claim:age-ranges`; first-screen screenshot. |
| F-1-18 | App, print sheet, Privacy, and README use “age range.” | Copy audit and source review. |
| F-1-19 | README says the controls are grouped under Adult tools; it makes no access-control promise. | README review. |
| F-1-20 | The sample action says exactly which activities and sample progress open. | First-screen screenshot; `@claim:demo-sandbox`. |
| F-1-21 | README describes browser-local progress, printing, and export outcomes before file/storage details. | README review; export and print claim tests. |
| F-1-22 | README describes offline pages and in-app updates in user terms. | README review; offline/update claim tests. |
| F-1-23 | README says “code loaded from other sites” rather than runtime-script jargon. | `@claim:local-only`; live same-origin request log. |
| F-1-24 | README explains that sample progress cannot read or change real progress. | `@claim:demo-sandbox`; live isolation check. |
| F-1-25 | README uses “separate demo storage”; implementation detail stays in `demo.md`. | README and demo documentation review. |
| F-1-26 | Saved progress uses singular “1 win” and plural “2 wins.” | `@claim:six-free-activities` regression path. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Added `installable-pwa` to `claims.json`. Its fresh-context CDP test proves a valid manifest, standalone display, required icons, service-worker control, and zero Chromium installability errors. Terms now says “install the station,” not “install the PWA.” | `@claim:installable-pwa` passed alone from the clean clone and on live. |
| F-2-2 | Every slab visibly says “Start” plus its activity name; the arrow remains decorative. The label is the accessible name and fits the original slab layout. | `@claim:six-free-activities`; `polish-2-live/live-demo-mobile.png`; live labels are six 318×48 px actions with no overflow. |

## Additional cold-check repair

The live 390 px axe pass found that legal/404 CSS hides wordmark text on phones while the logo has empty alt text. Privacy, Terms, and 404 wordmark links now have `aria-label="Linux Learning Station home"`. The browser regression scans the legal pages at 390 px. The redeployed live axe sweep reports zero serious or critical findings on `/`, `/?demo=1`, `/terms/`, `/privacy/`, and the designed 404.

## Final evidence

- Clean clone `25b34094436ead96fd595c1bb945299c9748a1aa`: `npm ci`, every one of 14 exact claim commands, `npm test`, `npm run lint`, `npm run build`, and `npm audit --omit=dev` passed.
- Full suite: 4 unit tests and 25 Playwright tests passed.
- Build: JS 35.10 KB raw / 12.32 KB gzip; CSS 18.95 KB raw / 4.99 KB gzip; `dist/index.html` present.
- Live verifier: title, `lang=en`, one h1, main landmark, image alt coverage, labeled buttons, and zero console errors passed.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.4 s, TBT 20 ms, CLS 0.
- SHA-256 parity: deployed `index.html`, `sw.js`, manifest, hashed JS, and hashed CSS match local `dist/` exactly.
