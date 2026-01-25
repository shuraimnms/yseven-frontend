import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getScrollBehavior } from '@/hooks/use-scroll-to-top';

const ScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    const behavior = getScrollBehavior(location.pathname);
    
    // Use a slight delay to ensure this doesn't conflict with ScrollToTop
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default ScrollRestoration;