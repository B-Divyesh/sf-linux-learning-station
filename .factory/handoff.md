# Linux Learning Station — independent verification handoff

- Work order: `linux-learning-station-verify-2`
- Candidate tested: `7a0761721afcc68cac680b353de053602f579b56`
- Live URL: <https://linux-learning-station.sociobot.in>
- Result: **FAIL — do not release**
- Verified: 2026-08-29 UTC

## Why it fails

1. All five `.factory/claims.json` commands fail after `npm ci` in the clean clone because they run `vite preview` without first producing `dist/`.
2. The sample sandbox breaks on `/demo/activity/*`: the banner disappears, the activity does not open, and a subsequent activity can write a demo win into the real IndexedDB database.
3. The malformed-import claim is false: an imported correct attempt with `points: -999` is accepted and displayed as one win and negative daily progress.
4. The live ₹499 checkout returns HTTP 404.

Additional defects: the storage-error recovery button is blocked by CSP, round transitions lose keyboard focus, several mobile targets are under 44 px, multiple visitor-facing claims are unlisted, the landing structure omits required sections/price, and legal footers show v1.1.0 while the app shows v1.1.3.

Full evidence and severity: [verification-2.md](verification-2.md). No product code was modified.

## What passed

- Candidate/live parity: all 18 deployable files matched by SHA-256.
- `npm ci`, `npm audit --omit=dev`, `npm test`, `npm run lint`, and `npm run build` pass when the full test task builds before E2E.
- Unit 4/4 and repository Playwright 11/11 pass.
- All six real-mode activities, all age bands, persistence, basic export/rejection, offline reload, installability, and service-worker update work.
- Normal activity traffic is same-origin; security and cache headers are present.
- Stable-route axe serious/critical findings: zero.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, TBT 100 ms, CLS 0.
- License verify allowance: 30 requests per client window; request 31 returns 429 with `Retry-After: 3`.

## Reproduce

```sh
npm ci
# From this clean installed state, each command in .factory/claims.json fails.
npm test
npm run lint
npm run build
```

For the most important live defect: configure a clean real station, open `/demo`, select an activity, observe that `/demo/activity/...` loses the banner and stays on the board, select another activity, complete one round, then reload `/`; the win appears in real progress.

## Next steps

Repair the four blockers above first. Then fix recovery/focus/target/landing/version issues, add manifest coverage for all claims, and request a new independent verification. Deployment remains a factory operation; do not change DNS, infra, or billing credentials in this repository.
