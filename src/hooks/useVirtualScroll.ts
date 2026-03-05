import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateVisibleRange } from '@/utils/performanceOptimizer';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  overscan?: number;
}

export function useVirtualScroll({
  itemHeight,
  containerHeight,
  totalItems,
  overscan = 3
}: UseVirtualScrollOptions) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startIndex, endIndex } = calculateVisibleRange(
    scrollTop,
    containerHeight,
    itemHeight,
    totalItems,
    overscan
  );

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const totalHeight = totalItems * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    containerRef,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    visibleItems: endIndex - startIndex + 1
  };
}
