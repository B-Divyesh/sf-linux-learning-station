# Polish 5 — cumulative adversarial repair map

- Work order: `linux-learning-station-polish-5`
- Released candidate reviewed: `5e147de4c6dfe40de9704b35cf745bfbd169b417`
- Review report: `b10b2cf3744d03ee78ea2dac3caeed9d5a94434e`
- Repair commit: `21d33c4c9eb4c57df9eb237d7e295925b8560df1`
- Product version: `v1.2.6`
- Static deployment: `c122c594-a1b0-4d8a-9c39-b4e1e2288bb7`
- Live URL: <https://linux-learning-station.sociobot.in>
- Result: **PASS — no finding remains open.**

## Evidence key

- **T** is the named Playwright or claim test. Every claim command was run independently from clean clone `/tmp/linux-learning-station-clean.77VDuE`.
- **S** is a current visual artifact: [cold mobile](polish-5-live/live-cold-mobile.png), [demo mobile](polish-5-live/live-demo-mobile.png), [demo at 200%](polish-5-live/live-demo-200-percent.png), or [local cold mobile](polish-5-local/cold-mobile.png).
- **L** is a current cold live check in [live-check.json](polish-5-live/live-check.json), [copy-check.json](polish-5-live/copy-check.json), [verify.json](polish-5-live/verify/verify.json), or [Lighthouse](polish-5-live/lighthouse.json), against the URL named in the row.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | All six free activities open and complete without a purchase gate. | T `@claim:six-free-activities`; S demo mobile; L `/demo` activities in live-check. |
| F-1-2 | The offline promise says after first visit; the test reloads offline and saves an activity. | T `@claim:offline-reload`; S demo mobile; L `/demo` offlineActivity passed. |
| F-1-3 | Update now activates a real waiting worker, changes controller, reloads, and replaces the cache marker. | T `@claim:update-notice`; S demo mobile; L `/demo` update flow is covered by the deployed full suite. |
| F-1-4 | Start for real reseeds/discards changed demo data and never copies it to real storage. | T `@claim:demo-sandbox`; S demo mobile; L `/demo` `2 → 3 → exit → 2`. |
| F-1-5 | Valid deep links preserve the activity through setup; metadata, legal shell, and designed 404 are route-specific. | T deep-link and invalid-route tests; S cold mobile; L `/activity/patterns`, `/privacy/`, `/terms/`, and invalid paths passed. |
| F-1-6 | Copy distinguishes five guided three-round activities from drawing’s open saved session. | T `@claim:core-session-shape`; S demo mobile; L `/demo` sessionShape passed. |
| F-1-7 | Installability is declared and checked with Chromium manifest/installability APIs. | T `@claim:installable-pwa`; S cold mobile; L `/demo` installabilityErrors `[]`. |
| F-1-8 | Every age range opens distinct guided content; **age range** is the single term. | T `@claim:age-ranges`; S cold mobile; L `/` age controls and content passed. |
| F-1-9 | The unstable paused-sales explanation was removed; checkout has a recorded-offer claim. | T `@claim:checkout-purchase`; S cold mobile; L `/` checkout redirect passed. |
| F-1-10 | The visible Adult tools restore form reaches a valid response and unlocks five rounds/print details. | T `@claim:paid-bundle`; S demo mobile; L `/demo` licenseRestore passed. |
| F-1-11 | Unsupported credential/provider-ID assertion remains absent. | T source/bundle regression suite; S cold mobile; L `/` console/errors `[]`. |
| F-1-12 | Cold status is Online until a controlling worker makes offline readiness true. | T `demo entry and offline status reflect actual service-worker readiness`; S demo mobile; L `/demo` Ready offline after control. |
| F-1-13 | The four facts stay above age controls in the 390 × 844 first screen. | T `@claim:checkout-purchase`; S cold mobile; L `/` fact box fits viewport. |
| F-1-14 | Board and completion wording consistently says **activity**. | T `@claim:six-free-activities`; S demo mobile; L `/demo` current board labels. |
| F-1-15 | The section heading is the self-contained **How it works**. | T copy regression; S cold mobile; L `/` cold copy check. |
| F-1-16 | The paid section names the actual workshop bundle and its price. | T `@claim:checkout-purchase`; S cold mobile; L `/` checkout/current copy passed. |
| F-1-17 | Each age action names its result: **Start activities for ages …**. | T `@claim:age-ranges`; S cold mobile; L `/` mobile actions passed. |
| F-1-18 | The app, print sheet, legal pages, README, and audit use **age range**. | T `@claim:age-ranges`; S cold mobile; L `/` and legal routes passed. |
| F-1-19 | README describes controls as grouped under Adult tools, not as access control. | T copy regression; S local cold mobile; L `/demo` Adult tools opens normally. |
| F-1-20 | The sample action names six activities and ages 7–8 sample progress without promotional wording. | T `@claim:demo-sandbox`; S cold mobile; L `/?demo=1` one-click entry passed. |
| F-1-21 | README leads with browser-local progress, printing, and export outcomes. | T `@claim:json-export`; S local cold mobile; L `/demo` export/import path passed. |
| F-1-22 | README describes saved offline pages and in-app updates in user terms. | T `@claim:offline-reload`, `@claim:update-notice`; S demo mobile; L `/demo` offline activity passed. |
| F-1-23 | Parent-facing copy uses **code loaded from other sites**, with same-origin proof. | T `@claim:local-only`; S cold mobile; L `/` copy-check and `externalRequests: []`. |
| F-1-24 | README describes the demo outcome: it cannot read or change real progress. | T `@claim:demo-sandbox`; S demo mobile; L `/demo` isolation passed. |
| F-1-25 | README uses **separate demo storage**; implementation details stay in demo documentation. | T `@claim:demo-sandbox`; S demo mobile; L `/demo` isolation passed. |
| F-1-26 | Progress labels correctly use singular/plural **win/wins**. | T `saved progress uses singular and plural win labels`; S demo mobile; L `/activity/patterns` winGrammar passed. |

## Reviews 2–4

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Terms installability wording is backed by manifest, icons, controlling worker, and Chromium checks. | T `@claim:installable-pwa`; S cold mobile; L `/terms/` and installabilityErrors `[]`. |
| F-2-2 | Each slab visibly says **Start** plus its activity name and is at least 44 px tall. | T `@claim:six-free-activities`; S demo mobile; L `/demo` labels and minimumTarget `44`. |
| F-3-1 | Only known activity routes rewrite; invalid real/demo slugs return the designed 404. | T invalid activity routes; S cold mobile; L invalid paths return HTTP 404. |
| F-3-2 | The 390 px demo stacks intentionally and keeps the stamp/content visible at 200% text. | T 200% demo regression; S demo at 200%; L `scrollWidth = clientWidth = 390`. |
| F-3-3 | Guided/drawing session shape is claimed and proven through every completion flow. | T `@claim:core-session-shape`; S demo mobile; L `/demo` sessionShape passed. |
| F-3-4 | Provider-role assertions remain removed from Privacy and Terms. | T legal-page regression; S cold mobile; L `/privacy/` and `/terms/` negative checks passed. |
| F-3-5 | Refund-handler assertions remain removed; earlier purchase questions use support email. | T legal-page regression; S cold mobile; L `/terms/` negative check passed. |
| F-3-6 | Refund-to-license-revocation assertions remain removed. | T legal-page regression; S cold mobile; L `/terms/` negative check passed. |
| F-3-7 | UI restoration proves token/verdict locations and excludes demo data. | T `@claim:license-local-storage`; S demo mobile; L `/demo` licenseRestore passed. |
| F-3-8 | License verification is GET-only, token-only, bodyless, and cookieless. | T `@claim:license-request-privacy`; S demo mobile; L `/demo` licenseRestore passed. |
| F-3-9 | Privacy describes bounded core/license request paths without an unsupported exclusive-request promise. | T `@claim:local-only`, `@claim:license-request-privacy`; S cold mobile; L `/privacy/` passed. |
| F-3-10 | The paid restoration test uses the visible Adult tools form. | T `@claim:paid-bundle`; S demo mobile; L `/demo` licenseRestore passed. |
| F-3-11 | Sitemap lists all six real and six demo activity URLs. | T invalid activity routes/sitemap test; S cold mobile; L `/sitemap.xml` inventory passed. |
| F-4-1 | Versioned hosted-offer fixture proves INR 499.00, `one_time`, no recurring charge, endpoint, and returned-license unlock. | T `@claim:checkout-purchase`; S cold mobile; L `/` checkout redirect passed. |
| F-4-2 | README deploy instructions are separate task-naming sentences. | T copy regression; S local cold mobile; L deployed build/routing passed. |
| F-4-3 | Visible controls say **Open adult tools** and open a working panel from board/activity. | T adult-tools and activity-footer tests; S demo mobile; L `/demo` activityAdultTools passed. |

## Review 5

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Replaced every paid-feature name with **workshop bundle**. **License** now only names the unlock token. This includes landing, Adult tools, README, Privacy, claims, and legal copy. | T `copy uses workshop bundle consistently and keeps setup instructions plain`, `@claim:checkout-purchase`; S cold mobile; L `/`, `/demo`, `/privacy/`, `/terms/` copy-check all true. |
| F-5-2 | Replaced developer wording **third-party scripts** with **code loaded from other sites**, matching README language. | T copy regression and `@claim:local-only`; S cold mobile; L `/` copy-check and same-origin request audit passed. |
| F-5-3 | Split the README development-mode fact from the offline-preview instruction. | T copy regression; S local cold mobile; L current static build at `/` passed. |
| F-5-4 | Split factory Chromium configuration from the non-factory install instruction. | T copy regression; S local cold mobile; L current static build at `/` passed. |

## Final verification

- Clean clone at `21d33c4c9eb4c57df9eb237d7e295925b8560df1`: `npm ci`, all **17/17** exact claim commands, `npm test` (**4 Vitest + 35 Playwright**), `npm run lint`, `npm run build`, and `npm audit --omit=dev` all passed.
- Claim-manifest cross-check found 17 claims and exactly one `@claim:<id>` test for each.
- Current build: JS 35.71 kB raw / 12.45 kB gzip; CSS 18.98 kB raw / 5.00 kB gzip; `dist/index.html` exists.
- Live sweep: zero console errors, zero serious/critical Playwright Axe violations, one h1/main/language/alt checks pass, no external core-demo requests, routes and 404 pass, offline activity use passes, and manifest installability errors are empty.
- Live Lighthouse 12.8.2: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**.
