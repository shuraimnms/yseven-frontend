import { useEffect, useRef, useState } from 'react';

interface ProductVideoProps {
  videoSrc: string;
  fallbackImage: string;
  alt: string;
  className?: string;
}

const ProductVideo = ({ videoSrc, fallbackImage, alt, className = '' }: ProductVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoLoaded(true);
      setVideoError(false);
    };

    const handleError = () => {
      setVideoError(true);
      setVideoLoaded(false);
    };

    const handleCanPlay = () => {
      video.play().catch(() => {
        // Autoplay failed - this is normal on some browsers
        console.log('Autoplay prevented by browser');
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={fallbackImage}
        style={{ 
          zIndex: videoLoaded && !videoError ? 1 : -1,
          opacity: videoLoaded && !videoError ? 1 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback Image */}
      <img
        src={fallbackImage}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ 
          zIndex: videoLoaded && !videoError ? -1 : 1,
          opacity: videoLoaded && !videoError ? 0 : 1,
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Loading indicator (optional) */}
      {!videoLoaded && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-obsidian/20">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProductVideo;