# Demo sandbox

- URL: `/?demo=1` (the first-screen **Try it with sample data** button opens it). `/demo`, every `/demo/activity/*`, and `?demo=1` stay in the same isolated mode.
- Sample: an ages 7–8 station with three realistic practice attempts across Pattern Quarry, Key Trail, and Number Stones. Dates stay relative to the visit so the **Today** score remains current. The board is immediately usable and all six activities can be opened.
- Storage: demo data uses IndexedDB database `linux-learning-station-demo`. Real use uses `linux-learning-station`; the two stores are never read or written across modes.
- Reset: **Reset demo** restores the shipped sample. **Start for real** discards changed demo data, returns to `/`, and never copies sample data into real progress.
- Offline: the sample page and assets are precached by the station service worker after the first visit.
