# Adversarial first-read review 6 — Linux Learning Station

- Work order: `linux-learning-station-review-6`
- Reviewed commit: `c70396756c38dabbdd52dbcd010cb48d47298bf0`
- Live URL: <https://linux-learning-station.sociobot.in>
- Reviewed: 2026-08-30 UTC
- Verdict: **PASS**

No blocking, high, medium, low, copy, claim, routing, accessibility, privacy, or visual-identity finding remains. This was a fresh full review, not a diff review.

## Cold first read before scrolling

Fresh Chromium contexts were used at 390 × 844 and 1440 × 900. Neither context shared storage or a service worker with the other.

| Question | Answer from the first screen | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It starts offline learning activities on a shared computer. | “Start offline learning activities”; “Patterns, typing, logic, spelling, numbers, and drawing.” | Clear |
| For whom? | Parents and teachers setting up a shared computer for children aged 5–10. | “For parents and teachers setting up a shared computer for children aged 5–10.” | Clear |
| What should I click first? | Try the populated sample station. | “Try it with sample data”; “Opens all six activities with ages 7–8 sample progress.” | Clear |

At 390 px, the primary action ended at y=607, its explanation ended at y=660, and all four facts ended at y=770. They were visible in the 844 px viewport. The desktop first screen supplied the same answers. Normal landing-page loads had no console or page errors.

## Copy audit

Counts use whitespace-separated words. The audit includes visible navigation, headings, controls, footer copy, and meaningful image alt text. No item is over 22 words. No banned marketing adjective, unexplained jargon, inconsistent core term, non-self-contained section heading, or non-result-naming button was found.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to activities | 3 | Pass |
| Linux Learning Station | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Online / Ready offline / Offline | 1 / 2 / 1 | Pass |
| Offline activities for shared Linux computers | 6 | Pass |
| Start offline learning activities | 4 | Pass |
| For parents and teachers setting up a shared computer for children aged 5–10. | 13 | Pass |
| Try it with sample data | 5 | Pass |
| Opens all six activities with ages 7–8 sample progress. | 9 | Pass |
| Nothing is saved to your real station. | 7 | Pass |
| Six core activities are free | 5 | Pass |
| Progress stays on this computer | 5 | Pass |
| Works offline after the first visit | 6 | Pass |
| Workshop bundle: ₹499 once | 4 | Pass |
| Choose an age range | 5 | Pass |
| Start activities for ages 5–6 / 7–8 / 9–10 | 5 each | Pass |
| Open the station board | 4 | Pass |
| A rugged concrete computer desk with moss, a keyboard, paper objects, and a blank screen | 15 | Pass |
| Patterns, typing, logic, spelling, numbers, and drawing. | 7 | Pass |
| Three steps | 2 | Pass |
| How it works | 3 | Pass |
| Choose an age range. | 4 | Pass |
| Pick ages 5–6, 7–8, or 9–10. | 6 | Pass |
| Start any activity. | 3 | Pass |
| Five guided activities have three short rounds. | 7 | Pass |
| Drawing is one open session. | 5 | Pass |
| Keep progress locally. | 3 | Pass |
| Adults can print, export, import, or erase it. | 8 | Pass |
| No child account or tracking | 5 | Pass |
| The station does not send activity progress to us. | 9 | Pass |
| It has no ads, chat, cloud profile, or code loaded from other sites. | 13 | Pass |
| Read the privacy details | 4 | Pass |
| Workshop bundle | 2 | Pass |
| Workshop bundle — ₹499 once | 5 | Pass |
| Adds five-round sessions and detailed printouts. | 6 | Pass |
| Every core activity stays free. | 5 | Pass |
| Buy workshop bundle — ₹499 | 4 | Pass |
| Opens secure Sociobot checkout. | 4 | Pass — the tested endpoint is HTTPS and its request boundary is asserted. |
| After payment, return here to use the workshop bundle. | 10 | Pass — `checkout-purchase` proves the returned-license path. |
| Already bought it? | 3 | Pass |
| Restore the license in Adult tools. | 6 | Pass — `paid-bundle` uses the visible restore form. |
| Six local activities for shared Linux computers. | 7 | Pass |
| Terms / Built by Param Factory / v1.2.6 | 1 / 4 / 1 | Pass |

### README

Fenced commands and command comments are executable syntax, not reader-facing sentences. All prose, headings, and list items are listed below.

| Copy | Words | Result |
| --- | ---: | --- |
| Linux Learning Station | 3 | Pass |
| Start six offline learning activities for children aged 5–10 on a shared Linux computer. | 14 | Pass |
| For parents and teachers who need a private, account-free activity station. | 11 | Pass |
| Live product: https://linux-learning-station.sociobot.in | 3 | Pass |
| What it includes | 3 | Pass |
| Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook | 13 | Pass |
| Age ranges: 5–6, 7–8, and 9–10 | 6 | Pass |
| Progress stays in this browser. | 5 | Pass |
| Adults can print a code or move progress with an export file. | 11 | Pass |
| Open saved pages offline after the first visit. | 8 | Pass |
| Apply updates from an in-app notice. | 7 | Pass |
| Keyboard, pointer, and touch paths, including keyboard-created drawing shapes | 9 | Pass |
| Setup, install, reset, legal, and license controls grouped under Adult tools | 10 | Pass |
| Six free core activities. | 4 | Pass |
| A ₹499 one-time workshop bundle adds five-round sessions and detailed week printouts. | 13 | Pass |
| A one-click `/demo` station with sample progress, Reset demo, and Start for real controls | 14 | Pass |
| Core activities have no analytics, ads, chat, child account, cloud profile, or code loaded from other sites. | 17 | Pass |
| Adults can buy the workshop bundle through Sociobot checkout or restore a license in Adult tools. | 15 | Pass |
| Try the demo | 3 | Pass |
| Open `/?demo=1`, `/demo`, or select **Try it with sample data** on the first screen. | 13 | Pass |
| It opens ages 7–8 sample progress without reading or changing real progress. | 12 | Pass |
| See `.factory/demo.md` for the sample data, reset behavior, and separate demo storage. | 12 | Pass |
| Run locally | 2 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Service workers are disabled in development to avoid stale local assets. | 10 | Pass |
| Test offline behavior against a production preview. | 8 | Pass |
| Test and build | 3 | Pass |
| Playwright is pinned to 1.58.2. | 5 | Pass |
| In the factory worker image, Chromium uses `PLAYWRIGHT_BROWSERS_PATH`. | 10 | Pass |
| Elsewhere, run `npx playwright install chromium` once if needed. | 9 | Pass |
| Deploy | 1 | Pass |
| This is a static Vite application. | 6 | Pass |
| Build with `npm ci && npm run build`. | 7 | Pass |
| Publish `dist/` as the site root. | 6 | Pass |
| `staticwebapp.config.json` defines routes, the 404 page, headers, and cache rules. | 9 | Pass |
| Project records / Visual system and asset provenance / Build handoff and verification / Tested product claims / MIT license | 2 / 5 / 4 / 3 / 2 | Pass |

Terminology is consistent: **activity**, **age range**, **demo**, **progress**, **station**, **workshop bundle**, and **license** each name one concept.

## Demo, privacy, and sandbox behaviour

- One click opened `/?demo=1`. The first resulting screen contained six named activity actions, an ages 7–8 label, realistic prior attempts, two saved wins, and two points today.
- The persistent banner read “Demo — sample data, nothing is saved” and supplied **Reset demo** and **Start for real**. It remained present in an activity.
- Completing Pattern Quarry changed sample progress from two to three wins. **Reset demo** restored two wins. **Start for real** returned to real setup; revisiting `/demo` restored the shipped sample.
- The code selects separate IndexedDB names, `linux-learning-station-demo` and `linux-learning-station`, before loading or saving station data. The declared sandbox test verifies that demo data does not enter real storage.
- The live browser request log for landing, demo entry, and an activity completion contained only `https://linux-learning-station.sociobot.in` requests. No external script, font, frame, analytics, chat, ad, or progress request appeared.
- The clean-build suite independently completed and saved an activity after service-worker control and an offline reload.

## Claims and local quality gates

A fresh clone at `/tmp/linux-learning-station-review-6.HzIo4M` was installed with `npm ci`. Every exact command from `.factory/claims.json` was run independently. All 17 passed: `six-free-activities`, `core-session-shape`, `offline-reload`, `installable-pwa`, `demo-sandbox`, `local-only`, `json-export`, `erase-progress`, `printable-code`, `input-paths`, `update-notice`, `paid-bundle`, `license-local-storage`, `license-request-privacy`, `daily-license-check`, `age-ranges`, and `checkout-purchase`.

`npm test` passed (4 Vitest tests and 35 Playwright tests; `test-results/.last-run.json` reports `passed`). `npm run lint` and `npm run build` passed. The production build emitted `dist/`, with application JavaScript at 12.45 kB gzip and CSS at 5.00 kB gzip.

The landing and README claim cross-check is complete. Free activities maps to `six-free-activities`; session shape maps to `core-session-shape`; demo content/isolation/reset maps to `demo-sandbox`; local/no-tracking boundaries map to `local-only`; offline/install/update/export/erase/print/input/license/age/checkout statements map to their corresponding named claim. No claim-like visitor-facing sentence lacks a manifest entry and observable test.

## Structure, accessibility, links, and identity

- `/`, `/demo`, valid real/demo activity paths, `/privacy/`, `/terms/`, and `/offline.html` returned 200 with route-appropriate titles, one h1, one main, descriptions, canonicals, Open Graph/Twitter metadata, favicon, and apple-touch icon.
- `/does-not-exist`, `/activity/not-real`, and `/demo/activity/not-real` returned the designed HTTP 404 with a route back.
- All 16 sitemap URLs returned 200. Every rendered internal link crawled to 200; the checkout and mail links are explicit external links.
- Browser back from a demo activity restored the board, focused its h1, and announced “Page changed.” Forward focused the activity h1. The skip link, keyboard controls, dialog trap, 44 px mobile targets, 200% text, reduced motion, and serious/critical axe checks are covered in the passing suite.
- The live response sends CSP, `frame-ancestors 'none'` as a response header, `X-Content-Type-Options`, and `Referrer-Policy`. There were no normal-load CSP violations or console errors.
- The concrete/moss palette, hard outlines, offset shadows, station-board layout, system type pairing, and documented original desk image match `.factory/design.md`. The result is recognisably product-specific rather than a generic SaaS template.

## Earlier findings rechecked

Every earlier `review-*.md`, `polish-*.md`, and handoff was read. The rows below are live-and-code confirmations, not reliance on repair notes.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | All six free activities open, complete, and return without a purchase gate. |
| F-1-2 | Offline reload controls the worker, reloads offline, completes an activity, and saves it. |
| F-1-3 | Update applies a real waiting worker and confirms controller/cache replacement. |
| F-1-4 | Reset/exit restored the seed and kept demo data out of real storage. |
| F-1-5 | Deep links, metadata, legal shell, and 404 are route-correct. |
| F-1-6 | Session copy and `core-session-shape` now agree. |
| F-1-7 | Chromium installability is a declared tested claim. |
| F-1-8 | Age range is consistent and age content is tested. |
| F-1-9 | The unstable sales-status explanation remains absent; checkout is tested. |
| F-1-10 | Adult-tools restoration proves its unlocked effects. |
| F-1-11 | Unsupported credentials/provider-ID assertion remains absent. |
| F-1-12 | Cold status begins Online, then becomes Ready offline only under worker control. |
| F-1-13 | All facts fit before the 390 px age controls. |
| F-1-14 | Board/completion wording consistently says activity. |
| F-1-15 | How it works is the self-contained section heading. |
| F-1-16 | The paid heading names the bundle and exact price. |
| F-1-17 | Age actions name that they start activities. |
| F-1-18 | App, docs, and legal pages use age range. |
| F-1-19 | Adult tools wording does not imply an access restriction. |
| F-1-20 | Sample copy names contents without promotional wording. |
| F-1-21 | README leads with user outcomes, not storage implementation. |
| F-1-22 | README states offline/update outcomes in user terms. |
| F-1-23 | Parent copy uses code loaded from other sites; request audit verifies it. |
| F-1-24 | README describes demo isolation without implementation jargon. |
| F-1-25 | README says separate demo storage. |
| F-1-26 | Singular/plural win labels have regression coverage. |
| F-2-1 | Terms installation copy is covered by `installable-pwa`. |
| F-2-2 | Activity actions visibly say Start plus their names. |
| F-3-1 | Unknown real/demo activity paths return designed 404s. |
| F-3-2 | 390 px at 200% text has no horizontal overflow. |
| F-3-3 | Full guided/drawing completion is declared and tested. |
| F-3-4 | Provider/merchant assertions remain removed. |
| F-3-5 | Refund-handler assertions remain removed. |
| F-3-6 | Refund-to-license-revocation assertions remain removed. |
| F-3-7 | UI-restored token/verdict locations and demo exclusion are tested. |
| F-3-8 | License verification is token-only, bodyless, and cookieless. |
| F-3-9 | Privacy does not make unsupported request-exclusivity claims. |
| F-3-10 | The visible restore control is used in the paid claim test. |
| F-3-11 | Sitemap contains all six real and six demo activities. |
| F-4-1 | Recorded checkout proves ₹499 one-time offer, request boundary, and returned unlock. |
| F-4-2 | README deploy instructions are separate task-naming sentences. |
| F-4-3 | Open adult tools opens the working panel from header and activity. |
| F-5-1 | Workshop bundle names the paid feature everywhere; license names its token. |
| F-5-2 | Landing and README share the same plain privacy wording. |
| F-5-3 | Development fact and offline-preview instruction are separate. |
| F-5-4 | Chromium environment instructions are separate. |

## Missed leverage

No missing AI, sync, or import/export feature is found. The brief calls for an offline, account-free, local-first station on shared older Linux computers. Import/export is present for device transfer. A gateway-dependent assistant or cloud sync would weaken the stated job and privacy boundary. No decorative AI feature, embedded provider key, or direct Azure endpoint was found.

## What would make this perfect

The current release meets the stated product contract. Keep the existing live-demo, offline, claim, route, and accessibility checks in the release gate so that the verified privacy boundary and one-click sample path do not regress.
