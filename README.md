# Linux Learning Station

Linux Learning Station is an installable, offline-first collection of six original mini-activities for children aged 5–10. It is designed for a parent or teacher setting up an older shared Linux computer: choose an age band, hand over the keyboard, and keep progress without creating a child account.

Live product: <https://linux-learning-station.sociobot.in>

## What is included

- Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook
- Three age-progressive levels: 5–6, 7–8, and 9–10
- Local IndexedDB progress, printable anonymous progress codes, and JSON export/import
- A hand-written service worker, install manifest, offline navigation fallback, and update notice
- Keyboard, pointer, and touch paths, including keyboard-created drawing shapes
- Adult-only setup, install, reset, legal, and purchase controls
- Six complete core activities for free; a ₹499 one-time workshop license adds five-round sessions and detailed week printouts

There is no analytics, advertising, chat, child account, cloud profile, or third-party runtime script. The optional purchase uses Sociobot’s hosted billing API; the app never embeds a payment provider.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Service workers are disabled in development to avoid stale local assets; test offline behavior against a production preview.

## Test and build

```sh
npm test          # unit tests, production build, Playwright + axe + offline test
npm run build     # exact deploy build; writes dist/index.html
npm run preview   # serve dist locally
```

Playwright is pinned to 1.58.2. In the factory worker image its Chromium binary comes from `PLAYWRIGHT_BROWSERS_PATH`; elsewhere run `npx playwright install chromium` once if needed.

## Deploy

This is a static Vite application. Run `npm ci && npm run build` and publish the `dist/` directory as the site root. The host should preserve directory indexes for `/privacy/` and `/terms/`; all learning activity routes use URL fragments and therefore need no rewrite rule.

The factory registers the paid product and return URL separately. The app uses the slug-based endpoint and contains no hard-coded provider product ID.

## Project records

- [Visual system and asset provenance](.factory/design.md)
- [Build handoff and verification](.factory/handoff.md)
- [MIT license](LICENSE)
