import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        
        // Send to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'Web Vitals'
          });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              event_category: 'Web Vitals'
            });
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        console.log('CLS:', clsValue);
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Web Vitals'
          });
        }
      }).observe({ entryTypes: ['layout-shift'] });
    };

    // Monitor page load performance
    const monitorPageLoad = () => {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          download: navigation.responseEnd - navigation.responseStart,
          domParse: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          domReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          pageLoad: navigation.loadEventEnd - navigation.navigationStart
        };

        console.log('Page Load Metrics:', metrics);

        // Send to analytics
        if (window.gtag) {
          Object.entries(metrics).forEach(([key, value]) => {
            window.gtag('event', 'timing_complete', {
              name: key,
              value: Math.round(value),
              event_category: 'Performance'
            });
          });
        }
      });
    };

    // Monitor resource loading
    const monitorResources = () => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 1000) { // Resources taking more than 1s
            console.warn('Slow resource:', entry.name, entry.duration);
            
            if (window.gtag) {
              window.gtag('event', 'slow_resource', {
                resource_url: entry.name,
                duration: Math.round(entry.duration),
                event_category: 'Performance'
              });
            }
          }
        });
      }).observe({ entryTypes: ['resource'] });
    };

    // Monitor long tasks
    const monitorLongTasks = () => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.warn('Long task detected:', entry.duration);
          
          if (window.gtag) {
            window.gtag('event', 'long_task', {
              duration: Math.round(entry.duration),
              event_category: 'Performance'
            });
          }
        });
      }).observe({ entryTypes: ['longtask'] });
    };

    // Initialize monitoring
    observeWebVitals();
    monitorPageLoad();
    monitorResources();
    monitorLongTasks();

    // Memory usage monitoring
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576)
        });
      }
    };

    // Monitor memory every 30 seconds
    const memoryInterval = setInterval(monitorMemory, 30000);

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;