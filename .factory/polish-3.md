# Polish 3 — cumulative adversarial repair map

- Work order: `linux-learning-station-polish-3`
- Released candidate: `ba626cd6f56f9b14b882a40a5ed64d1e2b90a53e`
- Review report commit: `4d233475779382523940300c0717df7168b6de35`
- Repair commit: `b603ffb`
- Product build: `v1.2.3`
- Live URL: <https://linux-learning-station.sociobot.in>

Evidence paths used below are [the cold first screen](polish-3-live/live-cold-mobile.png), [the seeded demo](polish-3-live/live-demo-mobile.png), [the demo at 200% text](polish-3-live/live-demo-200-percent.png), [the live browser report](polish-3-live/live-check.json), [the baseline verifier](polish-3-verify/verify.json), and [Lighthouse](polish-3-lighthouse.json).

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the real completion path for all six free activities; each visible action still names its activity. | `@claim:six-free-activities`; `/demo`; demo screenshot. |
| F-1-2 | Preserved first-visit offline wording and an offline activity save, not just a shell reload. | `@claim:offline-reload`; live report `offlineActivity`. |
| F-1-3 | Preserved the real waiting-worker update lifecycle and cache/controller replacement. | `@claim:update-notice`. |
| F-1-4 | Preserved demo discard on **Start for real**, with the two-win seed restored on re-entry. | `@claim:demo-sandbox`; live report `demoIsolation`. |
| F-1-5 | Replaced activity wildcard rewrites with 12 explicit valid routes. Invalid real and demo slugs now return the designed HTTP 404; valid deep links retain route metadata and focus. | `invalid activity routes…`; live checks `/activity/not-real`, `/demo/activity/not-real`, `/activity/patterns`. |
| F-1-6 | Kept the accurate guided/drawing wording and added the missing full session proof. | `@claim:core-session-shape`; live report `sessionShape`. |
| F-1-7 | Preserved the explicit Chromium installability claim and manifest test. | `@claim:installable-pwa`; live report `installabilityErrors: []`. |
| F-1-8 | Preserved one term, **age range**, and distinct fixtures for all three ranges. | `@claim:age-ranges`; `copy-audit.md`. |
| F-1-9 | Preserved durable paused-sales copy and the absence of a checkout action. | `@claim:sales-paused`. |
| F-1-10 | Changed the paid test to restore through the visible Adult tools form before proving five rounds and detailed print. | `@claim:paid-bundle`; live report `licenseRestore`. |
| F-1-11 | Kept the unsupported embedded-credential statement removed. | README/source copy review. |
| F-1-12 | Preserved **Online** until a controlling worker is ready, then **Ready offline**. | `demo entry and offline status…`; live cold screenshot. |
| F-1-13 | Preserved the free, local, offline, and price facts before the age picker at 390×844. | `six-free-activities`; live cold screenshot. |
| F-1-14 | Preserved **activity** in the board and completion copy; no trail metaphor remains for navigation. | `@claim:six-free-activities`; `copy-audit.md`. |
| F-1-15 | Preserved the self-contained **How it works** heading. | Live cold screenshot; `copy-audit.md`. |
| F-1-16 | Preserved **Optional activity bundle — ₹499 once**. | Live cold screenshot; `copy-audit.md`. |
| F-1-17 | Preserved result-naming age actions: **Start activities for ages …**. | `@claim:age-ranges`; live cold screenshot. |
| F-1-18 | Preserved **age range** across app, print sheet, legal copy, and README. | Source scan; `copy-audit.md`. |
| F-1-19 | README still says controls are grouped under Adult tools and makes no access-control promise. | README review. |
| F-1-20 | The demo note still names the six activities and ages 7–8 sample progress without promotional wording. | `@claim:demo-sandbox`; live cold screenshot. |
| F-1-21 | README still leads with the progress outcome, printing, and export instead of browser storage jargon. | README review; export/print claims. |
| F-1-22 | README still describes saved offline pages and in-app updates in user terms. | `@claim:offline-reload`; `@claim:update-notice`. |
| F-1-23 | README still says “code loaded from other sites”; the request test proves same-origin core use. | `@claim:local-only`. |
| F-1-24 | README still explains demo isolation without exposing IndexedDB. | `@claim:demo-sandbox`; `demo.md`. |
| F-1-25 | README still uses **separate demo storage**; implementation detail remains in `demo.md`. | README and demo documentation review. |
| F-1-26 | Singular/plural progress remains value-aware. | `@claim:six-free-activities`; demo screenshot shows `2 wins saved`. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Preserved the installability claim, valid manifest, service-worker control, and zero Chromium installability errors. | `@claim:installable-pwa`; live `/terms/`. |
| F-2-2 | Preserved six visible **Start + activity name** actions at 44 px or taller. | `@claim:six-free-activities`; live report `mobileActions` and `minimumTarget: 44`. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Removed both wildcard activity rewrites, added explicit route inventory, and made local preview mirror the deployed 404 behavior. Invalid routes cannot emit their own canonicals. | `invalid activity routes…`; live `/activity/not-real` and `/demo/activity/not-real` return 404 with canonical `/404`. |
| F-3-2 | The mobile intro now stacks; the progress stamp loses rotation and fits at enlarged text. Removed slab `content-visibility` so complete captures render all six activities. | `demo board keeps all content visible at 200%…`; 200% screenshot; live geometry `390 = 390`, stamp x `16–196`. |
| F-3-3 | Added `core-session-shape` and completed all three rounds in every guided activity plus one drawing save. | `@claim:core-session-shape`; live report `sessionShape`. |
| F-3-4 | Removed every merchant-of-record statement. | Source scan; live Privacy and Terms negative assertions in `verify-live.mjs`. |
| F-3-5 | Removed every refund-handler statement and replaced it with a support email for earlier-purchase questions. | Live Adult tools, Privacy, and Terms copy checks. |
| F-3-6 | Removed the unproved refund/reversal-to-revocation statement. | Live Terms negative assertion. |
| F-3-7 | Added UI-driven proof that the restored token and verdict are the only license values in local storage and never enter demo IndexedDB or session storage. | `@claim:license-local-storage`. |
| F-3-8 | Added a seeded-progress request capture proving license verification is GET-only, token-only, bodyless, cookieless, and contains no learning data. | `@claim:license-request-privacy`. |
| F-3-9 | Narrowed Privacy copy to the tested core flow and documented the one Sociobot verification request; removed the unsupported exclusivity sentence. | `@claim:local-only`; `@claim:license-request-privacy`; live Privacy copy check. |
| F-3-10 | The paid-bundle test now pastes a token and selects **Verify license** in Adult tools before checking unlock effects. | `@claim:paid-bundle`; live report `licenseRestore`. |
| F-3-11 | Added all six real and six demo activity URLs to the sitemap and a regression that compares them with explicit deployment routes. | `invalid activity routes…`; live report `sitemap`. |

## Additional repair and local evidence

- `.factory/claims.json` now has 17 entries. A source check confirms exactly one `@claim:<id>` test per entry.
- `npm test` passes 4 unit tests and 30 Playwright tests. The suite includes axe, keyboard/focus, offline, privacy, 200% text, 404, update, import, and installability coverage.
- `npm run lint`, `npm run build`, and `npm audit --omit=dev` pass. The build emits `dist/index.html`; JavaScript is 35.17 KB raw / 12.33 KB gzip and CSS is 18.98 KB raw / 4.99 KB gzip.
- Local Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.8 s, TBT 0 ms, CLS 0.
- The workbench’s concrete, moss, lichen, heavy-rule, and offset-shadow identity is unchanged. The original documented station image remains the only hero art.
