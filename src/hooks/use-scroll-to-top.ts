import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopOptions {
  behavior?: 'auto' | 'smooth';
  top?: number;
}

export const useScrollToTop = (options: ScrollToTopOptions = {}) => {
  const location = useLocation();
  const { behavior = 'auto', top = 0 } = options;

  useEffect(() => {
    // Always scroll to top when route changes
    window.scrollTo({
      top,
      left: 0,
      behavior,
    });
  }, [location.pathname, behavior, top]);
};

export const scrollToTop = (options: ScrollToTopOptions = {}) => {
  const { behavior = 'auto', top = 0 } = options;
  
  window.scrollTo({
    top,
    left: 0,
    behavior,
  });
};

// Helper to determine scroll behavior based on route
export const getScrollBehavior = (pathname: string): 'auto' | 'smooth' => {
  // Instant scroll for auth pages
  if (pathname.startsWith('/auth/')) {
    return 'auto';
  }
  
  // Instant scroll for payment pages
  if (pathname.startsWith('/payment/')) {
    return 'auto';
  }
  
  // Instant scroll for admin pages
  if (pathname.startsWith('/admin')) {
    return 'auto';
  }
  
  // Smooth scroll for content pages
  return 'smooth';
};