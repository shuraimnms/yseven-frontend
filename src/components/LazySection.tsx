import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazySection({
  children,
  fallback = null,
  rootMargin = '100px',
  threshold = 0.01,
  className = ''
}: LazySectionProps) {
  const { targetRef, hasIntersected } = useIntersectionObserver({
    freezeOnceVisible: true,
    rootMargin,
    threshold
  });

  return (
    <div ref={targetRef as any} className={className}>
      {hasIntersected ? children : fallback}
    </div>
  );
}
