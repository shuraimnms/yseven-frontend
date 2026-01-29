// Error handler for common browser issues
export const suppressBrowserExtensionErrors = () => {
  // Suppress browser extension connection errors
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    
    // Suppress common browser extension errors
    if (
      message.includes('Could not establish connection') ||
      message.includes('Receiving end does not exist') ||
      message.includes('Extension context invalidated')
    ) {
      return; // Don't log these errors
    }
    
    // Log all other errors normally
    originalError.apply(console, args);
  };
};

// Handle video loading errors gracefully
export const handleVideoError = (videoElement: HTMLVideoElement, fallbackImage?: string) => {
  videoElement.addEventListener('error', (e) => {
    console.warn('Video failed to load, falling back to image:', e);
    
    if (fallbackImage && videoElement.parentElement) {
      const img = document.createElement('img');
      img.src = fallbackImage;
      img.className = videoElement.className;
      img.alt = videoElement.getAttribute('alt') || 'Product image';
      videoElement.parentElement.replaceChild(img, videoElement);
    }
  });
};

// Initialize error handling
export const initializeErrorHandling = () => {
  suppressBrowserExtensionErrors();
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    
    if (
      message.includes('Could not establish connection') ||
      message.includes('ERR_CACHE_OPERATION_NOT_SUPPORTED')
    ) {
      event.preventDefault(); // Prevent logging these errors
    }
  });
};