const CACHE_NAME = 'startup-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/favicon.ico'
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline essentials...');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Pre-caching some assets failed, proceeding anyway:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: handle offline mode for both static assets and APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // If it's an API request, use Network-First strategy and cache successful responses
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, clone and put in cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, look in cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving cached API response offline:', url.pathname);
              return cachedResponse;
            }
            // Fallback for document fetch if entirely uncached and offline
            if (url.pathname === '/api/sources') {
              return new Response(JSON.stringify([
                {
                  id: "offline-fallback",
                  name: "offline_cached_vault_index.md",
                  content: "YOU ARE CURRENTLY VIEWING AN OFFLINE SNAPSHOT. New document uploads and active AI processing require an active network connection. Please check your internet connectivity.",
                  clusterId: 1,
                  uploadedAt: new Date().toISOString()
                }
              ]), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            // Fallback for chat if offline
            if (url.pathname === '/api/chat') {
              return new Response(JSON.stringify({
                text: "### Connectivity Offline\n\nThe AI Workspace is currently running in **restricted offline mode**. Your active queries cannot be processed by the server until internet connection is re-established.\n\n*Please restore your connection to converse with the grounded neural models.*",
                tokens: { input: 0, output: 0, total: 0 },
                citations: [],
                model: "Offline Gateway Fallback"
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            // Fallback for user status if offline
            if (url.pathname === '/api/user-status') {
              return new Response(JSON.stringify({
                status: "approved",
                email: "offline@startup.ai",
                trialExpiresAt: Date.now() + 3600000
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            return new Response(JSON.stringify({ error: "Offline mode active. Request failed." }), {
              status: 503,
              statusText: "Service Unavailable (Offline)",
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Static assets: Stale-While-Revalidate strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.log('[SW] Fetch failed, fallback to cache for:', url.pathname, err);
        });

      return cachedResponse || fetchPromise;
    })
  );
});
