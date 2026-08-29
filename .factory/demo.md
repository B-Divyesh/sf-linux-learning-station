# Demo sandbox

- URL: `/demo` (the first-screen **Try it with sample data** button opens it). `?demo=1` also enters the same isolated mode.
- Sample: an ages 7–8 station with three realistic practice attempts across Pattern Quarry, Key Trail, and Number Stones. The board is immediately usable and all six activities can be opened.
- Storage: demo data uses IndexedDB database `linux-learning-station-demo`. Real use uses `linux-learning-station`; the two stores are never read or written across modes.
- Reset: **Reset demo** restores the shipped sample. **Start for real** returns to `/` and leaves demo data separate.
- Offline: the sample page and assets are precached by the station service worker after the first visit.
