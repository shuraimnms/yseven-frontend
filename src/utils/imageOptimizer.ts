// Ultra-fast image loading utilities

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  lazy?: boolean;
  blur?: boolean;
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const { width, height, quality = 85, format = 'webp' } = options;
  
  // If using a CDN, add query parameters
  const url = new URL(src, window.location.origin);
  
  if (width) url.searchParams.set('w', width.toString());
  if (height) url.searchParams.set('h', height.toString());
  if (quality) url.searchParams.set('q', quality.toString());
  if (format) url.searchParams.set('f', format);
  
  return url.toString();
}

// Generate srcset for responsive images
export function generateSrcSet(
  src: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  return widths
    .map((width) => `${getOptimizedImageUrl(src, { width })} ${width}w`)
    .join(', ');
}

// Generate blur placeholder
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Create gradient blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1a1a');
  gradient.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

// Preload critical images
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = priority;
    
    link.onload = () => resolve();
    link.onerror = reject;
    
    document.head.appendChild(link);
  });
}

// Lazy load images with IntersectionObserver
export function lazyLoadImage(
  img: HTMLImageElement,
  options: IntersectionObserverInit = {}
): () => void {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load immediately
    if (img.dataset.src) img.src = img.dataset.src;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    return () => {};
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        
        if (target.dataset.src) {
          target.src = target.dataset.src;
          target.removeAttribute('data-src');
        }
        
        if (target.dataset.srcset) {
          target.srcset = target.dataset.srcset;
          target.removeAttribute('data-srcset');
        }
        
        target.classList.add('loaded');
        observer.unobserve(target);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01,
    ...options
  });
  
  observer.observe(img);
  
  return () => observer.disconnect();
}

// Decode image asynchronously for better performance
export async function decodeImage(img: HTMLImageElement): Promise<void> {
  if ('decode' in img) {
    try {
      await img.decode();
    } catch (error) {
      console.warn('Image decode failed:', error);
    }
  }
}

// Check if WebP is supported
let webpSupported: boolean | null = null;

export async function supportsWebP(): Promise<boolean> {
  if (webpSupported !== null) return webpSupported;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      webpSupported = img.width === 1;
      resolve(webpSupported);
    };
    img.onerror = () => {
      webpSupported = false;
      resolve(false);
    };
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}

// Check if AVIF is supported
let avifSupported: boolean | null = null;

export async function supportsAVIF(): Promise<boolean> {
  if (avifSupported !== null) return avifSupported;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      avifSupported = img.width === 1;
      resolve(avifSupported);
    };
    img.onerror = () => {
      avifSupported = false;
      resolve(false);
    };
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}
