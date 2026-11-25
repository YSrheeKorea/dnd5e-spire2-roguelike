// ============================================================================
// D&D 5E SPIRE II — OFFLINE-READY PWA SERVICE WORKER (sw.js)
// Strategy: Network-First with Offline Cache Fallback (always fresh online, playable offline!)
// ============================================================================
const CACHE_NAME = 'dnd5e-spire2-pwa-v15';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './mobile.html',
  './manifest.webmanifest',
  './manifest-mobile.webmanifest',
  './style.css?v=15',
  './mobile.css?v=15',
  './data.js?v=15',
  './sprites.js?v=15',
  './story.js?v=15',
  './backgrounds.js?v=15',
  './card_art.js?v=15',
  './achievements.js?v=15',
  './game.js?v=15',
  './pwa.js?v=15',
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
            return caches.match(url.pathname.includes('mobile') ? './mobile.html' : './index.html');
          }
          return new Response('Offline', { status: 503 });
        })
      )
  );
});
