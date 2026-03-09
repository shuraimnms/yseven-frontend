import { useState, useEffect, useRef, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import { categoryData, Category, Product } from '../data/categoryData';
import { productsData, ProductDetailsSections } from './ProductDetail';
import { InfiniteAutoScroll } from '@/components/InfiniteAutoScroll';

// Memoized product card component for better performance
const ProductCard = memo(({ product, productRef }: {
  product: Product; 
  productRef: (el: HTMLElement | null) => void;
}) => {
  const fullProduct = productsData.find((item) => item.slug === product.slug);

  return (
    <article
      ref={productRef}
      id={product.id}
      data-product-id={product.id}
      className="scroll-mt-36 lg:scroll-mt-24" // Mobile: 144px (header 80 + nav 64), Desktop: 96px
    >
      {fullProduct ? (
        <ProductDetailsSections product={fullProduct} bulkInquiryId={`bulk-inquiry-${product.slug}`} />
      ) : (
        <div className="rounded-2xl border border-gold/20 bg-charcoal/30 p-8">
          <h2 className="text-3xl font-bold text-cream mb-4">{product.name}</h2>
          <p className="text-cream/80 mb-6">{product.shortDescription}</p>
          <Link to={`/products/${product.slug}`}>
            <Button className="bg-gold hover:bg-gold/90 text-obsidian">View Details</Button>
          </Link>
        </div>
      )}
    </article>
  );
});

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeProductId, setActiveProductId] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const productRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get category data
  const category = categoryData.find((cat: Category) => cat.slug === slug);

  // Redirect if category not found
  useEffect(() => {
    if (!category) {
      navigate('/products');
    }
  }, [category, navigate]);

  if (!category) return null;

  // Set first product as active on mount
  useEffect(() => {
    if (category.products.length > 0 && !activeProductId) {
      setActiveProductId(category.products[0].id);
    }
  }, [category.products, activeProductId]);

  // Intersection Observer for scroll spy
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let activeEntry = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeEntry = entry;
          }
        });

        // Update active product if we found one
        if (activeEntry) {
          const productId = activeEntry.target.getAttribute('data-product-id');
          if (productId && productId !== activeProductId) {
            setActiveProductId(productId);
          }
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9], // Multiple thresholds for better detection
        rootMargin: '-80px 0px -80px 0px' // Reduced margin for better detection
      }
    );

    // Small delay to ensure DOM elements are ready
    const timeoutId = setTimeout(() => {
      // Observe all product sections
      Object.values(productRefs.current).forEach((ref) => {
        if (ref && observerRef.current) {
          observerRef.current.observe(ref);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
    };
  }, [category.products]);

  // Backup scroll spy using scroll event (fallback)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Find the product section that's currently in view
      let currentProductId = '';
      let minDistance = Infinity;

      Object.entries(productRefs.current).forEach(([productId, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementCenter = rect.top + window.scrollY + rect.height / 2;
          const distance = Math.abs(scrollPosition - elementCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            currentProductId = productId;
          }
        }
      });

      if (currentProductId && currentProductId !== activeProductId) {
        setActiveProductId(currentProductId);
      }
    };

    // Throttle scroll events
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [activeProductId, category.products]);

  // Video lazy loading and pause on scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    const videoObserver = new IntersectionObserver(handleVideoIntersection, {
      threshold: 0.5
    });

    videoObserver.observe(video);

    return () => {
      videoObserver.disconnect();
    };
  }, []);

  // Smooth scroll to product - FIXED for mobile with multiple fallbacks
  const scrollToProduct = (productId: string) => {
    const element = productRefs.current[productId];
    if (!element) {
      console.warn(`Product element not found for ID: ${productId}`);
      return;
    }

    // Update active product immediately for better UX
    setActiveProductId(productId);
    
    // Calculate proper offset for mobile and desktop
    // Mobile: Header (80px) + Sticky nav (~60px with padding) = ~140px
    // Desktop: Header (80px) + some padding = ~100px
    const isMobile = window.innerWidth < 1024;
    const offset = isMobile ? 150 : 100;
    
    // Try multiple scroll methods for better compatibility
    try {
      // Method 1: Modern scrollIntoView with offset (best for mobile)
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const targetPosition = elementTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Debug log for troubleshooting
      if (process.env.NODE_ENV === 'development') {
        console.log('Scroll to product:', {
          productId,
          elementTop,
          offset,
          targetPosition,
          isMobile
        });
      }
    } catch (error) {
      // Fallback: Use basic scrollIntoView
      console.error('Scroll error, using fallback:', error);
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Adjust for sticky header after scroll
      setTimeout(() => {
        window.scrollBy(0, -offset);
      }, 100);
    }
  };

  // Auto-scroll active pill into view (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024 && activeProductId) {
      const activePill = document.getElementById(`pill-${activeProductId}`);
      if (activePill) {
        activePill.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeProductId]);

  const seoData = {
    title: `${category.title} - Premium Y7 Products`,
    description: category.tagline,
    keywords: `${category.title}, Y7 products, premium sauces, ${category.products.map((p: Product) => p.name).join(', ')}`,
    canonical: `/category/${category.slug}`,
    ogTitle: `${category.title} - Premium Y7 Products`,
    ogDescription: category.tagline,
    twitterTitle: `${category.title} - Premium Y7 Products`,
    twitterDescription: category.tagline
  };

  return (
    <>
      <SEOHead seo={seoData} />

      {/* Hero Section with Video */}
      <section className="relative h-[60vh] lg:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            poster={category.videoPoster}
          >
            <source src={category.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 lg:mb-6">
              {category.title}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
              {category.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="bg-obsidian min-h-screen">
        {/* Mobile Horizontal Scroll Navigation */}
        <div className="lg:hidden sticky top-20 z-40 bg-charcoal border-b border-gold/20 shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 py-4 min-w-max">
              {category.products.map((product) => (
                <button
                  key={product.id}
                  id={`pill-${product.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollToProduct(product.id);
                  }}
                  type="button"
                  style={{ WebkitTapHighlightColor: 'rgba(217, 165, 32, 0.2)' }}
                  className={`
                    px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 cursor-pointer
                    ${activeProductId === product.id
                      ? 'bg-gold text-obsidian shadow-lg scale-105'
                      : 'bg-obsidian/50 text-cream hover:bg-obsidian/70 border border-gold/20'
                    }
                  `}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout: Sidebar + Products */}
        <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[25%_75%] lg:gap-12">
            {/* Left Sidebar - Desktop Only */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 max-h-[calc(100vh-200px)]">
                <h2 className="text-xl font-bold text-cream mb-6">Products</h2>
                <InfiniteAutoScroll
                  items={category.products.map(p => ({ id: p.id, name: p.name }))}
                  speed={500}
                  allowManualScroll={true}
                  className="h-[calc(100vh-280px)]"
                  renderItem={(product) => (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        scrollToProduct(product.id);
                      }}
                      type="button"
                      style={{ WebkitTapHighlightColor: 'rgba(217, 165, 32, 0.2)' }}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg transition-all duration-300 relative mb-2 cursor-pointer
                        ${activeProductId === product.id
                          ? 'bg-gradient-to-r from-gold/20 to-gold/10 border-l-4 border-gold font-semibold text-gold shadow-lg shadow-gold/20'
                          : 'hover:bg-charcoal/50 text-cream/70 hover:text-cream border-l-4 border-transparent hover:border-gold/30'
                        }
                      `}
                    >
                      <span className="block">{product.name}</span>
                    </button>
                  )}
                />
              </div>
            </aside>

            {/* Right Content - Product Sections */}
            <div className="space-y-24 lg:space-y-32">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  productRef={(el: HTMLElement | null) => {
                    productRefs.current[product.id] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Interested in Bulk Orders?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Partner with Y7 for your restaurant, hotel, or retail business. 
              Premium pricing for premium partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/bulk-orders">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-white font-semibold shadow-lg"
                >
                  Request B2B Pricing
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
