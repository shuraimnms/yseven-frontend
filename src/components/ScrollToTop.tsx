import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getScrollBehavior } from '@/hooks/use-scroll-to-top';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Get appropriate scroll behavior for the current route
    const behavior = getScrollBehavior(location.pathname);
    
    // Use requestAnimationFrame to ensure DOM is ready and avoid conflicts
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    });
  }, [location.pathname, location.search]);

  return null;
};

export default ScrollToTop;