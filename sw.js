// ============================================================
// Laptop Buying Guide Expert System — Service Worker
// ============================================================

const CACHE_NAME = 'laptop-expert-v11';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/laptops/default-laptop.jpg',
  '/laptops/apple-laptop.jpg',
  '/laptops/lenovo-laptop.jpg',
  '/laptops/asus-laptop.jpg',
  '/laptops/dell-laptop.jpg',
  '/laptops/microsoft-laptop.jpg',
  '/laptops/hp-laptop.jpg',
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for local assets, network-first for external
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // For same-origin requests: cache first, then network
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Offline fallback for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          // Offline fallback for images
          if (event.request.destination === 'image') {
            return caches.match('/laptops/default-laptop.jpg');
          }
        });
      })
    );
    return;
  }

  // For external requests (CDN fonts, etc.): network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
