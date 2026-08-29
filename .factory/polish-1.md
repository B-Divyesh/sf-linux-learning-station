# Polish 1 — adversarial review repair map

Repaired review target: `4adcd9ef7dc3a14e38436718e0d164bde0222cab`. The validation build is v1.2.1. Local browser evidence: [mobile first screen](polish-1-mobile.png) and [demo board](polish-1-demo.png).

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The six-free claim now opens, completes, and returns from every free activity without a license prompt. | `@claim:six-free-activities` passes. |
| F-1-2 | The copy now says “after the first visit”; the test reloads offline, completes Pattern Quarry, and saves the result. | `@claim:offline-reload` passes. |
| F-1-3 | The update test registers a real next service worker, observes it waiting, applies it, observes controller/reload/cache replacement, and reads its marker. | `@claim:update-notice` passes. |
| F-1-4 | **Start for real** resets changed demo data before leaving; re-entering begins with the two-win sample and never touches real data. | `@claim:demo-sandbox` passes. |
| F-1-5 | First-run real activity deep links survive age selection. SPA canonical, Open Graph, Twitter, title, and description now follow each app route; legal and 404 pages have matching metadata and shared wordmark/nav/footer. | `real activity deep links…` passes; local route checks. |
| F-1-6 | The guided/drawing distinction is explicit and the statement is covered by the usable-activity test. | Landing copy; `@claim:six-free-activities`. |
| F-1-7 | Removed the untested “installable” README promise while retaining the required manifest/PWA behavior. | README and `npm run build`. |
| F-1-8 | Uses the consistent phrase “age range”; a claim test opens each range and verifies distinct guided content. | `@claim:age-ranges` passes. |
| F-1-9 | Replaced the unstable explanation with “New licenses are not for sale now” and tested that there is no checkout action. | `@claim:sales-paused` passes. |
| F-1-10 | The paid claim begins with a token and no verdict, intercepts a valid Sociobot response, then proves five rounds and detailed print output. | `@claim:paid-bundle` passes. |
| F-1-11 | Removed the untested credentials assertion from README. | README review. |
| F-1-12 | Header begins at **Online** and becomes **Ready offline** only once an active controlling service worker exists. | `demo entry and offline status…` passes. |
| F-1-13 | The four plain facts now appear immediately below the demo note, before age choices, on mobile. | `polish-1-mobile.png`; mobile claim test. |
| F-1-14 | Replaced “trail” language with “activity” on the board and completion state. | Demo screenshot and accessibility smoke test. |
| F-1-15 | The section heading is now “How it works.” | Mobile screenshot. |
| F-1-16 | The price heading is now “Optional activity bundle — ₹499 once.” | Mobile screenshot. |
| F-1-17 | Age controls now say what they do: “Start activities for ages …”. | `@claim:age-ranges` passes. |
| F-1-18 | Uses “age range” in app, print sheet, README, and Privacy. | Copy audit. |
| F-1-19 | README now says these controls are grouped under Adult tools, not access-restricted. | README review. |
| F-1-20 | Removed “ready-to-use”; the demo note names its concrete contents. | Mobile screenshot. |
| F-1-21 | README describes the user outcome rather than IndexedDB/JSON first. | README review. |
| F-1-22 | README describes offline pages and in-app updates rather than implementation pieces. | README review. |
| F-1-23 | README says “code loaded from other sites” instead of runtime-script jargon. | README review; `@claim:local-only` passes. |
| F-1-24 | README explains isolation rather than the browser database API. | README review; `@claim:demo-sandbox` passes. |
| F-1-25 | README says “separate demo storage,” with implementation detail confined to `demo.md`. | README review. |
| F-1-26 | Saved progress now uses `1 win` and `2 wins`. | Activity flow regression in `@claim:six-free-activities`. |

## Additional verification

- `npm run lint` and `npm run build` pass; deploy output is `dist/`.
- Unit tests pass (4). The focused browser accessibility sweep passes across cold setup, demo, adult tools, activity, Privacy, and Terms with no serious or critical axe findings.
- All 13 exact commands in `.factory/claims.json` were run after the final build; each passed. The full suite is also covered by the focused functional, accessibility, and claim runs recorded in `.factory/handoff.md`.
- Local route smoke checks returned 200 for `/`, `/?demo=1`, `/demo`, `/activity/patterns`, `/privacy/`, `/terms/`, and designed `/404.html`.
