// Ultra-optimized Service Worker for lightning-fast loading

const CACHE_VERSION = 'v3'; // INCREMENT THIS ON EACH DEPLOYMENT
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;

// Cache duration in milliseconds
const CACHE_DURATION = {
  static: 30 * 24 * 60 * 60 * 1000, // 30 days
  dynamic: 7 * 24 * 60 * 60 * 1000, // 7 days
  images: 30 * 24 * 60 * 60 * 1000, // 30 days
  api: 5 * 60 * 1000, // 5 minutes
};

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
];

// Install event - cache static assets and force update
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Force immediate activation
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches and take control immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete ALL old caches
            return name.startsWith('static-') || 
                   name.startsWith('dynamic-') || 
                   name.startsWith('images-') || 
                   name.startsWith('api-');
          })
          .filter((name) => {
            // Keep only current version
            return name !== STATIC_CACHE && 
                   name !== DYNAMIC_CACHE && 
                   name !== IMAGE_CACHE && 
                   name !== API_CACHE;
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Taking control of all clients');
      // Take control of all pages immediately
      return self.clients.claim();
    })
    // REMOVED: Auto-reload message that was causing refresh loops
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip service worker entirely in development
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return; // Let browser handle normally
  }

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Skip large media files that might cause partial responses (206)
  if (url.pathname.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac|mov|avi|mkv)$/i)) {
    // Let browser handle media files directly without caching
    return;
  }

  // API requests - network first, cache fallback with timeout
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Image requests - cache first, network fallback
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Static assets - cache first, network fallback
  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // HTML pages - network first, cache fallback
  if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
    return;
  }

  // Default - network first, cache fallback
  event.respondWith(handleDefaultRequest(request));
});

// Handle API requests - network first with timeout, cache fallback
async function handleAPIRequest(request) {
  const TIMEOUT = 3000; // 3 seconds timeout

  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), TIMEOUT)
      )
    ]);

    // Only cache successful, complete API responses
    if (response.ok && response.status === 200 && response.type !== 'opaque') {
      try {
        const cache = await caches.open(API_CACHE);
        await cache.put(request, response.clone());
      } catch (cacheError) {
        console.log('[SW] API cache put failed:', cacheError.message);
      }
    }

    return response;
  } catch (error) {
    // Try cache on network failure or timeout
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Serving API from cache:', request.url);
      return cached;
    }

    // Return error response
    return new Response(JSON.stringify({ error: 'Network error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle image requests - cache first, network fallback
async function handleImageRequest(request) {
  const cached = await caches.match(request);
  
  if (cached) {
    // Check if cache is still fresh
    const cacheTime = await getCacheTime(IMAGE_CACHE, request.url);
    if (cacheTime && Date.now() - cacheTime < CACHE_DURATION.images) {
      return cached;
    }
  }

  try {
    const response = await fetch(request);
    
    // Only cache successful, complete image responses
    if (response.ok && response.status === 200 && response.type !== 'opaque') {
      try {
        const cache = await caches.open(IMAGE_CACHE);
        await cache.put(request, response.clone());
        await setCacheTime(IMAGE_CACHE, request.url);
      } catch (cacheError) {
        console.log('[SW] Image cache put failed:', cacheError.message);
      }
    }

    return response;
  } catch (error) {
    if (cached) return cached;
    
    // Return placeholder image
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect fill="#ddd" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image unavailable</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle static asset requests - cache first
async function handleStaticRequest(request) {
  const cached = await caches.match(request);
  
  if (cached) return cached;

  try {
    const response = await fetch(request);
    
    // Only cache successful, complete responses
    if (response.ok && response.status === 200 && response.type !== 'opaque') {
      try {
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, response.clone());
      } catch (cacheError) {
        console.log('[SW] Static cache put failed:', cacheError.message);
      }
    }

    return response;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

// Handle document requests - network first, cache fallback
async function handleDocumentRequest(request) {
  try {
    const response = await fetch(request);
    
    // Only cache successful, complete HTML responses
    if (response.ok && response.status === 200 && response.type !== 'opaque') {
      try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(request, response.clone());
      } catch (cacheError) {
        console.log('[SW] Document cache put failed:', cacheError.message);
      }
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return offline page
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) return offlinePage;

    return new Response('Offline', { status: 503 });
  }
}

// Handle default requests
async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);
    
    // Only cache successful, complete responses (not partial content)
    if (response.ok && response.status === 200 && response.type !== 'opaque') {
      try {
        const cache = await caches.open(DYNAMIC_CACHE);
        // Clone the response before caching to avoid consuming the stream
        await cache.put(request, response.clone());
      } catch (cacheError) {
        // Silently fail cache operations - don't break the response
        console.log('[SW] Cache put failed:', cacheError.message);
      }
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  return /\.(js|css|woff2?|ttf|eot|svg|ico)$/.test(pathname);
}

// Cache timestamp helpers
async function getCacheTime(cacheName, url) {
  const cache = await caches.open(`${cacheName}-meta`);
  const response = await cache.match(url);
  if (response) {
    const text = await response.text();
    return parseInt(text, 10);
  }
  return null;
}

async function setCacheTime(cacheName, url) {
  const cache = await caches.open(`${cacheName}-meta`);
  await cache.put(url, new Response(Date.now().toString()));
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(syncFailedRequests());
  }
});

async function syncFailedRequests() {
  // Implement background sync logic here
  console.log('[SW] Syncing failed requests...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Y7 Foods', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});

console.log('[SW] Service Worker loaded');
