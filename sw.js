/**
 * Warung Menu MBG — Service Worker
 * Strategy: Cache-first for assets, Network-first for HTML
 * Version: 1.0.0
 */

const CACHE_NAME = 'mbg-v1';
const OFFLINE_URL = '/index.html';

// Assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/menu.html',
  '/gizi.html',
  '/video.html',
  '/catering.html',
  '/outlet.html',
  '/merch.html',
  '/tentang.html',
  '/pesan.html',
  '/assets/shared.css',
  '/assets/shared.js',
  '/assets/data.js',
];

// External resources to cache on first use
const CACHE_FIRST_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
];

// ─── Install ────────────────────────────────────────────────────────────────

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        // Don't fail install if some assets are missing (e.g. dev environment)
        console.warn('[SW] Pre-cache partial failure (non-fatal):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch ──────────────────────────────────────────────────────────────────

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // Cache-first for Google Fonts & CDN assets
  if (CACHE_FIRST_DOMAINS.some(d => url.hostname.includes(d))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Cache-first for static assets (CSS, JS, images, fonts, video stills)
  if (
    url.pathname.startsWith('/assets/') ||
    /\.(css|js|woff2?|ttf|otf|png|jpg|jpeg|webp|gif|svg|ico)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for HTML pages (always try to get fresh content)
  if (
    request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/'
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: network with cache fallback
  event.respondWith(networkWithCacheFallback(request));
});

// ─── Strategies ─────────────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline — asset not cached', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback to offline page
    const offline = await caches.match(OFFLINE_URL);
    return offline || new Response(offlinePage(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503,
    });
  }
}

async function networkWithCacheFallback(request) {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

// ─── Offline fallback page ──────────────────────────────────────────────────

function offlinePage() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Warung Menu MBG — Offline</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, serif;
      background: #1A2456;
      color: #FBF8F0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }
    .wrap { max-width: 480px; }
    .logo {
      font-size: 2rem;
      font-style: italic;
      color: #C9A84C;
      letter-spacing: .08em;
      margin-bottom: 8px;
    }
    .sub { font-size: .85rem; letter-spacing: .2em; text-transform: uppercase; opacity: .6; margin-bottom: 32px; }
    h1 { font-size: 1.4rem; color: #C9A84C; margin-bottom: 12px; }
    p { line-height: 1.7; opacity: .8; margin-bottom: 24px; }
    a {
      display: inline-block;
      background: #C9A84C;
      color: #1A2456;
      padding: 12px 28px;
      font-family: 'Raleway', sans-serif;
      font-weight: 700;
      letter-spacing: .1em;
      text-decoration: none;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">Warung Menu MBG</div>
    <div class="sub">80 Menu Nusantara</div>
    <h1>Sedang Offline</h1>
    <p>Koneksi internet Anda terputus. Halaman ini tidak tersedia dalam cache.<br>
    Silakan periksa koneksi dan coba lagi.</p>
    <a href="/" onclick="location.reload();return false;">Coba Lagi</a>
  </div>
</body>
</html>`;
}

// ─── Background sync (catering order queue) ─────────────────────────────────

self.addEventListener('sync', event => {
  if (event.tag === 'sync-catering-order') {
    event.waitUntil(syncCateringOrders());
  }
});

async function syncCateringOrders() {
  // Retrieve queued orders from IndexedDB (if implemented client-side)
  // and POST them when back online. Placeholder for future implementation.
  console.log('[SW] Background sync: catering-order');
}

// ─── Push notifications (future) ────────────────────────────────────────────

self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Warung Menu MBG', {
      body: data.body || 'Ada info terbaru dari Warung Menu MBG!',
      icon: '/assets/icons/icon-192.png',
      badge: '/assets/icons/icon-72.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
