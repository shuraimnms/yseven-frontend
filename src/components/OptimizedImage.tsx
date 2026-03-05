import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { generateSrcSet, generateBlurDataURL, lazyLoadImage, decodeImage } from '@/utils/imageOptimizer';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  blur?: boolean;
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  sizes,
  blur = true,
  onLoad,
  className = '',
  ...props
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurDataURL] = useState(() => blur ? generateBlurDataURL() : '');

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Priority images load immediately
    if (priority) {
      img.src = src;
      if (sizes) {
        img.srcset = generateSrcSet(src);
      }
      return;
    }

    // Lazy load non-priority images
    const cleanup = lazyLoadImage(img, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    return cleanup;
  }, [src, priority, sizes]);

  const handleLoad = async () => {
    if (imgRef.current) {
      await decodeImage(imgRef.current);
    }
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <img
      ref={imgRef}
      data-src={priority ? undefined : src}
      data-srcset={priority || !sizes ? undefined : generateSrcSet(src)}
      src={priority ? src : blurDataURL}
      srcSet={priority && sizes ? generateSrcSet(src) : undefined}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={handleLoad}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${blur && !isLoaded ? 'blur-sm' : ''} ${className}`}
      {...props}
    />
  );
}
