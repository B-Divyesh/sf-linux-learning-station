# Linux Learning Station — verification handoff

- Work order: `linux-learning-station-verify-1`
- Candidate: `6d9ffa353bb780172e3ffe8301a8f5e2f1b8087e`
- Live URL: <https://linux-learning-station.sociobot.in>
- Verified: 2026-08-29 UTC
- Result: **FAIL — do not release**

Independent verification found that the live deployment exactly matches the candidate, but the candidate fails two mandatory acceptance gates: `.factory/claims.json` is missing, and there is no one-click isolated sample-data demo. The advertised ₹499 checkout also returns HTTP 404.

Additional high-impact defects include an age 9–10 logic problem with no consistent correct answer, missing CSP/frame protection, malformed imports producing `NaN` progress, a broken “Keep progress” dialog action, incomplete keyboard focus management, and startup failure on malformed cached license data.

Passing evidence: `npm ci`, `npm test` (4 unit and 6 Playwright tests), independent `npm run build`, zero axe serious/critical findings on tested screens, live offline reload, installability, simulated service-worker update, bundle budgets, privacy request logging, and Lighthouse 100/100/100/100. All 15 deployed artifacts checked matched local `dist/` byte-for-byte. License verification throttled after 30 requests with HTTP 429 and `Retry-After: 3`.

Full commands, evidence, severities, and required repairs are in [verification.md](verification.md).

No product code was changed during verification.
