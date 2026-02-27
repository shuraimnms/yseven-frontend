import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteAutoScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  speed?: number; // pixels per second (default: 300)
  allowManualScroll?: boolean; // Enable manual scrolling
  className?: string;
  itemClassName?: string;
}

export function InfiniteAutoScroll<T extends { id: string | number }>({
  items,
  renderItem,
  speed = 300,
  allowManualScroll = true,
  className,
  itemClassName
}: InfiniteAutoScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const isInitializedRef = useRef(false);
  const lastTimestampRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Triple duplication for seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items];

  // Initialize scroll position to middle set
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const initScroll = () => {
      const itemSetHeight = content.scrollHeight / 3;
      if (itemSetHeight > 0) {
        container.scrollTop = itemSetHeight;
        scrollPositionRef.current = itemSetHeight;
        isInitializedRef.current = true;
      }
    };

    // Multiple attempts to ensure proper initialization
    const timer1 = setTimeout(initScroll, 10);
    const timer2 = setTimeout(initScroll, 50);
    const timer3 = setTimeout(initScroll, 100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [items]);

  // Manual scroll handler
  useEffect(() => {
    if (!allowManualScroll) return;

    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const handleScroll = () => {
      // Mark user as actively scrolling
      isUserScrollingRef.current = true;
      
      // Sync internal state with actual scroll position
      scrollPositionRef.current = container.scrollTop;

      const itemSetHeight = content.scrollHeight / 3;
      const containerHeight = container.clientHeight;

      // Infinite loop reset during manual scroll
      if (container.scrollTop >= itemSetHeight * 2 - containerHeight) {
        container.scrollTop = itemSetHeight;
        scrollPositionRef.current = itemSetHeight;
      }

      if (container.scrollTop <= 0) {
        container.scrollTop = itemSetHeight;
        scrollPositionRef.current = itemSetHeight;
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Resume auto-scroll after 800ms of inactivity
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 800);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [allowManualScroll]);

  // Auto-scroll animation engine - optimized for smooth performance
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let rafId: number;

    const animate = (timestamp: number) => {
      // Initialize timestamp on first frame
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
        rafId = requestAnimationFrame(animate);
        return;
      }

      // Calculate time delta in milliseconds
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      // Cap delta to prevent large jumps (e.g., when tab becomes active)
      const cappedDelta = Math.min(delta, 50);

      // Calculate heights for infinite loop logic
      const itemSetHeight = content.scrollHeight / 3;
      const containerHeight = container.clientHeight;

      if (itemSetHeight > 0 && containerHeight > 0) {
        // Only auto-scroll if user is not actively scrolling
        if (!isUserScrollingRef.current) {
          // Calculate movement based on speed and time delta
          const movement = (speed * cappedDelta) / 1000;
          scrollPositionRef.current += movement;

          // Seamless infinite loop boundaries
          const resetThreshold = 10; // Small buffer to prevent multiple resets
          
          // When reaching end of second set, jump back to middle set
          if (scrollPositionRef.current >= itemSetHeight * 2 - containerHeight + resetThreshold) {
            scrollPositionRef.current = itemSetHeight;
          }

          // When reaching start, jump to middle set
          if (scrollPositionRef.current <= resetThreshold) {
            scrollPositionRef.current = itemSetHeight;
          }

          // Apply scroll position smoothly
          container.scrollTop = scrollPositionRef.current;
        }
      }

      // Continue animation
      rafId = requestAnimationFrame(animate);
    };

    // Start animation
    rafId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lastTimestampRef.current = 0;
    };
  }, [speed, items, allowManualScroll]);

  return (
    <div
      ref={containerRef}
      className={cn(
        allowManualScroll ? 'overflow-y-auto' : 'overflow-hidden',
        'h-full scrollbar-hide',
        className
      )}
      style={{
        willChange: 'scroll-position',
        WebkitOverflowScrolling: 'touch',
        transform: 'translateZ(0)', // Force GPU acceleration
        backfaceVisibility: 'hidden' // Prevent flickering
      }}
    >
      <div 
        ref={contentRef} 
        className="flex flex-col"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)' // Force GPU acceleration
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={cn('flex-shrink-0', itemClassName)}
            style={{
              transform: 'translateZ(0)' // Force GPU acceleration for each item
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
