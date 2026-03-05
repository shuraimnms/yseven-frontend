import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
}

export function usePerformanceMonitor(pageName: string) {
  const metricsRef = useRef<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    // Measure page load time
    const navigationStart = performance.timing.navigationStart;
    const loadComplete = performance.timing.loadEventEnd;
    const pageLoadTime = loadComplete - navigationStart;

    console.log(`[Performance] ${pageName} loaded in ${pageLoadTime}ms`);

    // Measure First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.fcp = entry.startTime;
              console.log(`[Performance] ${pageName} FCP: ${entry.startTime.toFixed(2)}ms`);
            }
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // Measure Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.lcp = lastEntry.startTime;
          console.log(`[Performance] ${pageName} LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            metricsRef.current.fid = entry.processingStart - entry.startTime;
            console.log(`[Performance] ${pageName} FID: ${metricsRef.current.fid.toFixed(2)}ms`);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Measure Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              metricsRef.current.cls = clsValue;
            }
          }
          console.log(`[Performance] ${pageName} CLS: ${clsValue.toFixed(4)}`);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          fcpObserver.disconnect();
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }, [pageName]);

  return metricsRef.current;
}

// Report Web Vitals to analytics
export function reportWebVitals(metric: any) {
  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }
}

// Measure component render time
export function useRenderTime(componentName: string) {
  const renderStartRef = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current;
    console.log(`[Render] ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
  }, [componentName]);
}

// Detect slow renders
export function useSlowRenderDetection(componentName: string, threshold: number = 16) {
  const renderStartRef = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current;
    
    if (renderTime > threshold) {
      console.warn(
        `[Slow Render] ${componentName} took ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
      );
    }
  }, [componentName, threshold]);
}

// Memory usage monitoring
export function useMemoryMonitor() {
  useEffect(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      const logMemory = () => {
        console.log('[Memory]', {
          used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        });
      };

      // Log memory every 30 seconds
      const interval = setInterval(logMemory, 30000);
      logMemory(); // Log immediately

      return () => clearInterval(interval);
    }
  }, []);
}

// Network speed detection
export function useNetworkSpeed() {
  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      
      console.log('[Network]', {
        effectiveType: conn.effectiveType,
        downlink: `${conn.downlink} Mbps`,
        rtt: `${conn.rtt}ms`,
        saveData: conn.saveData,
      });

      const handleChange = () => {
        console.log('[Network] Connection changed:', {
          effectiveType: conn.effectiveType,
          downlink: `${conn.downlink} Mbps`,
        });
      };

      conn.addEventListener('change', handleChange);
      return () => conn.removeEventListener('change', handleChange);
    }
  }, []);
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
