import { useState, useEffect, useRef, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import LazyImage from '@/components/LazyImage';
import { categoryData, Category, Product } from '../data/categoryData';

// Memoized product card component for better performance
const ProductCard = memo(({ product, index, productRef }: { 
  product: Product; 
  index: number; 
  productRef: (el: HTMLElement | null) => void;
}) => {
  return (
    <article
      ref={productRef}
      id={product.id}
      data-product-id={product.id}
      className="scroll-mt-32"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Product Image */}
        <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
          <div className="relative group">
            <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <LazyImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {product.badge && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gold text-obsidian px-3 py-1 text-sm shadow-lg">
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
          <h2 className="text-3xl lg:text-4xl font-bold text-cream mb-4">
            {product.name}
          </h2>
          
          <p className="text-lg text-cream/80 mb-6 leading-relaxed">
            {product.shortDescription}
          </p>

          <Link to={`/products/${product.slug}`}>
            <Button
              size="lg"
              className="bg-gold hover:bg-gold/90 text-obsidian font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Details
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
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
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const productId = entry.target.getAttribute('data-product-id');
            if (productId) {
              setActiveProductId(productId);
            }
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: '-100px 0px -100px 0px'
      }
    );

    // Observe all product sections
    Object.values(productRefs.current).forEach((ref) => {
      if (ref) observerRef.current?.observe(ref);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [category.products]);

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

  // Smooth scroll to product
  const scrollToProduct = (productId: string) => {
    const element = productRefs.current[productId];
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
        <div className="lg:hidden sticky top-16 z-40 bg-charcoal border-b border-gold/20 shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-4 py-4 min-w-max">
              {category.products.map((product) => (
                <button
                  key={product.id}
                  id={`pill-${product.id}`}
                  onClick={() => scrollToProduct(product.id)}
                  className={`
                    px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300
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
              <div
                ref={sidebarRef}
                className="sticky top-32 max-h-[calc(100vh-200px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-charcoal"
              >
                <h2 className="text-xl font-bold text-cream mb-6">Products</h2>
                <nav className="space-y-2">
                  {category.products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => scrollToProduct(product.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg transition-all duration-300
                        ${activeProductId === product.id
                          ? 'bg-gold/10 border-l-4 border-gold font-semibold text-cream'
                          : 'hover:bg-charcoal text-cream/70 hover:text-cream border-l-4 border-transparent'
                        }
                      `}
                    >
                      <span className="block">{product.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Right Content - Product Sections */}
            <div className="space-y-24 lg:space-y-32">
              {category.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
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
