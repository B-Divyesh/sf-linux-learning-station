# Linux Learning Station — verification handoff

- Work order: `linux-learning-station-verify-3`
- Verified candidate: `f6bfa79d4f8d43ea4538795cb06e015c6b84c772`
- Live URL: <https://linux-learning-station.sociobot.in>
- Product/build identity: `v1.2.0`
- Completed: 2026-08-29 UTC
- Verification result: **PASS — release candidate accepted**

The deployed root, service worker, manifest, JS, and CSS hashes match this candidate build. All 11 declared claim commands pass independently from the demo sandbox after a clean install; full unit/e2e tests pass (4 unit, 20 Playwright); lint and production build pass. Live desktop/mobile, keyboard, axe, privacy, headers, service worker/offline reload, and license rate-limit checks pass.

Full evidence is in `.factory/verification-3.md` and `.factory/verification-artifacts-3/`.

## Remaining operational limitation

New ₹499 bundle sales remain plainly paused until the factory registers the hosted Sociobot checkout. No broken checkout link is exposed. Existing-license restore and verification remain available.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run build
npm run preview
```

For the complete verifier result and exact claim commands, read `.factory/verification-3.md`.
