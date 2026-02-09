// Service Worker for Y7 Sauces - DISABLED FOR DEBUGGING
// This service worker immediately unregisters itself to clear all caches

self.addEventListener('install', (event) => {
  console.log('SW: Uninstalling and clearing all caches...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Clearing all caches and unregistering...');
  
  event.waitUntil(
    Promise.all([
      // Delete ALL caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('SW: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Unregister this service worker
      self.registration.unregister().then(() => {
        console.log('SW: Unregistered successfully');
      }),
      // Take control and force reload
      self.clients.claim()
    ])
  );
});

// Don't intercept any fetch requests
self.addEventListener('fetch', (event) => {
  // Let all requests go through to the network
  return;
});