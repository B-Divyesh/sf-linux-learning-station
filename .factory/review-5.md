# Adversarial first-read review 5 — Linux Learning Station

- Work order: `linux-learning-station-review-5`
- Reviewed commit: `5e147de4c6dfe40de9704b35cf745bfbd169b417`
- Live URL: <https://linux-learning-station.sociobot.in>
- Reviewed: 2026-08-30 UTC
- Verdict: **FAIL**

The product is clear on first read, the one-click demo works, all 17 declared claim tests pass from a clean clone, and the live route/accessibility checks pass. This review still fails because the required standard is zero findings. Four copy findings remain: the paid feature has three names, the landing privacy summary uses technical wording that differs from the README, and two README sentences combine separate instructions.

## Cold first read before scrolling

Fresh Chromium contexts at 390×844 and 1440×900 had separate storage and no shared service worker. No scroll occurred before the answers were recorded.

| Question | Answer in my own words | Exact first-screen evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It starts offline pattern, typing, logic, spelling, number, and drawing activities. | “Start offline learning activities”; “Patterns, typing, logic, spelling, numbers, and drawing.” | Clear |
| For whom? | Parents and teachers setting up a shared computer for children aged 5–10. | “For parents and teachers setting up a shared computer for children aged 5–10.” | Clear |
| What should I click first? | Open the populated sample station. | “Try it with sample data”; “Opens all six activities with ages 7–8 sample progress.” | Clear |

At 390 px, the primary action ends at y=607, its two-sentence explanation ends at y=660, and all four facts end at y=770. They fit within the 844 px viewport. The page had no horizontal overflow or console error. The first-read requirement passes on mobile and desktop.

## Findings

### Medium

#### F-5-1 — The same paid feature has three names

- Exact quotes/locations: landing “Optional bundle: ₹499 once,” “Optional activity bundle — ₹499 once,” and “Buy workshop bundle — ₹499”; README “A ₹499 one-time workshop license…” and “Adults can buy the optional bundle…”.
- Why this fails: a purchaser has to infer whether “optional bundle,” “activity bundle,” “workshop bundle,” and “workshop license” refer to one ₹499 product or different products. The recorded checkout offer calls it “Workshop bundle.”
- Concrete fix: use **workshop bundle** for the paid feature everywhere. Keep **license** only for the token that unlocks it. Suggested rewrites include “Workshop bundle: ₹499 once,” “Workshop bundle — ₹499 once,” and “A ₹499 one-time workshop bundle adds five-round sessions and detailed week printouts.”

### Minor

#### F-5-2 — The landing privacy summary uses technical and inconsistent wording

- Exact quote/location: landing privacy section, “It has no ads, chat, cloud profile, or third-party scripts.” The README describes the same boundary as “code loaded from other sites.”
- Why this fails: “third-party scripts” is developer terminology, and the same privacy fact has two phrasings. A parent should not need to translate “scripts” to understand what loads.
- Concrete fix: use the README wording on the landing page: “It has no ads, chat, cloud profile, or code loaded from other sites.”

#### F-5-3 — One README sentence combines a development fact and a test instruction

- Exact quote/location: README, Run locally: “Service workers are disabled in development to avoid stale local assets; test offline behavior against a production preview.”
- Why this fails: the reader must separate an explanation about development mode from a distinct verification instruction.
- Concrete fix: “Service workers are disabled in development to avoid stale local assets. Test offline behavior against a production preview.”

#### F-5-4 — One README sentence combines two environment-specific setup instructions

- Exact quote/location: README, Test and build: “In the factory worker image its Chromium binary comes from `PLAYWRIGHT_BROWSERS_PATH`; elsewhere run `npx playwright install chromium` once if needed.”
- Why this fails: the factory configuration and the non-factory setup action are separate instructions joined into one sentence.
- Concrete fix: “In the factory worker image, Chromium uses `PLAYWRIGHT_BROWSERS_PATH`. Elsewhere, run `npx playwright install chromium` once if needed.”

## Landing-page copy audit

Counts treat punctuation as punctuation rather than words. The table includes headings, controls, status text, footer text, and meaningful image alt text. No item exceeds 22 words and no banned marketing adjective appears.

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
| Optional bundle: ₹499 once | 4 | F-5-1 |
| Choose an age range | 4 | Pass |
| Start activities for ages 5–6 | 5 | Pass |
| Open the station board | 4 | Pass |
| Start activities for ages 7–8 | 5 | Pass |
| Open the station board | 4 | Pass |
| Start activities for ages 9–10 | 5 | Pass |
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
| Privacy | 1 | Pass |
| No child account or tracking | 5 | Pass |
| The station does not send activity progress to us. | 9 | Pass |
| It has no ads, chat, cloud profile, or third-party scripts. | 10 | F-5-2 |
| Read the privacy details | 4 | Pass |
| Optional bundle | 2 | F-5-1 |
| Optional activity bundle — ₹499 once | 5 | F-5-1 |
| Adds five-round sessions and detailed printouts. | 6 | Pass |
| Every core activity stays free. | 5 | Pass |
| Buy workshop bundle — ₹499 | 4 | F-5-1 |
| Opens secure Sociobot checkout. | 4 | Pass |
| After payment, return here to use the bundle. | 8 | Pass |
| Already bought it? | 3 | Pass |
| Restore the license in Adult tools. | 6 | Pass; license names the token |
| Six local activities for shared Linux computers. | 7 | Pass |
| Privacy | 1 | Pass |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.2.5 | 1 | Pass |

All landing buttons name their result: **Try it with sample data**, **Start activities for ages …**, and **Buy workshop bundle — ₹499**. The privacy link and setup actions also use result-naming verbs.

## README copy audit

Executable fenced commands and their inline comments are not sentences and are excluded. All headings, link labels, prose sentences, and list items are included below. No item exceeds 22 words and no banned marketing adjective appears.

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
| Adults can print a code or move progress with an export file. | 12 | Pass |
| Open saved pages offline after the first visit. | 8 | Pass |
| Apply updates from an in-app notice. | 6 | Pass |
| Keyboard, pointer, and touch paths, including keyboard-created drawing shapes | 9 | Pass |
| Setup, install, reset, legal, and license controls grouped under Adult tools | 11 | Pass |
| Six free core activities. | 4 | Pass |
| A ₹499 one-time workshop license adds five-round sessions and detailed week printouts. | 12 | F-5-1 |
| A one-click `/demo` station with sample progress, Reset demo, and Start for real controls | 14 | Pass |
| Core activities have no analytics, ads, chat, child account, cloud profile, or code loaded from other sites. | 17 | Pass |
| Adults can buy the optional bundle through Sociobot checkout or restore a license in Adult tools. | 16 | F-5-1 |
| Try the demo | 3 | Pass |
| Open `/?demo=1`, `/demo`, or select Try it with sample data on the first screen. | 14 | Pass |
| It opens ages 7–8 sample progress without reading or changing real progress. | 12 | Pass |
| See `.factory/demo.md` for the sample data, reset behavior, and separate demo storage. | 12 | Pass |
| Run locally | 2 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Service workers are disabled in development to avoid stale local assets; test offline behavior against a production preview. | 18 | F-5-3 |
| Test and build | 3 | Pass |
| Playwright is pinned to 1.58.2. | 5 | Pass |
| In the factory worker image its Chromium binary comes from `PLAYWRIGHT_BROWSERS_PATH`; elsewhere run `npx playwright install chromium` once if needed. | 20 | F-5-4 |
| Deploy | 1 | Pass |
| This is a static Vite application. | 6 | Pass |
| Build with `npm ci && npm run build`. | 7 | Pass |
| Publish `dist/` as the site root. | 6 | Pass |
| `staticwebapp.config.json` defines routes, the 404 page, headers, and cache rules. | 10 | Pass |
| Project records | 2 | Pass |
| Visual system and asset provenance | 5 | Pass |
| Build handoff and verification | 4 | Pass |
| Tested product claims | 3 | Pass |
| MIT license | 2 | Pass |

Terminology is consistent for **activity**, **age range**, **demo**, **progress**, and **station**. F-5-1 records the inconsistent paid-feature terms.

## Demo and sandbox evidence

- One click on **Try it with sample data** opened `/?demo=1`.
- The first demo screen already showed ages 7–8, six named activity actions, two saved wins, two points today, and a recommended next activity. The seed contains three realistic attempts across Pattern Quarry, Key Trail, and Number Stones.
- The persistent banner says “Demo — sample data, nothing is saved” and provides **Reset demo** and **Start for real** on the board and activity routes.
- After a Pattern Quarry win, the demo changed from two to three wins. **Reset demo** restored two wins.
- A separate live check created one real win, changed the demo to three wins, selected **Start for real**, and confirmed the real station still had exactly one win. The changed demo database was discarded.
- Direct demo use writes `linux-learning-station-demo`; real use writes `linux-learning-station`. Source selection is controlled by `isDemoMode()` before every database open.
- The complete demo request log was same-origin only. No analytics, ads, chat, third-party font/script, frame, or progress request occurred.
- A fresh controlled context reloaded `/demo` offline, completed Pattern Quarry, and saved the new result.

The demo requirement passes.

## Claims execution

A clean clone at `/tmp/linux-learning-station-review5.nnFE4l` resolved to `5e147de4c6dfe40de9704b35cf745bfbd169b417`. After `npm ci`, every exact `test` command in `.factory/claims.json` ran separately and passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `six-free-activities` | `npm run test:e2e -- --grep @claim:six-free-activities` | Pass |
| `core-session-shape` | `npm run test:e2e -- --grep @claim:core-session-shape` | Pass |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | Pass |
| `installable-pwa` | `npm run test:e2e -- --grep @claim:installable-pwa` | Pass |
| `demo-sandbox` | `npm run test:e2e -- --grep @claim:demo-sandbox` | Pass |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | Pass |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | Pass |
| `erase-progress` | `npm run test:e2e -- --grep @claim:erase-progress` | Pass |
| `printable-code` | `npm run test:e2e -- --grep @claim:printable-code` | Pass |
| `input-paths` | `npm run test:e2e -- --grep @claim:input-paths` | Pass |
| `update-notice` | `npm run test:e2e -- --grep @claim:update-notice` | Pass |
| `paid-bundle` | `npm run test:e2e -- --grep @claim:paid-bundle` | Pass |
| `license-local-storage` | `npm run test:e2e -- --grep @claim:license-local-storage` | Pass |
| `license-request-privacy` | `npm run test:e2e -- --grep @claim:license-request-privacy` | Pass |
| `daily-license-check` | `npm run test:e2e -- --grep @claim:daily-license-check` | Pass |
| `age-ranges` | `npm run test:e2e -- --grep @claim:age-ranges` | Pass |
| `checkout-purchase` | `npm run test:e2e -- --grep @claim:checkout-purchase` | Pass |

The landing and README claim cross-check found no unlisted product claim:

| Claim-like copy | Manifest coverage |
| --- | --- |
| Six free activities | `six-free-activities` |
| Three guided rounds; one drawing session | `core-session-shape` |
| Offline after first visit | `offline-reload` |
| Install controls | `installable-pwa` |
| One-click isolated sample, reset, and exit | `demo-sandbox` |
| Local progress; no accounts, analytics, ads, chat, cloud profile, or outside code | `local-only` |
| Export, import, and malformed-score rejection | `json-export` |
| Erase progress | `erase-progress` |
| Printable code | `printable-code` |
| Keyboard, pointer, and touch drawing paths | `input-paths` |
| In-app update | `update-notice` |
| Five-round sessions and detailed printouts after restore | `paid-bundle` |
| Ages 5–6, 7–8, and 9–10 | `age-ranges` |
| ₹499 one-time hosted checkout and returned license | `checkout-purchase` |

Repository run/build instructions were verified directly and are not visitor outcome claims. No claim test failed and no claim remains untested.

## Earlier findings rechecked

Every earlier `.factory/review-*.md`, `.factory/polish-*.md`, and the prior handoff was read. Each earlier finding was rechecked on the live site and in source/tests.

| Earlier finding | Review 5 result |
| --- | --- |
| F-1-1 — six usable free activities | Fixed: the claim test completes every free activity without a license prompt. |
| F-1-2 — offline test proved only a shell | Fixed: an activity reloads, completes, and saves offline. |
| F-1-3 — update test did not apply an update | Fixed: a real waiting worker activates, reloads, changes controller, and replaces its cache. |
| F-1-4 — changed demo survived exit | Fixed: live exit restores the seed and preserves existing real progress. |
| F-1-5 — deep links and route shell | Fixed: valid deep links preserve the requested activity through setup; metadata and shared shell are route-specific. |
| F-1-6 — session-shape claim | Fixed: `core-session-shape` completes all guided rounds and one drawing session. |
| F-1-7 — unlisted installability | Fixed: `installable-pwa` reports a valid manifest and zero Chromium installability errors. |
| F-1-8 — unlisted age progression | Fixed: all three age ranges open distinct content. |
| F-1-9 — unstable checkout-status explanation | Fixed: the old paused-sales explanation is absent; the current checkout has separate proof. |
| F-1-10 — license verification not end to end | Fixed: the visible restore form reaches a valid response and unlocks paid outcomes. |
| F-1-11 — untested credential assertion | Fixed: the assertion remains absent. |
| F-1-12 — premature Ready offline status | Fixed: a cold load begins Online and changes only after service-worker control. |
| F-1-13 — mobile facts below the fold | Fixed: all four facts end at y=770 in a 390×844 viewport. |
| F-1-14 — trail metaphor | Fixed: board and completion navigation use activity. |
| F-1-15 — unclear section heading | Fixed: the heading is “How it works.” |
| F-1-16 — unclear price heading | Fixed: the heading names the paid feature and price; naming consistency is separately F-5-1. |
| F-1-17 — generic age controls | Fixed: each control says “Start activities for ages …”. |
| F-1-18 — inconsistent age terminology | Fixed: age range is consistent. |
| F-1-19 — unsupported adult-only implication | Fixed: README says controls are grouped under Adult tools. |
| F-1-20 — promotional sample wording | Fixed: the note names six activities and ages 7–8 sample progress. |
| F-1-21 — storage jargon before outcome | Fixed: README states the browser-local progress outcome first. |
| F-1-22 — service-worker feature jargon | Fixed for the cited feature description; F-5-3 is a separate sentence-structure issue in run instructions. |
| F-1-23 — “third-party runtime script” in README | Fixed at the cited location; README says “code loaded from other sites.” F-5-2 records the remaining landing inconsistency. |
| F-1-24 — IndexedDB demo wording | Fixed: README explains the isolation outcome. |
| F-1-25 — storage namespace jargon | Fixed: README says separate demo storage. |
| F-1-26 — “1 wins” grammar | Fixed: live checks show “1 win” and “2 wins.” |
| F-2-1 — unlisted Terms installability | Fixed: the installability claim and browser test pass. |
| F-2-2 — generic activity Start labels | Fixed: all six visible labels say “Start” plus the activity name. |
| F-3-1 — invalid activity routes returned 200 | Fixed: invalid real and demo slugs return the designed HTTP 404. |
| F-3-2 — 200% text clipped progress | Fixed: 390 px remains 390 px wide and the complete stamp stays within x=16–196. |
| F-3-3 — session-shape promise unproved | Fixed: the manifest entry and full completion test pass. |
| F-3-4 — provider-role assertions | Fixed: Dodo and merchant-of-record assertions are absent from Privacy and Terms. |
| F-3-5 — refund-handler assertion | Fixed: refund-handler wording is absent; purchase questions use support email. |
| F-3-6 — refund-revocation assertion | Fixed: refund/reversal entitlement wording is absent. |
| F-3-7 — license storage unproved | Fixed: the visible form test checks token/verdict placement and other stores. |
| F-3-8 — license child-data privacy unproved | Fixed: the captured request is GET-only, token-only, bodyless, and cookieless. |
| F-3-9 — exclusive optional-request assertion | Fixed: Privacy uses bounded statements for core and license flows. |
| F-3-10 — restore path bypassed | Fixed: the claim test uses the visible Adult tools form. |
| F-3-11 — sitemap omitted activities | Fixed: the sitemap lists six real and six demo activity routes. |
| F-4-1 — checkout test omitted amount/frequency | Fixed: the versioned offer fixture asserts INR 49,900 minor units and `one_time`, tied to the production endpoint and returned license. |
| F-4-2 — dense deploy sentence | Fixed: build, publish, and configuration instructions are separate sentences. |
| F-4-3 — “Adult tools” button lacked a verb | Fixed: the visible action says “Open adult tools.” |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, privacy, and visual identity

- The sitemap has 16 routes: root, demo, six real activities, six demo activities, Privacy, and Terms. Every listed URL returned 200.
- After application render, every checked route had one h1, one main landmark, a route-specific title, description, canonical, Open Graph/Twitter metadata, SVG favicon, and apple-touch icon.
- The root title is `Linux Learning Station — offline activities for ages 5–10`. Demo, activities, Privacy, Terms, and 404 use route-specific titles.
- Invalid real/demo activity slugs and an unknown URL returned the designed HTTP 404 with a way home, legal links, metadata, and the shared visual identity.
- Back and forward navigation restored the demo board/activity and moved focus to the new h1. The polite route announcement was present.
- Every rendered link was crawled: internal links returned 200, hosted checkout returned the expected 303, and email links were explicit `mailto:` URLs.
- Live response headers include CSP with response-header `frame-ancestors 'none'`, HSTS, `nosniff`, Referrer Policy, and Permissions Policy.
- The baseline verifier reported the correct title and language, one h1, main, complete alt handling, labelled buttons, no console errors, and a 617 ms cold load.
- Playwright Axe scans reported zero serious or critical findings on landing, demo, Adult tools, Privacy, Terms, and 404. The full test suite also covers focus, keyboard, 44 px targets, reduced motion, and 200% text.
- The built JavaScript is 35.70 KB raw / 12.46 KB gzip, below the static-product budget.
- The concrete, moss, lichen, hard-rule, and offset-shadow workbench treatment matches `.factory/design.md`. The original documented desk image and asymmetric station-board layout are distinct from a generic SaaS template.

## Quality gates

From the clean clone:

- `npm test`: passed; 4 unit tests and 34 Playwright tests.
- `npm run lint`: passed.
- `npm run build`: passed; `dist/index.html` produced.
- All 17 exact claim commands: passed separately.
- `npm ci`: 61 packages installed, zero reported vulnerabilities.

## Missed leverage

No missing AI feature is found. The brief requires an offline, account-free station for young children; a gateway-dependent assistant would weaken that job. Import/export already covers manual transfer, while automatic sync would conflict with the local-only boundary. No decorative AI feature, embedded provider key, or direct Azure endpoint was found.

## What would make this perfect

Use **workshop bundle** consistently for the paid feature, replace “third-party scripts” with the existing plain phrase “code loaded from other sites,” and split the two flagged README instructions into separate sentences. Then rerun the landing/README copy audit. No functional, demo, claim, route, privacy, accessibility, or visual defect remains in this review.
