# Linux Learning Station — independent verification 4 handoff

- Decision: **PASS**
- Verified candidate: `89a68a5ee7a85e2d875391d48ef6d564066da0fa`
- Live product: <https://linux-learning-station.sociobot.in>
- Full evidence: [.factory/verification-4.md](verification-4.md)

The clean-install quality gates passed: all 13 required claim commands, `npm run test:unit` (4/4), `npm run lint`, `npm run build`, and `npm test` (Vitest 4/4; Playwright 24/24). The first live screen plainly identifies the offline activities, parents/teachers of ages 5–10, and the one-click sample demo.

Production byte-for-byte matches the candidate for HTML, hashed JS/CSS, worker, and manifest. The live PWA works after service-worker control when reloaded offline; live axe scans have no serious/critical issues; 390 px, keyboard focus, reduced motion, request privacy, headers, caching, and product-license rate limiting were verified. The observed license allowance is 30 requests per client window, then 429 with `Retry-After`.

No release-blocking defects remain. New ₹499 sales are intentionally paused; existing license restoration remains available. Before promoting the optional paid bundle, the factory still needs checkout registration.

Run locally:

```sh
npm ci
npm test
npm run lint
npm run build
```
