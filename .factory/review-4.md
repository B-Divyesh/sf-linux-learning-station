# Adversarial first-read review 4 — Linux Learning Station

- Work order: `linux-learning-station-review-4`
- Reviewed commit: `cfb948258b4c7b77dc14b080f18d5061d25a3292`
- Live URL: <https://linux-learning-station.sociobot.in>
- Reviewed: 2026-08-30 UTC
- Verdict: **FAIL**

The cold entry and the sample station are clear and usable. This review cannot pass: the live Terms and Privacy pages have reintroduced three financial/legal assertions that review 3 required removed or independently tested. The checkout claim also does not verify its quoted amount or one-time condition. Two minor plain-language defects remain.

## Cold first read

Fresh Chromium contexts with empty storage were opened at 390 × 844 and 1440 × 900. No scroll occurred before recording the answers.

| Question | Answer | Exact first-screen evidence | Result |
| --- | --- | --- | --- |
| What does this do? | Starts offline learning activities. | “Start offline learning activities”; “Patterns, typing, logic, spelling, numbers, and drawing.” | Clear |
| For whom? | Parents and teachers setting up a shared computer for children aged 5–10. | “For parents and teachers setting up a shared computer for children aged 5–10.” | Clear |
| What should I click first? | Open the populated sample station. | “Try it with sample data”; “Opens all six activities with ages 7–8 sample progress.” | Clear |

At 390 px the primary action, its isolation note, and all four facts are visible before the age-range controls. The first screen does not create a blocking first-read finding. The live title is `Linux Learning Station — offline activities for ages 5–10`; the page has one h1 and no console errors.

## Findings

### Blocking — regressions from review 3

#### F-3-4 — Merchant/provider assertions remain unlisted

- Exact quotes and locations: `/terms/`: “Sociobot and Dodo handle checkout, payment, and refunds.” `/privacy/`: “Buying the ₹499 bundle opens checkout run by Sociobot and Dodo.”
- Evidence: neither statement has a matching entry in `.factory/claims.json`. `checkout-purchase` checks a link to the Sociobot endpoint and a synthetic checkout page; it does not establish Dodo’s contractual role or who handles payment.
- Why this fails: a purchaser may rely on these provider statements. Review 3 required their removal or a sandbox-safe billing-contract test. The live wording is a regression, not a repaired finding.
- Concrete fix: remove the provider-role assertions. Use “Buying opens hosted checkout” and direct earlier-purchase questions to `support@sociobot.in`; otherwise add an independently maintained billing-contract claim and test.

#### F-3-5 — Refund handling remains an unlisted claim

- Exact quote/location: `/terms/`: “Sociobot and Dodo handle checkout, payment, and refunds.”
- Evidence: no claim entry or test verifies a refund policy, handler, or route. The live checkout redirect only proves an HTTP 303 to a hosted checkout URL.
- Why this fails: it tells a purchaser who will handle a refund without proof. Review 3 explicitly required this claim removed or tested.
- Concrete fix: replace the sentence with “For questions about an earlier purchase, email support@sociobot.in.” Do not make a refund-handler assertion unless a test verifies the applicable billing contract.

#### F-3-6 — Refund revocation behavior remains an unlisted claim

- Exact quote/location: `/terms/`: “A refunded purchase no longer has an active license.”
- Evidence: no manifest claim or test starts from a refunded/reversed purchase and observes an invalid license and locked bundle. The license tests use synthetic valid/invalid API fixtures only.
- Why this fails: this is a specific payment-to-entitlement promise. Review 3 required it removed or proved; it is still live.
- Concrete fix: remove the causal refund statement. If it is required, add a tagged entitlement test against a billing-safe fixture that starts with a refunded purchase and observes the locked state.

### High

#### F-4-1 — The checkout claim does not prove the quoted price or one-time condition

- Exact quote/location: `.factory/claims.json`, `checkout-purchase`: “Adults can buy a ₹499 one-time workshop license through hosted Sociobot checkout and use the returned license.” The same price appears in the landing page, README, Privacy, and Terms.
- Evidence: `@claim:checkout-purchase` locates a link whose accessible name contains `₹499`, intercepts it, and fulfills it with only `<h1>Secure checkout</h1>`. It asserts a blank `GET` and a fixture return token. It never observes ₹499, a one-time purchase, or a receipt/checkout configuration. The live link returns 303 to a hosted Dodo session, but that redirect also does not prove either quantitative condition.
- Why this fails: the claims contract requires quantitative claims to assert the number in the sandbox. A changed hosted price or recurring checkout would still pass this test while the product continues to promise “₹499 once.”
- Concrete fix: either remove the exact price/one-time wording until it is contractually verifiable, or test a versioned recorded checkout fixture/receipt that explicitly contains `₹499` and a non-recurring purchase, tied to the deployed product configuration. Keep the returned-license assertion as a separate observable outcome.

### Minor

#### F-4-2 — The README deployment sentence combines four unrelated instructions

- Exact quote/location: `README.md`, Deploy: “This is a static Vite application. Run `npm ci && npm run build` and publish the `dist/` directory as the site root. `staticwebapp.config.json` is emitted with the build and supplies activity/demo rewrites, a designed 404 response, security headers, and immutable asset caching.”
- Evidence: the final sentence is 18 words after the file name is treated as one token. It bundles route rewrites, 404 handling, headers, and caching rules, and uses unexplained deployment jargon. The preceding command sentence is 15 words. This is a one-idea-per-sentence plain-words failure, not a hard-cap breach.
- Why this fails: a deployer has to unpack route rewrites, status handling, response headers, and caching rules from one dense sentence.
- Concrete fix: use separate, task-naming sentences: “Build with `npm ci && npm run build`. Publish `dist/` as the site root. `staticwebapp.config.json` defines routes, the 404 page, headers, and cache rules.”

#### F-4-3 — The visible “Adult tools” control does not name its result

- Exact quote/location: the header button on `/demo` and the station board is labelled “Adult tools.” It opens the adult-controls panel.
- Evidence: it is a `button` with `data-action="toggle-adult"`; the same product already uses the clearer footer label “Open adult tools.”
- Why this fails: this is a button, not a static section heading. A verb-led label tells a first-time visitor what selecting it does.
- Concrete fix: change the visible header label to “Open adult tools,” retaining the existing accessible label and panel behavior.

## Demo and sandbox check

- Selecting **Try it with sample data** from a fresh root opened `/?demo=1` in one click and immediately showed six realistic activities, ages 7–8 sample progress, two saved wins, and two points.
- `/demo` showed the persistent “Demo — sample data, nothing is saved” banner plus **Reset demo** and **Start for real**. The first view is a product board, not an empty setup screen.
- The declared sandbox test passed: a third demo win was discarded by **Start for real**, the real station returned to empty setup, and a later `/demo` visit restored the two-win seed.
- A fresh live core-demo flow made only same-origin requests and used only `linux-learning-station-demo` IndexedDB; localStorage and sessionStorage were empty. The offline claim test separately reloads and saves an activity after service-worker control.

No demo finding is raised.

## Claims and test execution

`npm ci` completed with the locked dependencies. All 17 commands from `.factory/claims.json` were run separately, in manifest order, from this clean checkout; each rebuilt production output and passed.

| Claim IDs | Result |
| --- | --- |
| `six-free-activities`, `core-session-shape`, `offline-reload`, `installable-pwa`, `demo-sandbox`, `local-only`, `json-export`, `erase-progress`, `printable-code` | PASS |
| `input-paths`, `update-notice`, `paid-bundle`, `license-local-storage`, `license-request-privacy`, `daily-license-check`, `age-ranges`, `checkout-purchase` | PASS |

`npm test` exercised 4 unit tests and 32 Playwright tests. `npm run lint` and `npm run build` passed; `dist/index.html` was produced. The build reports 35.65 kB JavaScript raw (12.46 kB gzip) and 18.98 kB CSS raw (5.00 kB gzip).

Passing commands do not close F-4-1: the `checkout-purchase` test is insufficient for the amount and billing-frequency words in its own claim.

## Landing-page copy audit

Counts are whitespace-separated. Headings, navigation, actions, facts, and footer text are included. No landing item exceeds 22 words, contains a banned marketing adjective, or has an unlisted landing-only claim. Claim-like landing copy is mapped to the manifest except for the insufficient price proof in F-4-1.

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to activities | 3 | Pass |
| Linux Learning Station | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Online | 1 | Pass |
| Offline activities for shared Linux computers | 6 | Pass |
| Start offline learning activities | 4 | Pass |
| For parents and teachers setting up a shared computer for children aged 5–10. | 13 | Pass |
| Try it with sample data | 5 | Pass |
| Opens all six activities with ages 7–8 sample progress. | 9 | Pass |
| Nothing is saved to your real station. | 7 | Pass |
| Six core activities are free | 5 | Pass |
| Progress stays on this computer | 5 | Pass |
| Works offline after the first visit | 6 | Pass |
| Optional bundle: ₹499 once | 4 | F-4-1 proof gap |
| Choose an age range | 4 | Pass |
| Start activities for ages 5–6 | 5 | Pass |
| Start activities for ages 7–8 | 5 | Pass |
| Start activities for ages 9–10 | 5 | Pass |
| Open the station board | 4 | Pass |
| Patterns, typing, logic, spelling, numbers, and drawing. | 7 | Pass |
| Three steps | 2 | Pass; supporting label under “How it works” |
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
| Optional activity bundle — ₹499 once | 6 | F-4-1 proof gap |
| Adds five-round sessions and detailed printouts. | 6 | Pass |
| Every core activity stays free. | 5 | Pass |
| Buy workshop bundle — ₹499 | 4 | F-4-1 proof gap |
| Opens secure Sociobot checkout. | 4 | Pass |
| After payment, return here to use the bundle. | 8 | Pass |
| Already bought it? | 3 | Pass |
| Restore the license in Adult tools. | 6 | Pass |
| Six local activities for shared Linux computers. | 7 | Pass |
| Privacy; Terms; Built by Param Factory; v1.2.4 | 8 | Pass |

## README copy audit

Commands and fenced code are excluded; all prose, headings, bullet sentences, and link labels are listed. No README sentence exceeds 22 words. F-4-2 records the density issue in its deployment paragraph.

| Copy | Words | Result |
| --- | ---: | --- |
| Linux Learning Station | 3 | Pass |
| Start six offline learning activities for children aged 5–10 on a shared Linux computer. | 14 | Pass |
| For parents and teachers who need a private, account-free activity station. | 11 | Pass |
| Live product | 2 | Pass |
| What it includes | 4 | Pass |
| Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook | 13 | Pass |
| Age ranges: 5–6, 7–8, and 9–10 | 7 | Pass |
| Progress stays in this browser. | 5 | Pass |
| Adults can print a code or move progress with an export file. | 12 | Pass |
| Open saved pages offline after the first visit. | 8 | Pass |
| Apply updates from an in-app notice. | 6 | Pass |
| Keyboard, pointer, and touch paths, including keyboard-created drawing shapes | 9 | Pass |
| Setup, install, reset, legal, and license controls grouped under Adult tools | 10 | Pass |
| Six free core activities. | 4 | Pass |
| A ₹499 one-time workshop license adds five-round sessions and detailed week printouts. | 13 | F-4-1 proof gap |
| A one-click `/demo` station with sample progress, Reset demo, and Start for real controls | 12 | Pass |
| Core activities have no analytics, ads, chat, child account, cloud profile, or code loaded from other sites. | 17 | Pass |
| Adults can buy the optional bundle through Sociobot checkout or restore a license in Adult tools. | 16 | Pass |
| Try the demo | 3 | Pass |
| Open `/?demo=1`, `/demo`, or select Try it with sample data on the first screen. | 14 | Pass |
| It opens ages 7–8 sample progress without reading or changing real progress. | 12 | Pass |
| See `.factory/demo.md` for the sample data, reset behavior, and separate demo storage. | 11 | Pass |
| Run locally | 2 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Open the local URL printed by Vite. | 7 | Pass |
| Service workers are disabled in development to avoid stale local assets. | 10 | Pass |
| Test offline behavior against a production preview. | 8 | Pass |
| Test and build | 3 | Pass |
| unit tests, production build, Playwright + axe + offline test | 8 | Pass |
| TypeScript check | 2 | Pass |
| exact deploy build; writes dist/index.html | 5 | Pass |
| serve dist locally | 3 | Pass |
| Playwright is pinned to 1.58.2. | 5 | Pass |
| In the factory worker image its Chromium binary comes from `PLAYWRIGHT_BROWSERS_PATH`. | 11 | Pass |
| Elsewhere run `npx playwright install chromium` once if needed. | 9 | Pass |
| Deploy | 1 | Pass |
| This is a static Vite application. | 6 | Pass |
| Run `npm ci && npm run build` and publish the `dist/` directory as the site root. | 15 | Pass |
| `staticwebapp.config.json` is emitted with the build and supplies activity/demo rewrites, a designed 404 response, security headers, and immutable asset caching. | 18 | F-4-2 dense multi-purpose sentence |
| Project records | 2 | Pass |
| Visual system and asset provenance | 5 | Pass |
| Build handoff and verification | 4 | Pass |
| Tested product claims | 3 | Pass |
| MIT license | 2 | Pass |

Terminology is otherwise consistent: **activity**, **age range**, **station**, **demo**, and **progress** mean the same thing throughout the landing page and README.

## History verification

Every earlier review and polish record, plus the current handoff, was read. The following is a live-and-code recheck, not reliance on the repair notes.

| Earlier finding | Status in this review | Live/code confirmation |
| --- | --- | --- |
| F-1-1 | Fixed | The focused test opens and completes all six free activities without a license gate. |
| F-1-2 | Fixed | The offline test reloads after worker control and completes/saves an activity offline. |
| F-1-3 | Fixed | The update test uses a real waiting worker and checks controller/cache replacement. |
| F-1-4 | Fixed | Modified demo data is reset on Start for real and the sample seed returns. |
| F-1-5 | Fixed | Valid deep links, route metadata, legal shell, and designed 404 are live. |
| F-1-6 | Fixed | The guided/drawing distinction has `core-session-shape` coverage. |
| F-1-7 | Fixed | Chromium manifest/installability test exists and passes. |
| F-1-8 | Fixed | “Age range” is consistent and all three ranges have tested content. |
| F-1-9 | Fixed | The former paused-sales explanation is absent; the current checkout statement is separately reviewed in F-4-1. |
| F-1-10 | Fixed | The paid-bundle flow restores through Adult tools and observes unlocked effects. |
| F-1-11 | Fixed | The unsupported credential assertion is absent. |
| F-1-12 | Fixed | Cold status begins Online and changes only after worker control. |
| F-1-13 | Fixed | Four facts are above the mobile age picker. |
| F-1-14 | Fixed | Board navigation says activity, not trail. |
| F-1-15 | Fixed | The section h2 is “How it works.” |
| F-1-16 | Fixed | The price section h2 names the optional activity bundle. |
| F-1-17 | Fixed | Age controls visibly say “Start activities for ages …”. |
| F-1-18 | Fixed | Landing, README, and legal copy use “age range.” |
| F-1-19 | Fixed | README says controls are grouped under Adult tools, not access restricted. |
| F-1-20 | Fixed | The sample note names its contents without “ready-to-use.” |
| F-1-21 | Fixed | README leads with the progress outcome, not IndexedDB. |
| F-1-22 | Fixed | README describes user-visible offline/update behavior. |
| F-1-23 | Fixed | README uses “code loaded from other sites”; request log is same-origin. |
| F-1-24 | Fixed | README describes demo isolation rather than browser-database implementation. |
| F-1-25 | Fixed | README says separate demo storage. |
| F-1-26 | Fixed | Demo starts with “2 wins saved”; pluralization is value-aware. |
| F-2-1 | Fixed | Terms’ install statement is covered by `installable-pwa`. |
| F-2-2 | Fixed | Each slab visibly says “Start” plus the activity name. |
| F-3-1 | Fixed | Invalid real/demo activity routes return HTTP 404 and the designed page. |
| F-3-2 | Fixed | 200% text at 390 px has no horizontal overflow and the stamp fits. |
| F-3-3 | Fixed | Manifest and three-round/full-session test now exist. |
| F-3-4 | **REGRESSED — blocking** | Provider/merchant assertions are again live on Terms and Privacy. |
| F-3-5 | **REGRESSED — blocking** | Terms again says Sociobot and Dodo handle refunds. |
| F-3-6 | **REGRESSED — blocking** | Terms again says a refund makes the license inactive. |
| F-3-7 | Fixed | UI-driven local-storage claim test checks token/verdict placement. |
| F-3-8 | Fixed | Seeded-progress request test checks token-only license verification. |
| F-3-9 | Fixed | Privacy now describes the documented core/optional request paths rather than an unproved exclusive request. |
| F-3-10 | Fixed | Paid flow uses the visible restore form. |
| F-3-11 | Fixed | Sitemap includes six real and six demo activity routes. |

## Structure, links, and missed leverage

- Every sitemap route returned 200 with a route-appropriate title and one h1. An unknown route and invalid activity routes returned the designed HTTP 404. Back navigation restored the board and, after render, focused its h1.
- Landing, demo, activity, Privacy, Terms, and 404 pages have canonical/OG/Twitter metadata, favicon assets, a skip link, header/footer Privacy and Terms links, and no observed console error. The live CSP is sent as a response header and includes `frame-ancestors 'none'`.
- The internal link crawl found 200 responses for live routes and a valid 303 from the hosted checkout link. `mailto:` links were explicit. The 404 skip anchor resolves to its current 404 document as expected, not to a missing navigation target.
- The concrete/moss workbench treatment, original desk image, hard rules, offset shadows, and station-board layout are distinct from a generic SaaS template.
- The brief implies offline, local-first child activities, printable progress, and movable data. Those are present. It does not imply a mandatory AI feature or cloud sync; adding either would weaken the stated privacy/offline job. No decorative or key-embedding AI feature was found.

## What would make this perfect

Remove or independently prove the three live checkout/refund assertions, make the checkout price/frequency claim genuinely observable in its test, and use the two plain-language rewrites in F-4-2 and F-4-3. Then rerun the full manifest from a clean checkout and the live legal-page cross-check. A PASS requires all five findings to be absent.
