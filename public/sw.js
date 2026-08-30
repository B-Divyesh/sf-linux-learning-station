const VERSION = 'station-v1.2.4';
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const CORE = ['/', '/offline.html', '/privacy/', '/terms/', '/legal.css', '/manifest.webmanifest', '/assets/station-hero.webp', '/assets/social-card.webp', '/assets/station-mark.svg', '/assets/icon-192.png', '/assets/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then(async (cache) => {
    const page = await fetch('/');
    const html = await page.clone().text();
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
    await cache.addAll([...new Set([...CORE, ...builtAssets])]);
  }));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => ![SHELL, ASSETS].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const clone = response.clone();
      caches.open(SHELL).then((cache) => cache.put(event.request, clone));
      return response;
    }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('/') || caches.match('/offline.html'))));
    return;
  }

  event.respondWith(caches.match(url.pathname, { ignoreSearch: true }).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(ASSETS).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});
