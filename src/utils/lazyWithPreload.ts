import { lazy, ComponentType } from 'react';

// Enhanced lazy loading with preload capability
export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const Component = lazy(factory);
  
  // Add preload method
  (Component as any).preload = factory;
  
  return Component as typeof Component & { preload: () => Promise<{ default: T }> };
}

// Preload on hover/focus
export function preloadOnInteraction(preloadFn: () => void) {
  return {
    onMouseEnter: preloadFn,
    onFocus: preloadFn,
  };
}

// Preload on viewport intersection
export function preloadOnVisible(
  element: HTMLElement | null,
  preloadFn: () => void,
  options?: IntersectionObserverInit
) {
  if (!element || typeof IntersectionObserver === 'undefined') return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        preloadFn();
        observer.disconnect();
      }
    });
  }, options);
  
  observer.observe(element);
  
  return () => observer.disconnect();
}
