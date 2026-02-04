import { useEffect, useRef, useState, memo } from 'react';
import heroImage from '@/assets/hero-sauce.jpg';
import heroVideo from '@/assets/hero-sauce.mp4';

interface HeroVideoBackgroundProps {
  className?: string;
}

const HeroVideoBackground = memo(({ className = '' }: HeroVideoBackgroundProps) => {
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

    const handleError = (e: Event) => {
      console.error('Video loading error:', e);
      setVideoError(true);
      setVideoLoaded(false);
    };

    const handleCanPlay = () => {
      video.play().catch((error) => {
        console.warn('Video autoplay failed (this is normal in some browsers):', error);
        // Don't set error state for autoplay failures
      });
    };

    const handleLoadStart = () => {
      // Video loading started
    };

    const handleProgress = () => {
      // Video loading progress
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('progress', handleProgress);

    // Force load the video
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('progress', handleProgress);
    };
  }, []);

  // Component render

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Always show video element for debugging */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroImage}
        style={{ 
          zIndex: 1,
          opacity: videoLoaded && !videoError ? 0.8 : 0,
          transition: 'opacity 1s ease-in-out'
        }}
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback Image */}
      <img
        src={heroImage}
        alt="Y7 Premium Sauce Hero Background"
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          zIndex: 0,
          opacity: 1
        }}
      />

      {/* Dark Overlay for Text Readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" 
        style={{ zIndex: 2 }} 
      />
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" 
        style={{ zIndex: 2 }} 
      />
    </div>
  );
});

HeroVideoBackground.displayName = 'HeroVideoBackground';

export default HeroVideoBackground;