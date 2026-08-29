# Adversarial first-read review 1 — Linux Learning Station

- Work order: `linux-learning-station-review-1`
- Reviewed commit: `4adcd9ef7dc3a14e38436718e0d164bde0222cab`
- Live URL: <https://linux-learning-station.sociobot.in>
- Reviewed: 2026-08-29 UTC
- Verdict: **FAIL**

The first read is clear and the core product works, but this review cannot pass with findings. Five blocking findings remain: three claim tests do not prove the outcome they name, demo changes survive leaving demo mode, and a fresh real activity deep link does not open that activity. The earlier site-structure finding is therefore reopened. There are also unlisted claims and copy defects.

## Cold first read before scrolling

Fresh browser contexts were used at 390×844 and 1440×900. No prior storage or service worker was shared between them.

| Question | Mobile answer | Desktop answer | Result |
| --- | --- | --- | --- |
| What does this do? | It provides offline patterns, typing, logic, spelling, number, and drawing activities. | Same. | Clear |
| For whom? | Parents and teachers setting up a shared computer for children aged 5–10. | Same. | Clear |
| What should I click first? | **Try it with sample data**. | Same. | Clear |

The exact copy that supplied those answers was “Start offline learning activities,” “For parents and teachers setting up a shared computer for children aged 5–10,” and “Try it with sample data.” The adjacent note says, “Opens a ready-to-use station with example progress. Nothing is saved to your real station.” The primary action was fully visible without scrolling at both widths. This part is not blocking.

At 390 px, however, none of the short fact lines is visible before scrolling. The first age card begins at y=725 and the facts follow all three age cards, below the 844 px viewport. This is finding F-1-13.

## Findings

### Blocking

#### F-1-1 — The six-activities claim test counts cards instead of proving six usable activities

- Quote/location: `.factory/claims.json`, `six-free-activities`: “Six core learning activities are available without a purchase.”
- Evidence: `tests/e2e/station.spec.ts` only asserts `.activity-slab` has count 6, checks horizontal overflow, and runs axe. It does not open or complete all six activities or confirm that no purchase gate blocks them.
- Why this fails: the claims contract requires the observable result, not the presence of controls. Six broken or gated cards would still pass.
- Fix: in the one tagged test, open every activity from a clean `/demo` context, complete its free path, return to the board, and assert that no purchase or license prompt blocks use.

#### F-1-2 — The offline claim test does not test installation or activity use offline

- Quote/location: landing and claims manifest: “Works offline after installation.”
- Evidence: `@claim:offline-reload` visits `/demo`, waits for the service worker, reloads offline, and checks only the board heading and the words “working offline.” It never installs the PWA and never starts, completes, or saves an activity while offline.
- Why this fails: a cached shell with broken activities would pass. The test also proves “after a first visit and service-worker reload,” not “after installation.”
- Fix: either rewrite the claim to “Works offline after the first visit” and complete/save a demo activity after `context.setOffline(true)`, or add a real installability/install test before the offline activity flow.

#### F-1-3 — The update claim test does not apply an update

- Quote/location: `.factory/claims.json`, `update-notice`: “An available app update can be applied from the in-app notice.”
- Evidence: the tagged test replaces `navigator.serviceWorker.getRegistration()` with a fake object and asserts only that `{type: 'SKIP_WAITING'}` was added to an array.
- Why this fails: it does not verify worker activation, controller change, page reload, new content, or cache replacement. A worker that ignores the message would still pass.
- Fix: serve two worker/build versions, create a real waiting worker, select **Update now**, then assert activation, controller change, reload, and replacement of the old cache/build marker.

#### F-1-4 — “Start for real” leaves modified demo data behind

- Quote/location: demo banner, **Start for real**.
- Evidence: the demo began with “2 wins saved.” After one Pattern Quarry win it showed “3 wins saved.” Selecting **Start for real** and later reopening `/demo` still showed “3 wins saved.” Code handles `start-real` with `location.assign('/')` and never clears `linux-learning-station-demo`.
- Why this fails: the demo-sandbox rule requires demo data to be discarded on leaving, unless the user explicitly chooses to keep it as real data. The banner’s “nothing is saved” is also literally inaccurate when modified demo data survives.
- Fix: clear the demo database before leaving. Extend `@claim:demo-sandbox` to change sample progress, leave with **Start for real**, revisit `/demo`, and assert the original two-win seed. Do not copy demo data to the real database.

#### F-1-5 — Real deep links and route structure are still incomplete

- Quote/location: fresh `GET /activity/patterns` returns 200 with title “Pattern Quarry — Linux Learning Station,” but renders the h1 “Start offline learning activities” and then discards the requested route when an age is chosen.
- Additional route evidence:
  - `/demo` and `/demo/activity/patterns` retain the root canonical URL, root Open Graph URL, and root Open Graph title.
  - `/privacy/` and `/terms/` have no Open Graph or Twitter metadata and use a different header structure with only “Back to Linux Learning Station.”
  - the designed 404 has no description, canonical, Open Graph/Twitter metadata, apple-touch icon, Privacy/Terms links, or version.
- History: this reopens verification-1 finding 10. That finding required deep links, route metadata, and consistent headers/footers; the repair was partial.
- Why this fails: a shared fresh URL does not open the promised activity, metadata describes the wrong route, and the standard site shell is not consistent. The review instructions make broken routing and any half-fixed earlier finding blocking.
- Fix: preserve the requested activity through first-run age selection, then open it; update canonical/OG/Twitter values on every SPA route; add route metadata to legal and 404 pages; and use the same wordmark/nav/footer skeleton everywhere.

### High

#### F-1-6 — “Each core session has three short rounds” is unlisted and false

- Quote/location: landing, How it works: “Each core session has three short rounds.”
- Evidence: `.factory/claims.json` has no three-round claim. `/demo/activity/drawing` has no round meter and **Save this drawing session** ends the session after one action.
- Why this fails: the sentence promises a consistent session shape that one of the six core activities does not have.
- Fix: rewrite it as “The five guided activities have three short rounds; drawing is one open session,” and add a tagged test, or implement three drawing rounds and test all six.

#### F-1-7 — Installability is an unlisted claim

- Quote/location: README opening: “Linux Learning Station is an installable collection of six offline learning activities for children aged 5–10.”
- Why this fails: no claims entry or tagged test checks manifest validity and browser installability.
- Fix: add an `installable-pwa` claim and test Chromium’s manifest/installability results from a fresh demo context, or remove “installable.”

#### F-1-8 — Age progression is an unlisted claim

- Quote/location: README, What is included: “Three age-progressive levels: 5–6, 7–8, and 9–10.”
- Why this fails: no claims entry proves that all three levels exist and change activity content. “Age-progressive” says more than three selectors are present.
- Fix: add a tagged `age-levels` test that selects each range and verifies distinct, age-appropriate fixtures in all applicable activities; otherwise say only “Age ranges: 5–6, 7–8, and 9–10.”

#### F-1-9 — The checkout-status explanation is an unlisted external claim

- Quote/location: README: “New bundle sales are paused because the factory’s hosted checkout is not registered.”
- Why this fails: no claims entry checks the current checkout state, and the stated external cause can change independently of this build.
- Fix: use the durable copy “New licenses are not for sale now,” and add a tagged UI test confirming there is no purchase action while the paused notice is shown. Do not state the external cause unless it is continuously verified.

#### F-1-10 — Existing-license verification is not proved end to end

- Quote/location: README: “Existing licenses still verify through Sociobot.”
- Evidence: `daily-license-check` proves at-most-once request frequency but does not assert that a valid response unlocks the product. `paid-bundle` bypasses verification by writing a valid cached verdict directly.
- Why this fails: the two tests leave the sentence’s actual promise untested.
- Fix: add a tagged test that starts with a stored token and no cached verdict, intercepts a valid Sociobot response, and observes the unlocked five-round/print state.

#### F-1-11 — The no-embedded-credentials statement is unlisted

- Quote/location: README, Deploy: “The app contains no payment-provider credentials or hard-coded provider product ID.”
- Why this fails: this is a security statement a deployer can rely on, but no claims entry or automated built-output scan covers it.
- Fix: add a tagged source/bundle scan for credential patterns, Azure endpoints, provider keys, and hard-coded provider IDs, or remove the assertion.

#### F-1-12 — “Ready offline” is shown before offline readiness is known

- Quote/location: header status on a first visit: “Ready offline.”
- Evidence: rendering chooses this text solely from `navigator.onLine`; it does not check service-worker control or successful cache population. A fresh online context displays it before the worker controls the page.
- Why this fails: network connectivity is not offline readiness.
- Fix: show “Online” until the worker is active, controlling the page, and required assets are cached; then show “Ready offline.” Add a state-transition test.

### Medium and minor copy findings

#### F-1-13 — The required plain facts are not on the mobile first screen

- Location: landing at 390×844.
- Evidence: “Six core activities are free,” “Progress stays on this computer,” “Works offline after installation,” and the price all appear below three 116 px age cards; none is visible before scrolling.
- Why this fails: the mandatory first-screen shape calls for three short privacy/offline/price facts.
- Fix: move three concise facts directly below the sample-data note on mobile, before the age picker and image.

#### F-1-14 — The demo h1 is a metaphor

- Quote/location: `/demo`: “Choose today’s trail.” Related controls say “Trail complete” and “Choose another trail.”
- Why this fails: “trail” does not name the thing being chosen and conflicts with the product’s usual term, “activity.”
- Fix: use “Choose an activity,” “Activity complete,” and “Choose another activity.”

#### F-1-15 — “Start in three steps” is not a self-contained section heading

- Quote/location: landing h2: “Start in three steps.”
- Why this fails: in a heading list it does not say what the section explains. The useful label “How it works” is only an eyebrow paragraph.
- Fix: make the h2 “How it works” and use “Three steps” only as supporting text if needed.

#### F-1-16 — “₹499 one time” is not a self-contained section heading

- Quote/location: landing h2: “₹499 one time.”
- Why this fails: a screen-reader heading list does not identify what costs ₹499.
- Fix: use “Optional activity bundle — ₹499 once.”

#### F-1-17 — Age buttons do not name their result

- Quote/location: first-screen buttons: “Ages 5–6 — First steps,” “Ages 7–8 — Growing skills,” and “Ages 9–10 — Bigger challenges.”
- Why this fails: selecting one immediately completes setup and opens the board, but the labels read like categories rather than actions.
- Fix: use “Start ages 5–6 activities,” “Start ages 7–8 activities,” and “Start ages 9–10 activities.”

#### F-1-18 — The same setting has three names

- Quotes/locations: landing “practice level,” README “age-progressive levels,” and Privacy “age band.”
- Why this fails: a parent should not have to infer that all three refer to the same choice.
- Fix: use “age range” everywhere.

#### F-1-19 — “Adult-only” implies a restriction that does not exist

- Quote/location: README: “Adult-only setup, install, reset, legal, and license-restore controls.”
- Evidence: **Adult tools** opens without a PIN, age check, or other access control.
- Why this fails: “adult-only” can be read as access protection rather than intended audience.
- Fix: “Setup, install, reset, legal, and license controls grouped under Adult tools.”

#### F-1-20 — “Ready-to-use” is unnecessary promotional wording

- Quote/location: landing action note: “Opens a ready-to-use station with example progress.”
- Why this fails: “ready-to-use” does not add a verifiable detail.
- Fix: “Opens all six activities with ages 7–8 sample progress.”

#### F-1-21 — The first feature list uses unexplained storage jargon

- Quote/location: README: “Local IndexedDB progress, printable anonymous progress codes, and JSON export/import.”
- Why this fails: “IndexedDB” and “JSON” describe implementation/file formats before the user outcome.
- Fix: “Progress stays in this browser. Adults can print a code or move progress with an export file.”

#### F-1-22 — The README feature list is implementation jargon rather than a usable benefit

- Quote/location: README: “A hand-written service worker, install manifest, offline navigation fallback, and update notice.”
- Why this fails: a first-time reader cannot use “service worker,” “manifest,” or “navigation fallback” to decide whether the product helps.
- Fix: “Install it from the browser, open saved pages offline, and apply updates from an in-app notice.”

#### F-1-23 — “Third-party runtime script” is unnecessary jargon

- Quote/location: README: “Core activity use has no analytics, advertising, chat, child account, cloud profile, or third-party runtime script.”
- Why this fails: “runtime script” is developer terminology in a user-facing privacy summary.
- Fix: “Core activities have no analytics, ads, chat, child account, cloud profile, or code loaded from other sites.”

#### F-1-24 — The demo instructions expose storage implementation details

- Quote/location: README: “It opens an ages 7–8 sample station in a separate IndexedDB database.”
- Why this fails: the useful fact is isolation, not the browser database API.
- Fix: “It opens ages 7–8 sample progress without reading or changing your real progress.”

#### F-1-25 — “Storage namespace” is unexplained jargon

- Quote/location: README: “See .factory/demo.md for the sample, reset behavior, and storage namespace.”
- Why this fails: readers need to know where demo data is isolated, but “namespace” is not explained.
- Fix: “See .factory/demo.md for the sample data, reset behavior, and separate demo storage.”

#### F-1-26 — Singular progress uses plural grammar

- Quote/location: station board after one successful real activity: “1 wins saved.”
- Why this fails: it is visible progress feedback and reads as unfinished copy.
- Fix: pluralize from the value: “1 win saved” and “2 wins saved.” Add a regression assertion for both forms.

## Landing-page copy audit

Counts use whitespace-separated words. This table includes headings, controls, navigation, footer copy, and meaningful image alt text so short fragments are not hidden from the audit. No item exceeds 22 words and no banned plain-words term appears.

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to activities | 3 | — |
| Linux Learning Station | 3 | — |
| Demo | 1 | — |
| Privacy | 1 | — |
| Ready offline | 2 | F-1-12 |
| Offline activities for shared Linux computers | 6 | — |
| Start offline learning activities | 4 | — |
| For parents and teachers setting up a shared computer for children aged 5–10. | 13 | — |
| Try it with sample data | 5 | — |
| Opens a ready-to-use station with example progress. | 7 | F-1-20 |
| Nothing is saved to your real station. | 7 | F-1-4 |
| Which practice level fits best? | 5 | F-1-18 |
| Ages 5–6 — First steps | 5 | F-1-17 |
| Ages 7–8 — Growing skills | 5 | F-1-17 |
| Ages 9–10 — Bigger challenges | 5 | F-1-17 |
| Six core activities are free | 5 | F-1-1 |
| Progress stays on this computer | 5 | — |
| Works offline after installation | 4 | F-1-2 |
| Optional bundle: ₹499 once | 4 | — |
| Patterns, typing, logic, spelling, numbers, and drawing. | 7 | F-1-1 |
| How it works | 3 | — |
| Start in three steps | 4 | F-1-15 |
| Choose a practice level. | 4 | F-1-18 |
| Pick ages 5–6, 7–8, or 9–10. | 6 | — |
| Start any activity. | 3 | — |
| Each core session has three short rounds. | 7 | F-1-6 |
| Keep progress locally. | 3 | — |
| Adults can print, export, import, or erase it. | 8 | — |
| Privacy | 1 | — |
| No child account or tracking | 5 | — |
| The station does not send activity progress to us. | 9 | — |
| It has no ads, chat, cloud profile, or third-party scripts. | 10 | — |
| Read the privacy details | 4 | — |
| Optional bundle | 2 | — |
| ₹499 one time | 3 | F-1-16 |
| Adds five-round sessions and detailed printouts. | 6 | — |
| Every core activity stays free. | 5 | — |
| New sales are paused. | 4 | F-1-9 |
| Existing licenses can be restored in Adult tools. | 8 | F-1-10 |
| Six local activities for shared Linux computers. | 7 | — |
| Built by Param Factory | 4 | — |
| A rugged concrete computer desk with moss, a keyboard, paper objects, and a blank screen | 15 | — |

## README copy audit

Commands and code blocks are executable syntax, not sentences, and are excluded. Necessary tool/file names in the run, test, and deploy instructions are retained unless the surrounding sentence is itself flagged. No sentence exceeds 22 words and no banned term appears.

| Copy | Words | Flag |
| --- | ---: | --- |
| Linux Learning Station | 3 | — |
| Linux Learning Station is an installable collection of six offline learning activities for children aged 5–10. | 16 | F-1-7 |
| It is for a parent or teacher setting up an older shared Linux computer. | 14 | — |
| Live product: https://linux-learning-station.sociobot.in | 3 | — |
| What is included | 3 | — |
| Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook | 13 | — |
| Three age-progressive levels: 5–6, 7–8, and 9–10 | 7 | F-1-8, F-1-18 |
| Local IndexedDB progress, printable anonymous progress codes, and JSON export/import | 10 | F-1-21 |
| A hand-written service worker, install manifest, offline navigation fallback, and update notice | 12 | F-1-22 |
| Keyboard, pointer, and touch paths, including keyboard-created drawing shapes | 9 | — |
| Adult-only setup, install, reset, legal, and license-restore controls | 8 | F-1-19 |
| Six complete core activities for free; a valid ₹499 one-time workshop license adds five-round sessions and detailed week printouts | 19 | F-1-1 |
| A one-click /demo station with isolated sample progress, Reset demo, and Start for real controls | 15 | F-1-4 |
| Core activity use has no analytics, advertising, chat, child account, cloud profile, or third-party runtime script. | 16 | F-1-23 |
| New bundle sales are paused because the factory’s hosted checkout is not registered. | 13 | F-1-9 |
| Existing licenses still verify through Sociobot. | 6 | F-1-10 |
| Try the demo | 3 | — |
| Open /demo, or select Try it with sample data on the first screen. | 13 | — |
| It opens an ages 7–8 sample station in a separate IndexedDB database. | 12 | F-1-24 |
| See .factory/demo.md for the sample, reset behavior, and storage namespace. | 10 | F-1-25 |
| Run locally | 2 | — |
| Requires Node.js 20 or newer. | 5 | — |
| Open the local URL printed by Vite. | 7 | — |
| Service workers are disabled in development to avoid stale local assets; test offline behavior against a production preview. | 18 | — |
| Test and build | 3 | — |
| Playwright is pinned to 1.58.2. | 5 | — |
| In the factory worker image its Chromium binary comes from PLAYWRIGHT_BROWSERS_PATH; elsewhere run npx playwright install chromium once if needed. | 20 | — |
| Deploy | 1 | — |
| This is a static Vite application. | 6 | — |
| Run npm ci && npm run build and publish the dist/ directory as the site root. | 16 | — |
| staticwebapp.config.json is emitted with the build and supplies activity/demo rewrites, a designed 404 response, security headers, and immutable asset caching. | 20 | — |
| The factory must register the paid product and return URL before re-enabling new sales. | 14 | F-1-9 |
| The app contains no payment-provider credentials or hard-coded provider product ID. | 11 | F-1-11 |
| Project records | 2 | — |
| Visual system and asset provenance | 5 | — |
| Build handoff and verification | 4 | — |
| Tested product claims | 3 | — |
| MIT license | 2 | — |

## Demo and sandbox evidence

- One click from the landing page opens `/demo`.
- The first demo screen already shows six activities, ages 7–8, realistic attempts, “2 wins saved,” and a “Today 2 points” stamp.
- The persistent banner is present on `/demo` and `/demo/activity/patterns` with **Reset demo** and **Start for real**.
- **Reset demo** restored the two-win sample after a new attempt.
- A separate live check created one real win, changed demo progress, and returned to real mode; real mode still showed exactly one win. The demo and real IndexedDB data are isolated.
- All observed demo-flow requests were same-origin. No analytics, ads, third-party scripts, child-progress request, or embedded frame was observed.
- Blocking exception: modified demo data survived leaving and reopening demo, as recorded in F-1-4.

## Claims execution

The repository was cloned into a new temporary directory, followed by `npm ci`. Every exact command from `.factory/claims.json` was then run separately. All commands exited 0, but F-1-1 through F-1-3 identify claims that their assertions do not actually prove.

| Claim id | Exact command | Exit result | Review result |
| --- | --- | ---: | --- |
| six-free-activities | `npm run test:e2e -- --grep @claim:six-free-activities` | 0 | Inadequate assertion; F-1-1 |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | 0 | Inadequate/mismatched assertion; F-1-2 |
| demo-sandbox | `npm run test:e2e -- --grep @claim:demo-sandbox` | 0 | Test passes; leaving-demo gap is F-1-4 |
| local-only | `npm run test:e2e -- --grep @claim:local-only` | 0 | Verified |
| json-export | `npm run test:e2e -- --grep @claim:json-export` | 0 | Verified |
| erase-progress | `npm run test:e2e -- --grep @claim:erase-progress` | 0 | Verified |
| printable-code | `npm run test:e2e -- --grep @claim:printable-code` | 0 | Verified |
| input-paths | `npm run test:e2e -- --grep @claim:input-paths` | 0 | Verified |
| update-notice | `npm run test:e2e -- --grep @claim:update-notice` | 0 | Inadequate assertion; F-1-3 |
| paid-bundle | `npm run test:e2e -- --grep @claim:paid-bundle` | 0 | Verified |
| daily-license-check | `npm run test:e2e -- --grep @claim:daily-license-check` | 0 | Verified |

Unlisted claim findings are F-1-6 through F-1-11. Instructions such as required Node/npm commands and repository implementation descriptions that are directly confirmed by the build are treated as developer instructions, not visitor outcome claims.

## Earlier findings rechecked

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read the handoff and all three verification reports because they contain the repository’s earlier findings.

| Earlier finding | Live and code result |
| --- | --- |
| Verification 1 #1, missing claims | Fixed: 11 entries and tagged tests exist. |
| Verification 1 #2, no demo | Fixed except the newly identified leave/discard gap in F-1-4. |
| Verification 1 #3, broken checkout | Fixed honestly: no purchase link is exposed and sales are marked paused. |
| Verification 1 #4, invalid logic round | Fixed; the age 9–10 round is consistent and the regression test passes. |
| Verification 1 #5, security configuration | Fixed; live CSP and required headers are present. |
| Verification 1 #6, malformed imports | Fixed; incomplete and negative-point fixtures are rejected. |
| Verification 1 #7, reset dialog | Fixed; **Keep progress** closes it. |
| Verification 1 #8, keyboard/focus | Fixed for the cited drawer, import, targets, title, and route-focus cases. |
| Verification 1 #9, corrupt license cache | Fixed; startup survives corrupt cached JSON. |
| Verification 1 #10, routing/metadata/shell | **Reopened as F-1-5**: the repair is partial. |
| Verification 1 #11, static caching | Fixed; hashed assets are immutable and the worker is no-cache. |
| Verification 1 #12, copy artifact/typing boundary | Fixed for the cited missing artifact and exact-typing behavior. |
| Verification 2 #1, claim commands need a build | Fixed; each command invokes `pretest:e2e` and passed from the new clone. |
| Verification 2 #2, demo route contamination | Fixed; activity routes retain demo mode and real data stayed unchanged. |
| Verification 2 #3, negative-score import | Fixed. |
| Verification 2 #4, then-unlisted claims | Fixed for the exact claims named there; current unlisted claims are in F-1-6 through F-1-11. |
| Verification 2 #5, broken purchase | Fixed by pausing new sales and removing the broken action. |
| Verification 2 #6, CSP-blocked recovery | Fixed. |
| Verification 2 #7, round focus | Fixed; the new task slab receives focus. |
| Verification 2 #8, 44 px targets | Fixed for the cited controls. |
| Verification 2 #9, landing skeleton | Fixed structurally; mobile fact placement remains F-1-13. |
| Verification 2 #10, build identity | Fixed at v1.2.0. |

## Structure, accessibility, and visual checks

- `/`, `/demo`, both activity-route forms, `/privacy/`, and `/terms/` return 200. An unknown route returns the designed 404 with status 404.
- All crawled internal links returned 200; explicit `mailto:` links were excluded from HTTP crawling.
- Back and forward navigation between `/demo` and `/demo/activity/patterns` restored the right view, focused the h1, and announced “Page changed.”
- Live axe scans at mobile width found no violations on landing, demo, demo activity, Privacy, Terms, or 404.
- Every checked route has one h1 and a main landmark. The route metadata and shared-shell exceptions are in F-1-5.
- The concrete, moss, offset-shadow, editorial-workbench treatment is recognizably product-specific and matches `.factory/design.md`; it is not a generic gradient-card SaaS template.
- `npm test` passed 4 unit and 20 Playwright tests. `npm run lint` and `npm run build` passed; `dist/` was produced. JavaScript is 33.92 KB raw / 12.01 KB gzip.

## Missed leverage

No AI feature is warranted. The job is a private, offline activity station for young children; gateway-dependent generation would weaken that job. Import/export already covers the obvious device-transfer need, and automatic sync would conflict with the brief’s local, account-free boundary. No decorative AI feature or embedded provider key was found.

## What would make this perfect

Resolve every finding above, then rerun the review from fresh mobile and desktop contexts. In particular: make claim tests prove actual use, discard changed demo state on exit, preserve real activity deep links through setup, complete per-route metadata and the shared shell, remove or test every unlisted claim, move facts into the mobile first screen, and replace metaphor/jargon with the proposed copy. A perfect next round has zero findings and no claim accepted only because a control exists.
