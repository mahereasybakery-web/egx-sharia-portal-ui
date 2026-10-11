// EGX Sharia Portal - Network-First Ultra-Fresh Service Worker (v14.0)
const CACHE_NAME = 'egx-sharia-portal-v14.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/data-reports.js?v=20261011_v14',
  './js/data-news.js?v=20261011_v14',
  './js/data-valuation.js?v=20261011_v14',
  './js/data-ai-prompts.js?v=20261011_v14',
  './js/app.js?v=20261011_v14',
  './js/gemini-ai.js?v=20261011_v14',
  './js/universal-export.js?v=20261011_v14',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// STRICT NETWORK-FIRST STRATEGY WITH NO-STALE-DATA ENFORCEMENT
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // STRICT RULE: Market data & dynamic live sync requests must NEVER return stale cached data when offline
  const isMarketData = url.pathname.endsWith('market_data.json') || url.searchParams.has('cb') || url.pathname.includes('/scanner');

  if (isMarketData) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          return response;
        })
        .catch(() => {
          // EXPLICIT OFFLINE 503 RESPONSE - Never serve stale cached prices
          return new Response(
            JSON.stringify({
              error: 'NETWORK_OFFLINE',
              message: 'لا يوجد اتصال بالإنترنت حالياً — تعذر جلب الأسعار اللحظية. لم يتم استدعاء نسخ قديمة منعاً لتضليل الأرقام.',
              is_offline: true,
              timestamp: new Date().toISOString()
            }),
            {
              status: 503,
              statusText: 'Service Unavailable - Offline',
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Portal-Offline': 'true',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
              }
            }
          );
        })
    );
    return;
  }

  // Shell assets (HTML, CSS, JS, Images): Network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data && event.data.action === 'clearCache') {
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    });
  }
});
