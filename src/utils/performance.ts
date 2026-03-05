// Performance optimization utilities

const CRITICAL_LOGO_URL = new URL('../assets/logo.png', import.meta.url).href;
const CRITICAL_HERO_URL = new URL('../assets/hero-sauce.jpg', import.meta.url).href;

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical images that exist in public folder
  const criticalImages = [
    '/logo.png'  // This exists in public folder
    // hero-sauce.jpg is in src/assets and will be bundled by Vite with hash
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Optimize images with lazy loading and format support
export const createOptimizedImage = (src: string, alt: string, options: {
  priority?: boolean;
  sizes?: string;
  className?: string;
} = {}) => {
  const { priority = false, sizes, className } = options;
  
  // Don't auto-convert to WebP since we don't have WebP versions
  // Use the original source as-is
  return {
    src: src,
    alt,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    fetchPriority: priority ? 'high' : 'auto',
    sizes,
    className
  };
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Resource hints for better loading
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//api.example.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  criticalOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Critical CSS inlining utility
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Service Worker registration with controlled updates (NO AUTO-RELOAD)
export const registerServiceWorker = async () => {
  // Skip service worker in development mode to avoid conflicts
  if (import.meta.env.DEV) {
    console.log('[App] Skipping SW registration in development mode');
    return;
  }

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw-ultra.js');
      console.log('[App] SW registered:', registration);

      // Listen for updates but DON'T auto-reload
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
              console.log('[App] New SW activated - ready for next visit');
              // DON'T reload automatically - let user continue
            }
          });
        }
      });

      // Listen for messages from SW but don't auto-reload
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          console.log('[App] SW updated to version:', event.data.version);
          // Just log, don't reload
        }
      });

      // Check for updates less frequently (every 10 minutes instead of 1 minute)
      setInterval(() => {
        registration.update();
      }, 10 * 60 * 1000);

    } catch (error) {
      console.error('[App] SW registration failed:', error);
    }
  }
};
