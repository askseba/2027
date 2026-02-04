// Service Worker for Ask Seba PWA - FIXED v2 (FORCE UPDATE)
const CACHE_NAME = 'ask-seba-v4';
const urlsToCache = ['/', '/manifest.json', '/pwa-192.png', '/pwa-512.png', '/offline.html'];

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting(); // FORCE IMMEDIATE ACTIVATION
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

// Activate - AGGRESSIVE CLEANUP
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(cacheNames.map(name => name !== CACHE_NAME && caches.delete(name)))
    )
  );
  self.clients.claim(); // TAKE CONTROL IMMEDIATELY
});

// CRITICAL FETCH GUARDS FIRST
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 🔥 GUARD 1: Skip chrome-extension & non-http
  if (!/^https?:$/.test(url.protocol)) return event.respondWith(fetch(req));
  
  // 🔥 GUARD 2: Skip ALL non-GET (POST/PUT/DELETE incl auth)
  if (req.method !== 'GET') return event.respondWith(fetch(req));
  
  // 🔥 GUARD 3: Skip ALL API + Next.js dev/private
  if (url.pathname.match(/^\/(api|_\w+|__nextjs)/)) return event.respondWith(fetch(req));
  
  // 🔥 GUARD 4: Skip cross-origin
  if (url.origin !== self.location.origin) return event.respondWith(fetch(req));

  // SAFE CACHE STRATEGY (only after ALL guards pass)
  event.respondWith(
    caches.match(req).then(cached => 
      cached || fetch(req).then(resp => {
        if (resp.ok && resp.type === 'basic') {
          caches.open(CACHE_NAME).then(cache => cache.put(req, resp.clone()));
        }
        return resp;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return caches.match('/') || new Response('Offline');
      })
    )
  );
});
