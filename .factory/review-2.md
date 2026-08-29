# Adversarial first-read review 2 — Linux Learning Station

- Work order: `linux-learning-station-review-2`
- Reviewed commit: `497e0f4927d61e73ae1d9ddfb2de0b11e3bf332f`
- Live URL: <https://linux-learning-station.sociobot.in>
- Reviewed: 2026-08-29 UTC
- Verdict: **FAIL**

The core product is clear, tryable, and behaves correctly in the exercised sandbox. Two non-blocking findings remain. A PASS requires zero findings, including copy and unlisted-claim findings.

## Cold first read

Fresh browser contexts at 390×844 and 1440×900 were used before any scroll or prior storage.

| Question | Answer from the first screen | Evidence |
| --- | --- | --- |
| What does this do? | Starts offline learning activities. | “Start offline learning activities.” |
| For whom? | Parents and teachers preparing a shared computer for ages 5–10. | “For parents and teachers setting up a shared computer for children aged 5–10.” |
| What should I click first? | Try the sample station. | “Try it with sample data,” followed by what opens and the isolation statement. |

This is clear on both sizes. At 390 px the action note and all four short facts are visible before scrolling. No first-screen blocking finding.

## Findings

### Medium

#### F-2-1 — The Terms page makes an unlisted installability claim

- Quote/location: `/terms/`, Core activities: “You may install the PWA on devices you control, subject to the MIT software license included with the project.”
- Why this fails: this is a visitor-facing promise that the product is installable. `.factory/claims.json` has no `installable-pwa` entry or tagged browser test for it. This reintroduces the class of issue identified as F-1-7 after the README wording was removed.
- Concrete fix: either remove the installation promise from the Terms page, or add `installable-pwa` to `.factory/claims.json` with a fresh-context Playwright/CDP test that asserts a valid manifest and zero Chromium installability errors from `/demo`.

### Minor

#### F-2-2 — Demo activity buttons do not name the result

- Quote/location: `/demo`, every activity slab has a visible button labelled only “Start” (Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook).
- Why this fails: the visual label is a generic verb. It does not say what begins, contrary to the plain-words button rule. The programmatic `aria-label` has the activity name, but sighted visitors still see only “Start.”
- Concrete fix: render the visible labels as “Start Pattern Quarry,” “Start Key Trail,” and so on; retain the concise slab layout if needed with a smaller type size.

## Landing-page copy audit

Counts are whitespace-separated. Navigation labels, controls, figure text, and footer text are included. No landing sentence exceeds 22 words or contains a banned marketing term. The only landing button labels are result-naming: “Try it with sample data” and “Start activities for ages …”.

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
| Optional bundle: ₹499 once | 4 | Pass |
| Choose an age range | 5 | Pass |
| Start activities for ages 5–6. Open the station board. | 10 | Pass |
| Start activities for ages 7–8. Open the station board. | 10 | Pass |
| Start activities for ages 9–10. Open the station board. | 10 | Pass |
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
| It has no ads, chat, cloud profile, or third-party scripts. | 10 | Pass |
| Read the privacy details | 4 | Pass |
| Optional activity bundle — ₹499 once | 6 | Pass |
| Adds five-round sessions and detailed printouts. | 6 | Pass |
| Every core activity stays free. | 5 | Pass |
| New licenses are not for sale now. | 7 | Pass |
| Existing licenses can be restored in Adult tools. | 8 | Covered by `paid-bundle` flow |
| Six local activities for shared Linux computers. | 7 | Pass |
| Built by Param Factory | 4 | Pass |
| A rugged concrete computer desk with moss, a keyboard, paper objects, and a blank screen | 15 | Pass |

## README copy audit

Commands and literal file names in code blocks are excluded. No README sentence exceeds 22 words or uses banned marketing language. “PWA” is absent from the README; the unlisted installability promise is instead in Terms (F-2-1).

| Copy | Words | Result |
| --- | ---: | --- |
| Start six offline learning activities for children aged 5–10 on a shared Linux computer. | 14 | Pass |
| For parents and teachers who need a private, account-free activity station. | 11 | Pass |
| Live product: https://linux-learning-station.sociobot.in | 3 | Pass |
| What it includes | 3 | Pass |
| Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook | 13 | Pass |
| Age ranges: 5–6, 7–8, and 9–10 | 5 | Covered by `age-ranges` |
| Progress stays in this browser. | 5 | Covered by `local-only` |
| Adults can print a code or move progress with an export file. | 11 | Covered by export/print claims |
| Open saved pages offline after the first visit. | 8 | Covered by `offline-reload` |
| Apply updates from an in-app notice. | 7 | Covered by `update-notice` |
| Keyboard, pointer, and touch paths, including keyboard-created drawing shapes | 9 | Covered by `input-paths` |
| Setup, install, reset, legal, and license controls grouped under Adult tools | 10 | Pass |
| Six free core activities. | 4 | Covered by `six-free-activities` |
| A valid ₹499 one-time workshop license adds five-round sessions and detailed week printouts. | 13 | Covered by `paid-bundle` |
| A one-click `/demo` station with sample progress, Reset demo, and Start for real controls | 13 | Covered by `demo-sandbox` |
| Core activities have no analytics, ads, chat, child account, cloud profile, or code loaded from other sites. | 15 | Covered by `local-only` |
| New licenses are not for sale now. | 7 | Covered by `sales-paused` |
| Existing licenses can be restored in Adult tools. | 8 | Covered by `paid-bundle` flow |
| Try the demo | 3 | Pass |
| Open `/?demo=1`, `/demo`, or select Try it with sample data on the first screen. | 13 | Covered by `demo-sandbox` |
| It opens ages 7–8 sample progress without reading or changing real progress. | 12 | Covered by `demo-sandbox` |
| See `.factory/demo.md` for the sample data, reset behavior, and separate demo storage. | 11 | Pass |
| Run locally | 2 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Service workers are disabled in development to avoid stale local assets; test offline behavior against a production preview. | 18 | Pass |
| Test and build | 3 | Pass |
| Playwright is pinned to 1.58.2. | 5 | Pass |
| In the factory worker image its Chromium binary comes from `PLAYWRIGHT_BROWSERS_PATH`; elsewhere run `npx playwright install chromium` once if needed. | 20 | Pass |
| Deploy | 1 | Pass |
| This is a static Vite application. | 5 | Pass |
| Run `npm ci && npm run build` and publish the `dist/` directory as the site root. | 16 | Pass |
| `staticwebapp.config.json` is emitted with the build and supplies activity/demo rewrites, a designed 404 response, security headers, and immutable asset caching. | 20 | Pass |
| Project records | 2 | Pass |
| Visual system and asset provenance | 5 | Pass |
| Build handoff and verification | 4 | Pass |
| Tested product claims | 3 | Pass |
| MIT license | 2 | Pass |

Terminology is consistent: **activity**, **age range**, **demo**, and **progress** are the only product terms used for those concepts.

## Demo, privacy, and claims evidence

- One first-screen click opened `/?demo=1`. The first demo screen already showed six named activities, ages 7–8 sample progress, two saved wins, and the persistent banner “Demo — sample data, nothing is saved.”
- A Pattern Quarry win changed the demo from two to three wins. **Start for real** returned to empty real setup. Returning to `/demo` restored the shipped two-win sample. The real and demo stores are distinct in code (`linux-learning-station` and `linux-learning-station-demo`) and in live behavior.
- **Reset demo** is present in the banner and restores the same sample state. The banner remained present on `/demo/activity/patterns`.
- The live demo request log contained only `https://linux-learning-station.sociobot.in`; it contained no third-party script, font, frame, analytics, ad, chat, or child-progress request. The console was clean for normal landing and demo use.
- From a clean remote clone at `497e0f4`, `npm ci` succeeded. Every exact claim command in `.factory/claims.json` passed independently: `six-free-activities`, `offline-reload`, `demo-sandbox`, `local-only`, `json-export`, `erase-progress`, `printable-code`, `input-paths`, `update-notice`, `paid-bundle`, `daily-license-check`, `age-ranges`, and `sales-paused`. The final Playwright status was `{"status":"passed","failedTests":[]}`.
- Local quality gates also passed: `npm test` (4 unit and 24 Playwright tests), `npm run lint`, and `npm run build`. Build output is `dist/`; application JavaScript is 12.33 KB gzip.

## Structure, routes, and accessibility

- `/`, `/demo`, `/demo/activity/patterns`, `/activity/patterns`, `/privacy/`, and `/terms/` returned 200. An unknown route returned the designed 404 with status 404 and a route back.
- Checked routes have one `h1`, a `main`, a per-route title/description/canonical/Open Graph/Twitter metadata, favicon and apple-touch icon. The legal and 404 pages include the shared wordmark, navigation, footer one-liner, Privacy, Terms, Param Factory attribution, and version.
- Back/forward between demo board and activity restored the view, focused the new `h1`, and updated the polite announcement. Crawled internal links returned 200 (or were explicit mail links).
- The live response has the expected CSP, response-header `frame-ancestors 'none'`, `X-Content-Type-Options`, and `Referrer-Policy`. The concrete/moss board, heavy rules, offset shadows, and original editorial image match `.factory/design.md` and are distinct from a generic SaaS template.
- The complete test suite’s axe smoke tests passed for setup, demo, activity, adult tools, Privacy, and Terms. The 390 px first screen and demo board had no horizontal overflow; reduced motion is respected.

## Earlier findings rechecked

All earlier `review`, `polish`, handoff, and verification records were read. The following are confirmed fixed on the deployed site and in source/tests, unless noted as a new finding above.

| Earlier finding | Current evidence |
| --- | --- |
| Verification 1 #1 | Claims manifest now has 13 tagged, self-building commands. |
| Verification 1 #2 | One-click seeded demo, isolated store, banner, reset, and exit behavior verified. |
| Verification 1 #3 | No checkout/buy action is shown; sales-paused test passes. |
| Verification 1 #4 | Age 9–10 logic flow is covered by regression tests. |
| Verification 1 #5 | Live CSP and `frame-ancestors` header are present. |
| Verification 1 #6 | Malformed and negative-score imports are rejected. |
| Verification 1 #7 | Keep progress closes the dialog. |
| Verification 1 #8 | Route focus/announcement, drawer focus, import focus, and 44 px targets are tested. |
| Verification 1 #9 | Corrupt cached license state reaches recovery rather than bricking startup. |
| Verification 1 #10 | Real routes, deep links after setup, metadata, 404, and shared shell all verified. |
| Verification 1 #11 | Hashed assets are immutable; worker is no-cache. |
| Verification 1 #12 | Copy audit exists and exact typing rejects trailing whitespace. |
| Verification 2 #1 | Each claim test invokes the production build and passed from a new clone. |
| Verification 2 #2 | `/demo/activity/*` retains demo mode and cannot change real progress. |
| Verification 2 #3 | Semantic score validation rejects impossible points. |
| Verification 2 #4 | The previously named activity, export, erase, print, input, update, paid, and rate-limit claims are now declared and tested. |
| Verification 2 #5 | Broken purchase path was removed and sales are honestly paused. |
| Verification 2 #6 | Storage recovery has no CSP-blocked inline handler. |
| Verification 2 #7 | Next round focuses the task slab. |
| Verification 2 #8 | Tested mobile targets meet the 44 px floor. |
| Verification 2 #9 | Landing includes first-screen facts, How it works, privacy, and exact price state. |
| Verification 2 #10 | App and legal footers now agree at `v1.2.1`. |
| Review 1 F-1-1 | Usable completion path for all six free activities is tested. |
| Review 1 F-1-2 | Copy says “after the first visit”; offline test completes and saves a round. |
| Review 1 F-1-3 | Update test activates a real waiting worker and verifies controller/cache change. |
| Review 1 F-1-4 | Start for real discards modified sample state before real setup. |
| Review 1 F-1-5 | Deep links, metadata, legal/404 metadata, and shells are complete. |
| Review 1 F-1-6 | Guided three-round activities and open drawing session are stated accurately. |
| Review 1 F-1-7 | README installability wording was removed; Terms now requires the new F-2-1 remedy. |
| Review 1 F-1-8 | “Age range” is consistent and distinct sample content is tested. |
| Review 1 F-1-9 | Sales status is stable, honest copy with a matching test. |
| Review 1 F-1-10 | Stored-token verification starts without a cached verdict and unlocks the paid effects. |
| Review 1 F-1-11 | Untested credential statement was removed. |
| Review 1 F-1-12 | Header says Online until worker control. |
| Review 1 F-1-13 | Four facts are visible in the 390 px first screen. |
| Review 1 F-1-14 | “Activity” replaced the ambiguous “trail” navigation term. |
| Review 1 F-1-15 | The section heading is “How it works.” |
| Review 1 F-1-16 | Paid heading identifies the optional bundle and price. |
| Review 1 F-1-17 | Age actions state that they open age-specific activities. |
| Review 1 F-1-18 | The setting is consistently “age range.” |
| Review 1 F-1-19 | README says controls are grouped under Adult tools, not access-restricted. |
| Review 1 F-1-20 | The demo note states sample contents rather than “ready-to-use.” |
| Review 1 F-1-21 | README starts with the progress outcome, not storage jargon. |
| Review 1 F-1-22 | README explains user-facing offline/update behavior. |
| Review 1 F-1-23 | README uses plain “code loaded from other sites.” |
| Review 1 F-1-24 | README explains demo isolation without IndexedDB jargon. |
| Review 1 F-1-25 | README says separate demo storage. |
| Review 1 F-1-26 | One-win grammar is singular in source and covered by activity flow. |

`polish-1.md` maps each F-1 repair to the same test/source evidence above. Verification 3 and Verification 4 record no open defects; their paused-checkout note remains accurate and does not impede the free product.

## Missed leverage

No missing AI feature is found. The brief requires a private, offline, account-free station for young children; a gateway-dependent assistant would weaken that core use case. Export/import already provides the useful device-transfer path, and sync would conflict with the local-first scope. No decorative AI feature, provider key, or direct Azure endpoint was found.

## What would make this perfect

Add and test the Terms-page installability claim (or remove it), then replace the six generic visible **Start** labels with activity-naming actions. Re-run the clean-clone claim commands and the 390 px demo scan. With those two items resolved, this review has no identified remaining work.
