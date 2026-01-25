import { NavigateFunction, useNavigate } from 'react-router-dom';

// Utility function for programmatic navigation with scroll-to-top
export const navigateWithScrollToTop = (
  navigate: NavigateFunction,
  path: string,
  options?: {
    replace?: boolean;
    state?: any;
  }
) => {
  // Determine scroll behavior based on route
  const getScrollBehavior = (pathname: string): 'auto' | 'smooth' => {
    if (pathname.startsWith('/auth/')) return 'auto';
    if (pathname.startsWith('/payment/')) return 'auto';
    if (pathname.startsWith('/admin')) return 'auto';
    return 'smooth';
  };

  const behavior = getScrollBehavior(path);
  
  // Navigate first
  navigate(path, options);
  
  // Then scroll to top with appropriate behavior
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, 0);
};

// Hook for easy navigation with scroll-to-top
export const useNavigateWithScroll = () => {
  const navigate = useNavigate();
  
  return (path: string, options?: { replace?: boolean; state?: any }) => {
    navigateWithScrollToTop(navigate, path, options);
  };
};