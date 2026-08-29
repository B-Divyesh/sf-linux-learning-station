# Linux Learning Station — review 1 handoff

- Work order: `linux-learning-station-review-1`
- Reviewed commit: `4adcd9ef7dc3a14e38436718e0d164bde0222cab`
- Live URL: <https://linux-learning-station.sociobot.in>
- Result: **FAIL**

Completed an adversarial cold-read, copy, demo sandbox, claims, history, routing/metadata, link, accessibility, privacy-request, and missed-leverage review. The full evidence and all concrete fixes are in `.factory/review-1.md`.

No product code was changed. The review found five blockers: three tagged claim tests do not prove their named outcomes, modified demo state survives **Start for real**, and fresh real activity deep links do not open the requested activity. The earlier routing/metadata/shell finding is reopened. Additional unlisted-claim and copy findings remain.

## Verification run

- Every command in `.factory/claims.json` ran separately after `npm ci` in a new temporary clone; all 11 exited 0. The review explains why three assertions are nevertheless insufficient.
- `npm test`: pass — 4 unit and 20 Playwright tests.
- `npm run lint`: pass.
- `npm run build`: pass; `dist/` produced.
- Live axe scans: zero violations on landing, demo, demo activity, Privacy, Terms, and 404.
- Live internal-link crawl: no dead internal links.
- Live demo request log: same-origin only during the tested core flow.

## Next step

Repair every `F-1-*` item in `.factory/review-1.md`, add the specified regression/claim assertions, deploy the repaired build, and run a new full review rather than a diff-only check.
