// Advanced route prefetching system for instant navigation

interface PrefetchConfig {
  priority: number;
  timeout: number;
  condition?: () => boolean;
}

interface RouteConfig {
  [key: string]: {
    component: any;
    config: PrefetchConfig;
  };
}

class RoutePrefetcher {
  private prefetchQueue: Array<{ component: any; priority: number }> = [];
  private prefetched = new Set<string>();
  private isPrefetching = false;

  // Register routes with their prefetch configuration
  registerRoutes(routes: RouteConfig) {
    Object.entries(routes).forEach(([name, { component, config }]) => {
      if (config.condition && !config.condition()) {
        return; // Skip if condition not met
      }

      this.prefetchQueue.push({
        component,
        priority: config.priority,
      });
    });

    // Sort by priority (lower number = higher priority)
    this.prefetchQueue.sort((a, b) => a.priority - b.priority);
  }

  // Start prefetching routes
  async startPrefetching() {
    if (this.isPrefetching) return;
    this.isPrefetching = true;

    for (const { component } of this.prefetchQueue) {
      if (this.prefetched.has(component.name)) continue;

      try {
        await this.prefetchWithIdleCallback(component);
        this.prefetched.add(component.name);
      } catch (error) {
        console.warn('Prefetch failed:', error);
      }
    }

    this.isPrefetching = false;
  }

  // Prefetch a single component
  private prefetchWithIdleCallback(component: any): Promise<void> {
    return new Promise((resolve) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(
          async () => {
            if (component.preload) {
              await component.preload();
            }
            resolve();
          },
          { timeout: 2000 }
        );
      } else {
        setTimeout(async () => {
          if (component.preload) {
            await component.preload();
          }
          resolve();
        }, 100);
      }
    });
  }

  // Prefetch specific route immediately
  prefetchRoute(component: any) {
    if (this.prefetched.has(component.name)) return;

    if (component.preload) {
      component.preload();
      this.prefetched.add(component.name);
    }
  }

  // Check if route is prefetched
  isPrefetched(component: any): boolean {
    return this.prefetched.has(component.name);
  }

  // Clear prefetch cache
  clear() {
    this.prefetched.clear();
    this.prefetchQueue = [];
    this.isPrefetching = false;
  }
}

export const routePrefetcher = new RoutePrefetcher();

// Predictive prefetching based on user behavior
export class PredictivePrefetcher {
  private navigationHistory: string[] = [];
  private hoverTimes = new Map<string, number>();
  private clickPatterns = new Map<string, number>();

  // Track navigation
  trackNavigation(path: string) {
    this.navigationHistory.push(path);
    if (this.navigationHistory.length > 10) {
      this.navigationHistory.shift();
    }
  }

  // Track hover duration
  trackHover(path: string, duration: number) {
    const current = this.hoverTimes.get(path) || 0;
    this.hoverTimes.set(path, current + duration);
  }

  // Track clicks
  trackClick(path: string) {
    const current = this.clickPatterns.get(path) || 0;
    this.clickPatterns.set(path, current + 1);
  }

  // Predict next likely navigation
  predictNext(): string[] {
    const predictions: Array<{ path: string; score: number }> = [];

    // Score based on click frequency
    this.clickPatterns.forEach((clicks, path) => {
      predictions.push({ path, score: clicks * 2 });
    });

    // Score based on hover time
    this.hoverTimes.forEach((time, path) => {
      const existing = predictions.find((p) => p.path === path);
      if (existing) {
        existing.score += time / 1000;
      } else {
        predictions.push({ path, score: time / 1000 });
      }
    });

    // Sort by score and return top 3
    return predictions
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((p) => p.path);
  }

  // Get navigation patterns
  getPatterns() {
    return {
      history: this.navigationHistory,
      hovers: Array.from(this.hoverTimes.entries()),
      clicks: Array.from(this.clickPatterns.entries()),
    };
  }
}

export const predictivePrefetcher = new PredictivePrefetcher();

// Network-aware prefetching
export function shouldPrefetch(): boolean {
  // Check if user prefers reduced data
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    
    // Don't prefetch on slow connections
    if (conn.saveData) return false;
    if (conn.effectiveType === 'slow-2g') return false;
    if (conn.effectiveType === '2g') return false;
    
    // Prefetch on fast connections
    if (conn.effectiveType === '4g') return true;
  }

  // Default: prefetch
  return true;
}

// Prefetch on link hover
export function prefetchOnHover(
  element: HTMLElement,
  component: any,
  minHoverTime: number = 100
) {
  let hoverStartTime = 0;
  let hoverTimer: NodeJS.Timeout;

  const handleMouseEnter = () => {
    hoverStartTime = Date.now();
    
    hoverTimer = setTimeout(() => {
      if (shouldPrefetch() && component.preload) {
        component.preload();
        predictivePrefetcher.trackHover(
          element.getAttribute('href') || '',
          Date.now() - hoverStartTime
        );
      }
    }, minHoverTime);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer);
    if (hoverStartTime) {
      const duration = Date.now() - hoverStartTime;
      predictivePrefetcher.trackHover(
        element.getAttribute('href') || '',
        duration
      );
    }
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    clearTimeout(hoverTimer);
  };
}

// Prefetch on viewport intersection
export function prefetchOnVisible(
  element: HTMLElement,
  component: any,
  options?: IntersectionObserverInit
) {
  if (!('IntersectionObserver' in window)) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && shouldPrefetch() && component.preload) {
          component.preload();
          observer.disconnect();
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.01,
      ...options,
    }
  );

  observer.observe(element);

  return () => observer.disconnect();
}

// Batch prefetch multiple routes
export async function batchPrefetch(
  components: Array<{ component: any; delay?: number }>
) {
  if (!shouldPrefetch()) return;

  for (const { component, delay = 0 } of components) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        if (component.preload) {
          component.preload();
        }
      });
    } else {
      if (component.preload) {
        component.preload();
      }
    }
  }
}
