const CACHE_NAME = 'yyc-wash-v6'; // Increment this every time you push
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  // FORCE THE UPDATE: Skip the waiting phase
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  // CLEAN UP: Delete old versions of the app from the phone
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  // TAKE CONTROL: Start serving the new files immediately
  return self.clients.claim(); 
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
