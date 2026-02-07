// Service Worker for Y7 Sauces - Lightning Fast Caching
const CACHE_NAME = 'y7-sauces-v1';
const STATIC_CACHE = 'y7-static-v1';
const DYNAMIC_CACHE = 'y7-dynamic-v1';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/favicon.ico'
];

// Static assets to cache
const STATIC_ASSETS = [
  '/css/',
  '/js/',
  '/images/',
  '/fonts/'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/v1/products',
  '/api/v1/settings'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(CACHE_NAME).then((cache) => {
        console.log('SW: Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests with appropriate strategies
  if (isCriticalResource(request.url)) {
    // Cache First for critical resources
    event.respondWith(cacheFirst(request, CACHE_NAME));
  } else if (isStaticAsset(request.url)) {
    // Cache First for static assets
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isAPIRequest(request.url)) {
    // Network First for API requests with fallback
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (isImageRequest(request.url)) {
    // Cache First for images
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else {
    // Stale While Revalidate for other requests
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Only cache complete responses (status 200), not partial content (206)
    if (networkResponse.ok && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('SW: Cache First failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Only cache complete responses (status 200), not partial content (206)
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache:', error);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    // Only cache complete responses (status 200), not partial content (206)
    if (networkResponse.ok && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached version if available
    return cachedResponse;
  });
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Helper functions
function isCriticalResource(url) {
  return CRITICAL_RESOURCES.some(resource => url.includes(resource));
}

function isStaticAsset(url) {
  return STATIC_ASSETS.some(pattern => url.includes(pattern)) ||
         /\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/i.test(url);
}

function isAPIRequest(url) {
  return url.includes('/api/') || API_CACHE_PATTERNS.some(pattern => url.includes(pattern));
}

function isImageRequest(url) {
  return /\.(png|jpg|jpeg|gif|svg|webp|avif)$/i.test(url);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log('SW: Background sync triggered');
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: 'y7-notification'
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});