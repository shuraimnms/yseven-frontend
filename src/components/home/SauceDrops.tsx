import { useEffect, useState } from "react";

interface Drop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

const SauceDrops = () => {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    const generateDrops = () => {
      const newDrops: Drop[] = [];
      for (let i = 0; i < 15; i++) {
        newDrops.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          size: 10 + Math.random() * 22,
          opacity: 0.75 + Math.random() * 0.25, // always 0.75–1.0, vivid on all screens
        });
      }
      setDrops(newDrops);
    };
    generateDrops();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute animate-sauce-drop"
          style={{
            left: `${drop.left}%`,
            top: '-10vh',
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            zIndex: 10
          }}
        >
          {/* Main drop */}
          <div
            className="relative"
            style={{
              width: `${drop.size}px`,
              height: `${drop.size * 1.4}px`,
            }}
          >
            {/* Drop body — vivid red, strong glow */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 30% 30%, hsl(0 90% 60%), hsl(0 85% 35%))`,
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                opacity: drop.opacity,
                boxShadow: `0 0 ${drop.size * 1.5}px hsl(0 90% 50% / 0.8), 0 0 ${drop.size * 0.5}px hsl(0 90% 60% / 0.9), inset 0 -${drop.size / 4}px ${drop.size / 2}px hsl(0 0% 0% / 0.3)`,
              }}
            />
            {/* Highlight */}
            <div
              className="absolute rounded-full bg-white/60"
              style={{
                width: `${drop.size * 0.3}px`,
                height: `${drop.size * 0.3}px`,
                top: `${drop.size * 0.15}px`,
                left: `${drop.size * 0.2}px`,
              }}
            />
            {/* Trail */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-full"
              style={{
                width: `${drop.size * 0.4}px`,
                height: `${drop.size * 2}px`,
                background: `linear-gradient(to bottom, transparent, hsl(0 85% 45% / 0.4), hsl(0 85% 45% / 0.8))`,
                borderRadius: "50%",
                opacity: 0.9,
              }}
            />
          </div>
        </div>
      ))}

      {/* Splash effects at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 animate-splash"
            style={{
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            <div
              className="w-4 h-4 rounded-full blur-sm"
              style={{ background: 'hsl(0 85% 45% / 0.85)' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SauceDrops;
