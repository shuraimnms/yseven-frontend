import { useState, useEffect, useRef } from 'react';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * Optimized Image Component with:
 * - Lazy loading
 * - WebP support with fallback
 * - Responsive images
 * - Intersection Observer
 * - Blur placeholder
 */
export const ImageOptimized = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  onLoad
}: ImageOptimizedProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Don't generate WebP source since we don't have WebP versions
  // Use original source only
  const fallbackSrc = src;
  
  // Generate srcset for responsive images (original format only)
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [320, 640, 1024, 1920];
    const ext = baseSrc.match(/\.(jpg|jpeg|png)$/i)?.[0] || '';
    const base = baseSrc.replace(ext, '');
    
    return sizes
      .map(size => `${base}-${size}w${ext} ${size}w`)
      .join(', ');
  };

  return (
    <picture ref={imgRef}>
      {isInView && (
        <>
          <source
            type="image/jpeg"
            srcSet={generateSrcSet(src)}
            sizes={sizes}
          />
        </>
      )}
      <img
        src={isInView ? src : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        style={{
          backgroundColor: '#1a1a1a',
          minHeight: height ? `${height}px` : 'auto'
        }}
      />
    </picture>
  );
};

export default ImageOptimized;
