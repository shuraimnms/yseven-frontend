// Ultra-performance optimization utilities

// Debounce function for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Request idle callback polyfill
export const requestIdleCallback =
  typeof window !== 'undefined' && 'requestIdleCallback' in window
    ? window.requestIdleCallback
    : (cb: IdleRequestCallback) => setTimeout(cb, 1);

export const cancelIdleCallback =
  typeof window !== 'undefined' && 'cancelIdleCallback' in window
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id);

// Defer non-critical tasks
export function deferTask(task: () => void, priority: 'high' | 'low' = 'low') {
  if (priority === 'high') {
    requestAnimationFrame(task);
  } else {
    requestIdleCallback(task);
  }
}

// Batch DOM reads and writes
class DOMBatcher {
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];
  private scheduled = false;

  read(fn: () => void) {
    this.readQueue.push(fn);
    this.schedule();
  }

  write(fn: () => void) {
    this.writeQueue.push(fn);
    this.schedule();
  }

  private schedule() {
    if (this.scheduled) return;
    this.scheduled = true;

    requestAnimationFrame(() => {
      // Execute all reads first
      this.readQueue.forEach((fn) => fn());
      this.readQueue = [];

      // Then execute all writes
      this.writeQueue.forEach((fn) => fn());
      this.writeQueue = [];

      this.scheduled = false;
    });
  }
}

export const domBatcher = new DOMBatcher();

// Memoize expensive computations
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

// Prefetch resources
export function prefetchResource(url: string, as: string = 'fetch') {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

// Preconnect to domains
export function preconnect(url: string, crossorigin: boolean = false) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  if (crossorigin) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

// DNS prefetch
export function dnsPrefetch(url: string) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
}

// Measure performance
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${(end - start).toFixed(2)}ms`);
}

// Virtual scrolling helper
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return { startIndex, endIndex };
}

// Optimize animations
export function optimizeAnimation(element: HTMLElement, property: string, value: string) {
  // Use transform and opacity for GPU acceleration
  if (property === 'left' || property === 'top') {
    element.style.transform = `translate(${property === 'left' ? value : '0'}, ${property === 'top' ? value : '0'})`;
  } else {
    element.style[property as any] = value;
  }
}

// Reduce layout thrashing
export function batchStyleUpdates(updates: Array<{ element: HTMLElement; styles: Partial<CSSStyleDeclaration> }>) {
  domBatcher.write(() => {
    updates.forEach(({ element, styles }) => {
      Object.assign(element.style, styles);
    });
  });
}

// Intersection Observer pool
class ObserverPool {
  private observers = new Map<string, IntersectionObserver>();

  get(options: IntersectionObserverInit = {}): IntersectionObserver {
    const key = JSON.stringify(options);
    
    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const callback = (entry.target as any).__intersectionCallback;
          if (callback) callback(entry);
        });
      }, options);
      
      this.observers.set(key, observer);
    }

    return this.observers.get(key)!;
  }

  observe(
    element: Element,
    callback: (entry: IntersectionObserverEntry) => void,
    options?: IntersectionObserverInit
  ) {
    (element as any).__intersectionCallback = callback;
    this.get(options).observe(element);
  }

  unobserve(element: Element, options?: IntersectionObserverInit) {
    this.get(options).unobserve(element);
    delete (element as any).__intersectionCallback;
  }
}

export const observerPool = new ObserverPool();

// Web Worker helper
export function createWorker(fn: Function): Worker {
  const blob = new Blob([`(${fn.toString()})()`], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// Service Worker registration
export async function registerServiceWorker(swPath: string = '/sw.js') {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Cache API helper
export async function cacheResources(cacheName: string, urls: string[]) {
  if ('caches' in window) {
    const cache = await caches.open(cacheName);
    await cache.addAll(urls);
  }
}

// Network-first, cache-fallback strategy
export async function fetchWithCache(url: string, cacheName: string = 'dynamic-cache') {
  try {
    const response = await fetch(url);
    
    if (response.ok && 'caches' in window) {
      const cache = await caches.open(cacheName);
      cache.put(url, response.clone());
    }
    
    return response;
  } catch (error) {
    if ('caches' in window) {
      const cachedResponse = await caches.match(url);
      if (cachedResponse) return cachedResponse;
    }
    throw error;
  }
}
