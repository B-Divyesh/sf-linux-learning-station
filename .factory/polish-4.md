# Polish 4 — cumulative adversarial repair map

- Work order: `linux-learning-station-polish-4`
- Released candidate: `cfb948258b4c7b77dc14b080f18d5061d25a3292`
- Review report commit: `95d386361011822906f7e4aebdcef31bc5ba3990`
- Product repair commits: `aa46b32`, `c647902`, `8ca16ad`
- Product build: `v1.2.5`
- Final deployment: `0ed1b7fe-0c85-405d-91be-2a0d51854835`
- Live URL: <https://linux-learning-station.sociobot.in>
- Result: every finding in reviews 1–4 is resolved.

Primary evidence is in [`polish-4-live/live-check.json`](polish-4-live/live-check.json), [`polish-4-live/http-check.json`](polish-4-live/http-check.json), [`polish-4-live/lighthouse.json`](polish-4-live/lighthouse.json), and [`polish-4-live/verify/verify.json`](polish-4-live/verify/verify.json). Visual evidence includes the [cold first screen](polish-4-live/live-cold-mobile.png), [demo board](polish-4-live/live-demo-mobile.png), and [demo at 200% text](polish-4-live/live-demo-200-percent.png).

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | All six core activities remain usable without a license gate. | `@claim:six-free-activities`; `@claim:core-session-shape`; live demo screenshot. |
| F-1-2 | The promise says “after the first visit,” and an activity completes and saves after a controlled offline reload. | `@claim:offline-reload`; live check `offlineActivity`. |
| F-1-3 | Applying the update uses a real waiting worker and verifies activation, reload, cache replacement, and the new controller. The test now owns a separate browser process so it cannot close the suite browser. | `@claim:update-notice`; final clean-clone full suite. |
| F-1-4 | **Start for real** discards changed demo progress and never copies it into real storage. | `@claim:demo-sandbox`; live check `demoIsolation`. |
| F-1-5 | Valid deep links survive setup; metadata follows routes; invalid activity slugs return the designed HTTP 404. | `real activity deep links…`; `invalid activity routes…`; live `/activity/patterns` and invalid-route checks. |
| F-1-6 | Copy distinguishes five guided three-round activities from one open drawing session, with full completion proof. | `@claim:core-session-shape`; live check `sessionShape`. |
| F-1-7 | Installability is listed and checked through Chromium manifest/installability APIs. | `@claim:installable-pwa`; live check `installabilityErrors: []`. |
| F-1-8 | **Age range** is the consistent term, and every range opens distinct guided content. | `@claim:age-ranges`; `copy-audit.md`. |
| F-1-9 | The obsolete paused-sales explanation is absent. The active purchase path is now a separate tested checkout claim. | `@claim:checkout-purchase`; live checkout returned HTTP 303. |
| F-1-10 | License restoration starts in the visible Adult tools form and proves the five-round and detailed-print outcomes. | `@claim:paid-bundle`; live check `licenseRestore`. |
| F-1-11 | The unsupported credential assertion remains absent. | README/source scan; claim-manifest cross-check. |
| F-1-12 | Status begins as **Online** and becomes **Ready offline** only under a controlling worker. | `demo entry and offline status…`; live screenshots. |
| F-1-13 | Free, local, offline, and price facts remain above the age controls and inside the 390 × 844 first screen. | `@claim:six-free-activities`; live cold screenshot; local fact bottom `769.64px`. |
| F-1-14 | Board and completion copy consistently uses **activity**. | `@claim:six-free-activities`; live demo screenshot. |
| F-1-15 | The section heading is the self-contained **How it works**. | Live cold screenshot; `copy-audit.md`. |
| F-1-16 | The price heading identifies the optional activity bundle. | Live cold screenshot; `@claim:checkout-purchase`. |
| F-1-17 | Every age action says **Start activities for ages …** and names the result below it. | `@claim:age-ranges`; live cold screenshot. |
| F-1-18 | App, print sheet, Privacy, README, and copy audit use **age range**. | Source scan; `copy-audit.md`. |
| F-1-19 | README says the controls are grouped under Adult tools and makes no access-control promise. | README review. |
| F-1-20 | The sample action names its six-activity, ages 7–8 contents without promotional wording. | `@claim:demo-sandbox`; live cold screenshot. |
| F-1-21 | README describes browser-local progress, printing, and export outcomes before implementation details. | README review; `@claim:json-export`; `@claim:printable-code`. |
| F-1-22 | README describes saved offline pages and in-app updates in user terms. | README review; offline and update claim tests. |
| F-1-23 | README uses plain “code loaded from other sites”; the request test proves same-origin core use. | `@claim:local-only`; live check `externalRequests: []`. |
| F-1-24 | README explains that sample progress cannot read or change real progress. | `@claim:demo-sandbox`; `demo.md`. |
| F-1-25 | README says **separate demo storage**; implementation details stay in `demo.md`. | README and demo documentation review. |
| F-1-26 | Progress labels now have explicit singular and plural regression coverage. | `saved progress uses singular and plural win labels`; live check `winGrammar: 1 win saved; 2 wins saved`. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | The Terms installation statement remains backed by a valid manifest, controlling worker, required icons, and zero Chromium installability errors. | `@claim:installable-pwa`; live `/terms/`; live installability check. |
| F-2-2 | Each activity slab visibly names its result with **Start + activity name** and remains at least 44px tall. | `@claim:six-free-activities`; live demo screenshot; live minimum target `44px`. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Only the 12 valid activity paths rewrite to the SPA; invalid real and demo activity paths return the designed 404. | `invalid activity routes…`; live HTTP check of all invalid paths. |
| F-3-2 | The mobile intro stacks, the stamp does not rotate, and all demo content remains visible at 200% text. | `demo board keeps all content visible at 200%…`; live 200% screenshot; geometry `390px = 390px`. |
| F-3-3 | The claim manifest lists the guided/drawing session shape and the tagged test completes every round. | `@claim:core-session-shape`; live check `sessionShape`. |
| F-3-4 | Merchant/provider-role assertions are removed from Adult tools, Privacy, and Terms. | `privacy and terms are real standalone pages`; live negative checks on `/privacy/` and `/terms/`. |
| F-3-5 | Refund-handler assertions are removed; earlier-purchase questions use the support email. | Same legal regression test; live Terms text check. |
| F-3-6 | Refund/reversal-to-revocation assertions are removed. | Same legal regression test; live Terms negative scan. |
| F-3-7 | The restore flow proves the token and latest verdict are the only license values and do not enter demo data. | `@claim:license-local-storage`. |
| F-3-8 | A seeded-progress request capture proves verification is token-only, bodyless, and cookieless. | `@claim:license-request-privacy`; live check `licenseRestore`. |
| F-3-9 | Privacy describes the tested core and optional request paths without claiming exclusivity. | `@claim:local-only`; `@claim:license-request-privacy`; live Privacy check. |
| F-3-10 | Paid restoration uses the visible Adult tools form before proving unlocked behavior. | `@claim:paid-bundle`; live check `licenseRestore`. |
| F-3-11 | The sitemap lists all six real and all six demo activity routes. | `invalid activity routes…`; live HTTP report checks 18 successful routes. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-4 | Removed “Sociobot and Dodo” provider-role copy from Privacy and Terms. | Legal regression test; live `/privacy/` and `/terms/` negative checks in `live-check.json` and `http-check.json`. |
| F-3-5 | Removed every refund-handler statement and added the requested earlier-purchase support sentence. | Legal regression test; live Terms check. |
| F-3-6 | Removed the refunded-purchase license assertion. | Legal regression test; live Terms negative scan. |
| F-4-1 | Reworked `checkout-purchase` around `tests/fixtures/checkout-session.json`, tied to the production slug and endpoint. It asserts INR 49,900 minor units, `one_time` billing, visible **₹499**, visible **One-time purchase**, no recurring charge, a bodyless cookieless checkout request, and the returned-license unlock. The restore claim no longer duplicates an unproved price statement. | `@claim:checkout-purchase`; recorded fixture; live root price; live checkout HTTP 303; live report `checkout`. |
| F-4-2 | Split deployment instructions into four task-naming sentences. | README **Deploy** section; `copy-audit.md`; final clean-clone build. |
| F-4-3 | The visible header action now says **Open adult tools** while retaining its accessible panel label. The activity footer action also opens a working panel and print sheet. | `adult tools expose local data…`; `activity footer opens working adult tools…`; live demo screenshot; live check `activityAdultTools`. |

## Additional acceptance evidence

- Final clean clone: `/tmp/lls-polish4-final.22qWqB` at `8ca16ad4877845b409b7e7bd887c726ba90b277f`.
- Every one of the 17 exact claim commands passed separately; a source check found exactly one matching `@claim:<id>` per manifest entry.
- `npm test` passed 4 unit tests and 34 Playwright tests. `npm run lint`, `npm run build`, and `npm audit --omit=dev` passed.
- Build output: JavaScript 35.70 KB raw / 12.46 KB gzip; CSS 18.98 KB raw / 5.00 KB gzip; `dist/index.html` exists.
- Local and live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100. Live FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0, total transfer 120 KiB.
- Live baseline verifier: correct title and language, one h1, one main, complete alt text, labelled buttons, and zero console errors.
- Live deployment parity: 17/17 checked files match local `dist/` by SHA-256.
- The concrete, moss, lichen, heavy-rule, and offset-shadow visual system remains unchanged. The original documented station image remains the hero art.
- The offline fallback now uses the shared external stylesheet and full site shell, removing its prior inline-style CSP risk.
