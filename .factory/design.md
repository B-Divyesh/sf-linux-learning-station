# Visual thesis — brutalist concrete and moss

Linux Learning Station should feel like a sturdy public-library workbench reclaimed by a small patch of moss: dependable enough for an adult setting up an old computer, tactile and curious enough for a child. The interface is deliberately single-mode. Warm concrete fills the page, charcoal ink creates hard hierarchy, and living moss marks actions and progress. It avoids toy-store primaries, glass panels, generic gradients, and mascot-led decoration.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Concrete | `#E7E1D3` | Painted page background |
| Chalk | `#F7F4EA` | Raised working surfaces |
| Ink | `#1D211C` | Primary text and hard outlines |
| Weathered | `#5D6459` | Secondary copy (7.2:1 on concrete) |
| Moss | `#315C3A` | Primary action and progress |
| Moss light | `#D1E0BF` | Selected and successful surfaces |
| Lichen | `#D9B84E` | Focus, hints, and attention |
| Clay | `#A5422E` | Error and destructive action |
| Sky | `#C9DDE1` | Calm informational states |

Black 2px rules and offset shadows make controls read like physical labels fixed to concrete. Color is always paired with text, shape, or an icon. The single-mode treatment is intentional: it behaves like a shared appliance with one predictable face and keeps the canvas colors identical between home and classroom devices.

## Type and spacing

- Display: `Arial Black`, `DejaVu Sans`, sans-serif — blunt, compact, already available offline; used for the station title, activity names, and large numerals.
- Reading/interface: `Trebuchet MS`, `DejaVu Sans`, sans-serif — humanist, open forms, strong at low-resolution sizes. No downloaded font files or runtime font requests.
- Scale: 16px body, 18px utility, 22px card title, 32–48px page title, 64px activity numeral.
- Rhythm: 4px base; primary gaps are 8, 12, 16, 24, 32, and 48px. Reading measure never exceeds 70ch. Touch targets are at least 44×44px.

## Layout and interaction grammar

The home screen is a station board, not a dashboard. A narrow status rail holds adult controls, installation/offline state, and the printable progress code. The six activities are heavy paper slabs with one irregular “moss sample” illustration each. Age selection physically filters the board, and the recommended next task is marked with a lichen tab. On phones the rail and board form one column; supplementary descriptions shorten while all actions remain.

Buttons depress from a 4px offset shadow to 1px on activation. Selection uses both a moss fill and a `Selected` label. Activity transitions preserve the board’s slab shape instead of opening floating modals. Progress feedback is immediate through stamps, spoken live-region text, and an undoable recent-attempt record.

## Motion

Only state changes move: slabs rise 4px on hover, correct answers stamp in over 180ms, and the update notice enters from its screen edge over 220ms. There is no looping animation. Under `prefers-reduced-motion: reduce`, transitions and transforms are removed; hierarchy remains through outline, scale, and contrast.

## Original asset plan and provenance

- `station-hero.webp`: an original generated editorial still life of an old Linux learning desk overtaken by moss. Used once at the top of the station board to explain the product world. It is cropped responsively, has explicit dimensions, and is kept below 300 KB.
- Activity marks and all UI icons: hand-authored CSS/SVG geometric forms (tiles, keys, path nodes, letter blocks, number stones, and chalk strokes). No icon library.
- PWA icons: hand-authored SVG-derived concrete/moss station mark, exported locally to PNG.

### Image prompt sheet

**Subject:** top-down three-quarter view of a rugged recycled computer learning station, chunky beige keyboard, six small abstract learning objects, moss growing gently between concrete blocks. **World/materials:** brutalist community library, cast concrete, recycled paper, dark steel, natural moss. **Light/lens:** soft northern window light, restrained editorial product photography, 35mm lens, crisp tactile detail, no dramatic depth blur. **Palette words:** warm concrete, charcoal, forest moss, pale lichen yellow, oxidized clay. **Negative list:** no people, no faces, no text, no letters, no numerals, no logos, no watermark, no recognizable brands, no neon, no gradient, no glossy 3D toy aesthetic.

Generated with the factory image deployment (`factory-image`, Azure OpenAI image generation) on 2026-08-28. The image is original to this product. The exact prompt and generation metadata are stored beside the source image in `assets/src/station-hero.json`.
