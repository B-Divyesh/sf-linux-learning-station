# Adversarial first-read review 3 — Linux Learning Station

- Work order: `linux-learning-station-review-3`
- Reviewed commit: `8b52f8e103103166e235b74006fb2e8d54bf76f4`
- Live URL: <https://linux-learning-station.sociobot.in>
- Reviewed: 2026-08-29 UTC
- Verdict: **FAIL**

The first screen is clear and the one-click demo works with isolated sample data. The review still fails because three blocking defects and eight additional findings remain. In particular, invalid activity routes bypass the designed 404, 200% text clips the demo’s progress stamp, and the earlier session-shape claim still has no matching claim entry or proof.

## Cold first read before scrolling

Fresh Chromium contexts were opened at 390×844 and 1440×900 with no shared storage or service worker.

| Question | Answer from the first screen | Exact text | Result |
| --- | --- | --- | --- |
| What does this do? | It starts offline learning activities. | “Start offline learning activities” | Clear |
| For whom? | Parents and teachers setting up a shared computer for children aged 5–10. | “For parents and teachers setting up a shared computer for children aged 5–10.” | Clear |
| What should I click first? | Open the sample station. | “Try it with sample data” | Clear |

The adjacent note says, “Opens all six activities with ages 7–8 sample progress. Nothing is saved to your real station.” At 390 px, the action and all four facts are visible before scrolling. The headline is four words, the audience sentence is 13 words, and the first action names its result. This part passes.

## Findings

### Blocking

#### F-3-1 — Invalid activity URLs bypass the designed 404 and reopen F-1-5

- Exact location: live `/activity/not-real` and `/demo/activity/not-real`; `public/staticwebapp.config.json` wildcard rewrites; `src/main.ts` `route()` fallback.
- Evidence: both invalid URLs return HTTP 200. `/activity/not-real` renders “Start offline learning activities” with canonical `https://linux-learning-station.sociobot.in/activity/not-real`; `/demo/activity/not-real` renders “Choose an activity” with the invalid URL as canonical. A general unknown route correctly returns the designed HTTP 404.
- Why this fails: the wildcard rewrites treat any activity slug as a real route, then the client silently falls back to another screen. A shared or mistyped URL therefore looks valid while showing unrelated content. Broken routing is blocking, and this is a remaining edge of the route defect previously tracked as F-1-5.
- Concrete fix: replace the two wildcard rewrites with explicit rewrites for the six valid activity slugs, or render a real route-specific not-found response for invalid slugs. Add browser checks that `/activity/not-real` and `/demo/activity/not-real` return the designed 404 and do not emit canonicals for invalid routes.

#### F-3-2 — The demo board loses content at 200% text size

- Exact location: live `/demo`, 390×844 viewport, root text size set to 200%; `.intro-block` and `.today-stamp` in `src/style.css`.
- Evidence: `document.documentElement.scrollWidth` becomes 467 px while `clientWidth` remains 390 px. The “Today / 2 / points” stamp extends to x=466.9 and is visibly clipped off the right edge.
- Why this fails: the accessibility baseline requires text to resize to 200% without loss. A low-vision phone user cannot see the complete progress summary without horizontal panning, and part of the stamp starts outside the viewport.
- Concrete fix: let `.intro-block` wrap at narrow widths or make `.today-stamp` shrink/reflow without rotation at large text sizes. Add a Playwright regression that applies 200% root text size on `/demo`, asserts `scrollWidth <= clientWidth`, and confirms the complete stamp is inside the viewport.

#### F-3-3 — The three-round/open-session claim remains unlisted and unproved, reopening F-1-6

- Exact quote/location: landing “Five guided activities have three short rounds. Drawing is one open session.”
- Evidence: `.factory/claims.json` has no session-shape claim. `@claim:six-free-activities` completes only one result in each activity; it never reaches round three in all five guided activities or proves that drawing ends as one open session.
- Why this fails: session length is a concrete expectation. Review 1 required the rewritten sentence and a tagged test; only the rewrite was completed. The history rule makes a half-fixed earlier finding blocking.
- Concrete fix: add a `core-session-shape` claim and one tagged test that completes all three rounds in each guided activity, confirms completion after round three, and confirms one saved drawing ends the drawing session. Otherwise remove the sentence.

### High

#### F-3-4 — Merchant-of-record statements are unlisted claims

- Exact quotes/locations: Adult tools “Sociobot/Dodo is the merchant of record”; Privacy “Sociobot with Dodo is the merchant of record for earlier purchases”; Terms “Sociobot/Dodo is the merchant of record for previous purchases”.
- Why this fails: this is a financial and legal fact a purchaser may rely on, but no `claims.json` entry or test verifies it.
- Concrete fix: remove the provider assertion until it can be verified, and use “For questions about an earlier purchase, email support@sociobot.in.” If retained, add a claim backed by a sandbox-safe Sociobot billing-contract check.

#### F-3-5 — Refund handling is an unlisted claim

- Exact quotes/locations: Adult tools “Refunds are handled there”; Terms “Sociobot/Dodo … handles refunds.”
- Why this fails: the UI directs purchasers to a refund channel without a listed or tested billing contract.
- Concrete fix: replace it with the actionable, support-owned sentence “For questions about an earlier purchase, email support@sociobot.in,” or add a separately tagged billing-contract test.

#### F-3-6 — Refund revocation behavior is an unlisted claim

- Exact quote/location: Terms, “A refund or charge reversal revokes the related license.”
- Why this fails: no claim or test connects a refund or reversal to an invalid license and locked bundle features.
- Concrete fix: remove the causal refund wording, or change it to “If license verification returns invalid, bundle features lock after the next check” and add a tagged test starting from a stale valid verdict, returning `valid:false`, and confirming the free three-round state.

#### F-3-7 — Browser storage of restored license data is unlisted and not tested through the UI

- Exact quote/location: Privacy, “The station stores a restored license token and its latest validity result in this browser.”
- Why this fails: the paid and daily-check tests inject the token directly with `localStorage.setItem`; neither uses the Adult tools restore form and then verifies what is stored.
- Concrete fix: add a `license-local-storage` claim and a tagged test that pastes a token through Adult tools, verifies the token and verdict keys are local, and confirms no other store receives them. Alternatively remove the implementation-specific sentence.

#### F-3-8 — The license request’s child-data privacy claim is unlisted

- Exact quote/location: Privacy, “No child activity data is included.”
- Why this fails: `local-only` records the core demo flow without license verification; `daily-license-check` counts verification calls but does not inspect their method, body, or fields after child progress exists.
- Concrete fix: add a `license-request-privacy` claim. Seed realistic progress, submit a license, capture the request, and assert that it contains only the license token and product route with no activity, age, answer, drawing, progress, or identifier payload.

#### F-3-9 — “Only optional third-party request” is unlisted

- Exact quote/location: Privacy, “License verification is the only optional third-party request.”
- Why this fails: `local-only` proves that one core flow stays same-origin, but it does not inventory optional flows or prove this exclusivity statement.
- Concrete fix: add a tagged request-log test covering Adult tools, import/export, install, license verification, and all demo activities; allow only the product origin plus the one documented Sociobot verification URL. Otherwise narrow the sentence to the tested core flow.

#### F-3-10 — “Restore in Adult tools” is not exercised by its claim test

- Exact quotes/locations: landing and README, “Existing licenses can be restored in Adult tools”; Terms, “The license may be restored on another device using its token.”
- Evidence: `@claim:paid-bundle` preloads `sb_license:linux-learning-station` in local storage. It never opens Adult tools, enters a token, or submits the visible **Verify** action.
- Why this fails: a working backend response does not prove that the user-facing restore path accepts a token and reaches that response.
- Concrete fix: change the paid-bundle test to enter the token through Adult tools in a fresh context, intercept a valid response, and then prove the five-round and detailed-print outcomes.

### Medium

#### F-3-11 — The sitemap omits all activity routes

- Exact location: live and source `sitemap.xml` list only `/`, `/demo`, `/privacy/`, and `/terms/`.
- Evidence: the product has six real `/activity/<id>` routes and six `/demo/activity/<id>` routes, all of which deep-link successfully, but none is listed.
- Why this fails: the site-structure contract requires `sitemap.xml` to list every route. The current sitemap does not describe the product’s route surface.
- Concrete fix: add the six real activity URLs and six demo activity URLs, or document and enforce a deliberate no-index rule for demo-state routes while still listing every indexable real route. Add a test comparing known route definitions with sitemap entries.

## Landing-page copy audit

Counts are whitespace-separated. Navigation, controls, headings, footer copy, and meaningful alt text are included. No item exceeds 22 words, no banned marketing word appears, terminology is consistent, and every landing action names its result. The only landing-copy failure is the unlisted session-shape claim in F-3-3.

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to activities | 3 | Pass |
| Linux Learning Station | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Online / Ready offline / Offline | 1 / 2 / 1 | Pass |
| Adult tools | 2 | Pass |
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
| Choose an age range | 4 | Pass |
| Start activities for ages 5–6 | 5 | Pass |
| Start activities for ages 7–8 | 5 | Pass |
| Start activities for ages 9–10 | 5 | Pass |
| Open the station board | 4 | Pass |
| Patterns, typing, logic, spelling, numbers, and drawing. | 7 | Pass |
| Three steps | 2 | Pass |
| How it works | 3 | Pass |
| Choose an age range. | 4 | Pass |
| Pick ages 5–6, 7–8, or 9–10. | 6 | Pass |
| Start any activity. | 3 | Pass |
| Five guided activities have three short rounds. | 7 | F-3-3 |
| Drawing is one open session. | 5 | F-3-3 |
| Keep progress locally. | 3 | Pass |
| Adults can print, export, import, or erase it. | 8 | Pass |
| Privacy | 1 | Pass |
| No child account or tracking | 5 | Pass |
| The station does not send activity progress to us. | 9 | Pass |
| It has no ads, chat, cloud profile, or third-party scripts. | 10 | Pass |
| Read the privacy details | 4 | Pass |
| Optional bundle | 2 | Pass |
| Optional activity bundle — ₹499 once | 6 | Pass |
| Adds five-round sessions and detailed printouts. | 6 | Pass |
| Every core activity stays free. | 5 | Pass |
| New licenses are not for sale now. | 7 | Pass |
| Existing licenses can be restored in Adult tools. | 8 | F-3-10 |
| Six local activities for shared Linux computers. | 7 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.2.2 | 1 | Pass |
| A rugged concrete computer desk with moss, a keyboard, paper objects, and a blank screen | 15 | Pass |

## README copy audit

Commands and code-block comments are executable documentation and are excluded. No sentence exceeds 22 words and no banned marketing adjective appears. Product terms are consistent. The restore statement is flagged under F-3-10.

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
| Apply updates from an in-app notice. | 6 | Pass |
| Keyboard, pointer, and touch paths, including keyboard-created drawing shapes | 9 | Pass |
| Setup, install, reset, legal, and license controls grouped under Adult tools | 10 | Pass |
| Six free core activities. | 4 | Pass |
| A valid ₹499 one-time workshop license adds five-round sessions and detailed week printouts. | 13 | Pass |
| A one-click `/demo` station with sample progress, Reset demo, and Start for real controls | 14 | Pass |
| Core activities have no analytics, ads, chat, child account, cloud profile, or code loaded from other sites. | 17 | Pass |
| New licenses are not for sale now. | 7 | Pass |
| Existing licenses can be restored in Adult tools. | 8 | F-3-10 |
| Try the demo | 3 | Pass |
| Open `/?demo=1`, `/demo`, or select Try it with sample data on the first screen. | 14 | Pass |
| It opens ages 7–8 sample progress without reading or changing real progress. | 12 | Pass |
| See `.factory/demo.md` for the sample data, reset behavior, and separate demo storage. | 12 | Pass |
| Run locally | 2 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Service workers are disabled in development to avoid stale local assets; test offline behavior against a production preview. | 18 | Pass |
| Test and build | 3 | Pass |
| Playwright is pinned to 1.58.2. | 5 | Pass |
| In the factory worker image its Chromium binary comes from `PLAYWRIGHT_BROWSERS_PATH`; elsewhere run `npx playwright install chromium` once if needed. | 20 | Pass |
| Deploy | 1 | Pass |
| This is a static Vite application. | 6 | Pass |
| Run `npm ci && npm run build` and publish the `dist/` directory as the site root. | 16 | Pass |
| `staticwebapp.config.json` is emitted with the build and supplies activity/demo rewrites, a designed 404 response, security headers, and immutable asset caching. | 20 | Pass |
| Project records | 2 | Pass |
| Visual system and asset provenance | 5 | Pass |
| Build handoff and verification | 4 | Pass |
| Tested product claims | 3 | Pass |
| MIT license | 2 | Pass |

Terminology is consistent: **activity**, **age range**, **demo**, **progress**, **station**, **license**, and **optional bundle** each name one concept.

## Demo and sandbox

- One click on **Try it with sample data** opens `/?demo=1`.
- The first demo screen shows ages 7–8, six named activity actions, three realistic saved attempts, “2 wins saved,” and “Today 2 points.”
- The persistent banner says “Demo — sample data, nothing is saved” and provides **Reset demo** and **Start for real**.
- After a Pattern Quarry win, progress changed from two to three wins. **Reset demo** restored two wins.
- After another change, **Start for real** returned to empty real setup; reopening `/demo` restored the original sample.
- The browser exposed only the `linux-learning-station-demo` IndexedDB database during the demo and no demo local-storage keys.
- The core demo request log was same-origin only. The independent live verifier also completed and saved Pattern Quarry after the browser was taken offline.

The demo requirement passes.

## Claims execution

A clean clone of remote `main` resolved to `8b52f8e103103166e235b74006fb2e8d54bf76f4`. After `npm ci`, every exact command in `.factory/claims.json` ran separately.

| Claim | Exact command | Result |
| --- | --- | --- |
| `six-free-activities` | `npm run test:e2e -- --grep @claim:six-free-activities` | Pass |
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
| `daily-license-check` | `npm run test:e2e -- --grep @claim:daily-license-check` | Pass |
| `age-ranges` | `npm run test:e2e -- --grep @claim:age-ranges` | Pass |
| `sales-paused` | `npm run test:e2e -- --grep @claim:sales-paused` | Pass |

No listed claim test fails. F-3-3 through F-3-10 cover unlisted or under-exercised live claims that the 14-command run cannot clear.

## Structure, links, accessibility, and visual identity

- The home title is 57 characters and follows “Product — what it does.” Demo, activity, Privacy, Terms, and 404 titles are route-specific.
- Checked valid routes have one h1, one main landmark, descriptions, canonicals, Open Graph/Twitter metadata, SVG favicon, apple-touch icon, and the shared header/footer content.
- The 1200×630 social image is present. The 404 is designed, returns HTTP 404, and links back to the station plus Privacy and Terms.
- All rendered internal links crawled returned 200. The only external rendered links are explicit `mailto:` contacts. F-3-1 covers invalid wildcard activity routes; F-3-11 covers sitemap completeness.
- Back and forward restored the demo board/activity view and focused the new h1 in five repeat checks. The polite route announcer is present.
- The live baseline verifier passed title, `lang`, h1, main, alt text, button labels, and console checks. The live Playwright axe sweep found zero serious or critical violations, and `@axe-core/cli` reported zero violations on `/`.
- Normal 390 px controls are at least 44 px and have no horizontal overflow. F-3-2 is the separate 200% text-size failure.
- The concrete, moss, black-rule, offset-shadow workbench identity matches `.factory/design.md`, uses an original documented image, and does not resemble a generic SaaS template.
- Live `index.html`, service worker, manifest, JavaScript, and CSS SHA-256 hashes match the clean-clone production build.

## Earlier findings rechecked

Every earlier review, polish report, and the handoff was read. Each earlier finding was checked against live behavior and source/tests.

| Earlier finding | Review 3 result |
| --- | --- |
| F-1-1 six usable free activities | Fixed: the tagged test opens and completes all six without a license gate. |
| F-1-2 offline activity use | Fixed: a fresh controlled context reloads, completes, and saves offline. |
| F-1-3 real update application | Fixed: the tagged test activates a real waiting worker and verifies reload/cache/controller replacement. |
| F-1-4 demo data survives exit | Fixed: live and tagged checks restore the two-win seed and leave real setup empty. |
| F-1-5 route structure | **Reopened by F-3-1:** valid deep links work, but invalid wildcard activity routes still return misleading 200 pages. |
| F-1-6 session-shape claim | **Reopened by F-3-3:** the copy was corrected, but no claim entry or complete three-round proof was added. |
| F-1-7 installability claim | Fixed: `installable-pwa` is listed and passes Chromium installability checks. |
| F-1-8 age progression | Fixed: `age-ranges` verifies distinct content for all three ranges. |
| F-1-9 sales status | Fixed: sales are plainly paused and no checkout action exists. |
| F-1-10 license verification | Fixed for a pre-stored token; F-3-10 separately identifies the untested Adult tools restore workflow. |
| F-1-11 credential statement | Fixed: the unsupported statement remains removed. |
| F-1-12 premature offline-ready status | Fixed: fresh load begins Online and changes after worker control. |
| F-1-13 mobile first-screen facts | Fixed: all four facts end above y=770 in the 844 px viewport. |
| F-1-14 trail metaphor | Fixed: current navigation says activity. |
| F-1-15 unclear section heading | Fixed: the h2 is “How it works.” |
| F-1-16 unclear price heading | Fixed: the h2 names the optional bundle and ₹499 price. |
| F-1-17 generic age actions | Fixed: each action says “Start activities for ages …”. |
| F-1-18 inconsistent age terminology | Fixed: “age range” is consistent. |
| F-1-19 false adult-only implication | Fixed: README says controls are grouped under Adult tools. |
| F-1-20 promotional demo wording | Fixed: the note names the six activities and sample progress. |
| F-1-21 storage jargon | Fixed: README leads with the user outcome. |
| F-1-22 service-worker jargon | Fixed: README describes offline pages and updates in user terms. |
| F-1-23 runtime-script jargon | Fixed: README says “code loaded from other sites.” |
| F-1-24 demo database jargon | Fixed: README describes isolation without naming IndexedDB. |
| F-1-25 namespace jargon | Fixed: README says separate demo storage. |
| F-1-26 win grammar | Fixed: one win is singular and multiple wins are plural. |
| F-2-1 unlisted installability | Fixed: claim entry and tagged installability test pass. |
| F-2-2 generic Start labels | Fixed: all six visible actions name their activity. |

## Quality gates

From the clean clone:

- `npm test`: 4 unit tests and 25 Playwright tests passed.
- `npm run lint`: passed.
- `npm run build`: passed and produced `dist/`.
- Built application JavaScript: 35.10 KB raw / 12.32 KB gzip.
- `npm audit --omit=dev`: zero vulnerabilities.
- `/opt/fleet/lib/verify-url.sh`: passed with no console errors.
- `npx @axe-core/cli`: zero violations on the live landing page.

## Missed leverage

No AI feature is warranted. The brief is for a private, offline, account-free station for young children; a gateway-dependent assistant would weaken the core job. Export/import already provides the useful manual transfer path, and automatic sync would conflict with the stated local-only boundary. No decorative AI feature, embedded provider key, or Azure endpoint was found.

## What would make this perfect

Return real 404 responses for invalid activity slugs, make the demo board reflow at 200% text size, and add proof for the three-round/open-drawing promise. Remove or test every license, merchant, refund, and third-party-request statement listed above; exercise restoration through the visible Adult tools form; and make the sitemap match the actual route inventory. Then rerun every claim command plus cold mobile, desktop, 200% text, invalid-route, request-log, and link-crawl checks. A perfect next round has zero findings.
