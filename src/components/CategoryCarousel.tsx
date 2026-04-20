/**
 * Auto-scrolling infinite category carousel.
 * Driven by Supabase realtime — new categories appear instantly.
 */
import { useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';import { Badge } from '@/components/ui/badge';
import { useCategories, useAllProducts } from '@/hooks/useSupabaseProducts';
import type { NormalizedCategory } from '@/types/supabase';

// Fallback images per slug
import sauceClassic from '@/assets/sauce-classic.jpg';
import sauceSpicy from '@/assets/sauce-spicy.jpg';
import sauceInternational from '@/assets/sauce-international.jpg';
import sauceCreamy from '@/assets/sauce-creamy.jpg';

const FALLBACK: Record<string, string> = {
  'sauces-condiments':       sauceClassic,
  'flakes-powders':          sauceSpicy,
  'banana-powders':          sauceInternational,
  'fruit-vegetable-powders': sauceCreamy,
};

function getCategoryUrl(slug: string) {
  return `/category/${slug}`;
}

interface CardProps {
  cat: NormalizedCategory;
  productCount: number;
  hasBestSeller: boolean;
  index: number;
}

const CategoryCard = memo(({ cat, productCount, hasBestSeller, index }: CardProps) => {
  const img = cat.cover_image || FALLBACK[cat.slug] || sauceClassic;
  const vid = cat.cover_video;

  return (
    <div className="flex-shrink-0 w-72">
      <Link to={getCategoryUrl(cat.slug)}>
        <div className="group relative overflow-hidden rounded-2xl bg-charcoal border border-gold/20
                        hover:border-gold hover:shadow-lg hover:shadow-gold/20
                        transition-all duration-300 cursor-pointer h-full">
          {/* Media */}
          <div className="relative h-48 overflow-hidden">
            {vid ? (
              <video
                src={vid}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                autoPlay muted loop playsInline
                poster={img || undefined}
              />
            ) : (
              <img
                src={img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {vid && (
              <div className="absolute top-2 left-2">
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-purple-500/70 text-white rounded text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Video
                </span>
              </div>
            )}

            {hasBestSeller && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gold text-black text-xs">
                  <Star className="w-3 h-3 mr-1" /> Top
                </Badge>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display text-xl font-bold text-cream mb-1 group-hover:text-gold transition-colors">
                {cat.name}
              </h3>
              <p className="text-cream/60 text-sm mb-2">
                {productCount} Product{productCount !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center text-gold text-sm opacity-0 group-hover:opacity-100
                              transition-all transform group-hover:translate-x-1">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});
CategoryCard.displayName = 'CategoryCard';

interface Props {
  /** Show heading + subtext above the carousel */
  showHeading?: boolean;
  className?: string;
}

export default function CategoryCarousel({ showHeading = true, className = '' }: Props) {
  const { categories, loading } = useCategories();
  const { products } = useAllProducts();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Restart scroll animation whenever categories change
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || categories.length === 0) return;

    let raf: number;
    let pos = 0;
    const speed = 0.5;
    let paused = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let resumeTimer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!paused) {
        pos += speed;
        const half = el.scrollWidth / 3; // tripled list
        if (pos >= half) pos = 0;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };

    const pause = () => { paused = true; };
    const resume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        pos = el.scrollLeft;
      }, 1200);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - touchStartX);
      const dy = Math.abs(e.touches[0].clientY - touchStartY);
      if (dx > dy && dx > 10) pause();
    };

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', resume);
    };
  }, [categories]); // ← restarts when categories change (new one added)

  // Build tripled list for seamless loop
  const tripled = [...categories, ...categories, ...categories];

  return (
    <div className={className}>
      {showHeading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-3">
            Explore by <span className="text-gold">Category</span>
          </h2>
          <p className="text-cream/60 text-base">Discover our premium product categories</p>
        </motion.div>
      )}

      {loading ? (
        /* Skeleton */
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-shrink-0 w-72 h-48 rounded-2xl bg-charcoal animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Fade edges — matches parent bg */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />

          {/* Scrolling strip */}
          <div
            ref={carouselRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
          >
            <div className="inline-flex gap-4 pb-2">
              {tripled.map((cat, i) => {
                const catProducts = products.filter(p => p.category === cat.name);
                return (
                  <CategoryCard
                    key={`${cat.id}-${i}`}
                    cat={cat}
                    productCount={catProducts.length}
                    hasBestSeller={catProducts.some(p => p.isBestSeller)}
                    index={i}
                  />
                );
              })}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-cream/30 text-xs">
              <motion.span animate={{ x: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 2 }} className="text-gold">←</motion.span>
              <span>Auto-scrolling</span>
              <motion.span animate={{ x: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 2 }} className="text-gold">→</motion.span>
            </div>
            <div className="h-3 w-px bg-gold/20" />
            <div className="flex items-center gap-1.5 text-cream/30 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>{categories.length} categories</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
