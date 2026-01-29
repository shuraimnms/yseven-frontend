import { useEffect, useRef, useState } from 'react';
import heroImage from '@/assets/hero-sauce.jpg';
import heroVideo from '@/assets/hero-sauce.mp4';

interface HeroVideoBackgroundProps {
  className?: string;
}

const HeroVideoBackground = ({ className = '' }: HeroVideoBackgroundProps) => {
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
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Video Element */}
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
          zIndex: videoLoaded && !videoError ? 0 : -10,
          opacity: videoLoaded && !videoError ? 1 : 0,
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
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          zIndex: videoLoaded && !videoError ? -10 : 0,
          opacity: videoLoaded && !videoError ? 0 : 1,
          transition: 'opacity 1s ease-in-out'
        }}
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" style={{ zIndex: 1 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" style={{ zIndex: 1 }} />
    </div>
  );
};

export default HeroVideoBackground;