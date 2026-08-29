# Linux Learning Station

Linux Learning Station is an installable collection of six offline learning activities for children aged 5–10. It is for a parent or teacher setting up an older shared Linux computer.

Live product: <https://linux-learning-station.sociobot.in>

## What is included

- Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook
- Three age-progressive levels: 5–6, 7–8, and 9–10
- Local IndexedDB progress, printable anonymous progress codes, and JSON export/import
- A hand-written service worker, install manifest, offline navigation fallback, and update notice
- Keyboard, pointer, and touch paths, including keyboard-created drawing shapes
- Adult-only setup, install, reset, legal, and purchase controls
- Six complete core activities for free; a ₹499 one-time workshop license adds five-round sessions and detailed week printouts
- A one-click `/demo` station with isolated sample progress, Reset demo, and Start for real controls

Core activity use has no analytics, advertising, chat, child account, cloud profile, or third-party runtime script. The optional purchase uses Sociobot’s hosted billing API; the app never embeds a payment provider.

## Try the demo

Open `/demo`, or select **Try it with sample data** on the first screen. It opens an ages 7–8 sample station in a separate IndexedDB database. See [.factory/demo.md](.factory/demo.md) for the sample, reset behavior, and storage namespace.

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
npm run lint      # TypeScript check
npm run build     # exact deploy build; writes dist/index.html
npm run preview   # serve dist locally
```

Playwright is pinned to 1.58.2. In the factory worker image its Chromium binary comes from `PLAYWRIGHT_BROWSERS_PATH`; elsewhere run `npx playwright install chromium` once if needed.

## Deploy

This is a static Vite application. Run `npm ci && npm run build` and publish the `dist/` directory as the site root. `staticwebapp.config.json` is emitted with the build and supplies activity/demo rewrites, a designed 404 response, security headers, and immutable asset caching.

The factory registers the paid product and return URL separately. The app uses the slug-based endpoint and contains no hard-coded provider product ID.

## Project records

- [Visual system and asset provenance](.factory/design.md)
- [Build handoff and verification](.factory/handoff.md)
- [Tested product claims](.factory/claims.json)
- [MIT license](LICENSE)
