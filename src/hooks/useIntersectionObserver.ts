import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { freezeOnceVisible = false, ...observerOptions } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // If already intersected and frozen, don't observe again
    if (freezeOnceVisible && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting) {
          setHasIntersected(true);
          
          if (freezeOnceVisible) {
            observer.unobserve(target);
          }
        }
      },
      {
        threshold: 0.01,
        rootMargin: '50px',
        ...observerOptions
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [freezeOnceVisible, hasIntersected, observerOptions]);

  return { targetRef, isIntersecting, hasIntersected };
}
