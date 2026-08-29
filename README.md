# Linux Learning Station

Start six offline learning activities for children aged 5–10 on a shared Linux computer.

For parents and teachers who need a private, account-free activity station.

Live product: <https://linux-learning-station.sociobot.in>

## What it includes

- Pattern Quarry, Key Trail, Logic Bridges, Word Workshop, Number Stones, and Moss Sketchbook
- Age ranges: 5–6, 7–8, and 9–10
- Progress stays in this browser. Adults can print a code or move progress with an export file.
- Open saved pages offline after the first visit. Apply updates from an in-app notice.
- Keyboard, pointer, and touch paths, including keyboard-created drawing shapes
- Setup, install, reset, legal, and license controls grouped under Adult tools
- Six free core activities. A valid ₹499 one-time workshop license adds five-round sessions and detailed week printouts.
- A one-click `/demo` station with sample progress, Reset demo, and Start for real controls

Core activities have no analytics, ads, chat, child account, cloud profile, or code loaded from other sites. New licenses are not for sale now. Existing licenses can be restored in Adult tools.

## Try the demo

Open `/?demo=1`, `/demo`, or select **Try it with sample data** on the first screen. It opens ages 7–8 sample progress without reading or changing real progress. See [.factory/demo.md](.factory/demo.md) for the sample data, reset behavior, and separate demo storage.

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

## Project records

- [Visual system and asset provenance](.factory/design.md)
- [Build handoff and verification](.factory/handoff.md)
- [Tested product claims](.factory/claims.json)
- [MIT license](LICENSE)
