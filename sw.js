// ============================================================================
// D&D 5E SPIRE II — OFFLINE-READY PWA SERVICE WORKER (sw.js)
// Strategy: Network-First with Offline Cache Fallback (always fresh online, playable offline!)
// ============================================================================
const CACHE_NAME = 'dnd5e-spire2-pwa-v7';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './mobile.html',
  './manifest.webmanifest',
  './style.css?v=7',
  './mobile.css?v=7',
  './data.js?v=7',
  './sprites.js?v=7',
  './backgrounds.js?v=7',
  './card_art.js?v=7',
  './game.js?v=7',
  './pwa.js?v=7',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503 });
        })
      )
  );
});
