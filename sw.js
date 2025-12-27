const CACHE_NAME = 'yyc-wash-v1';
const ASSETS = [
  './',
  './index.html',
  './logo.png',
  './manifest.json'
];

// Install the manager and cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serve files from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
}
);
