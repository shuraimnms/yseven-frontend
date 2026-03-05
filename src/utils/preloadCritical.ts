/**
 * Preload Critical Resources
 * Preloads fonts, critical images, and other resources
 */

export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fonts = [
    '/fonts/inter-var.woff2',
    '/fonts/playfair-display.woff2'
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload hero image
  const heroImage = new Image();
  heroImage.src = '/images/hero-sauce.webp';

  // Preload logo
  const logo = new Image();
  logo.src = '/logo.png';
};

/**
 * Prefetch Next Page Resources
 * Prefetches resources for likely next navigation
 */
export const prefetchNextPage = (href: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
};

/**
 * Preconnect to External Domains
 * Establishes early connections to external resources
 */
export const preconnectDomains = () => {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Resource Hints for Performance
 */
export const initializeResourceHints = () => {
  // Only run in browser
  if (typeof window === 'undefined') return;

  // Preconnect to external domains
  preconnectDomains();

  // Preload critical resources
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
  } else {
    preloadCriticalResources();
  }

  // Prefetch common next pages on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      prefetchNextPage('/products');
      prefetchNextPage('/shop');
      prefetchNextPage('/about');
    });
  }
};

export default initializeResourceHints;
