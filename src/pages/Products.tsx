import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import sauceClassic from "@/assets/sauce-classic.jpg";
import sauceSpicy from "@/assets/sauce-spicy.jpg";
import sauceInternational from "@/assets/sauce-international.jpg";
import sauceCreamy from "@/assets/sauce-creamy.jpg";

const productRanges = [
  {
    name: "Classic Range",
    description: "Timeless flavors perfected over generations. Our classic sauces bring comfort and familiarity to every dish.",
    image: sauceClassic,
    products: ["Original Mayo", "Garlic Aioli", "Classic BBQ", "Honey Mustard"],
  },
  {
    name: "Spicy Range",
    description: "Bold heat for the adventurous palate. From mild warmth to fiery intensity.",
    image: sauceSpicy,
    products: ["Peri-Peri Mayo", "Sriracha Mayo", "Chipotle", "Habanero Heat"],
  },
  {
    name: "International Range",
    description: "World cuisines in every bottle. Travel the globe through flavor.",
    image: sauceInternational,
    products: ["Sambal Oelek", "Chimichurri", "Teriyaki Glaze", "Tikka Masala"],
  },
  {
    name: "Creamy Range",
    description: "Rich indulgence meets artisan craft. Smooth, luxurious, unforgettable.",
    image: sauceCreamy,
    products: ["Truffle Mayo", "Ranch Supreme", "Caesar Cream", "Blue Cheese"],
  },
];

const Products = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-6">Our Collection</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-cream mb-6">
            Premium <span className="text-gradient-gold">Sauces</span>
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Discover our curated collection of world-class sauces, crafted for 
            those who demand excellence in every bite.
          </p>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="py-12 bg-deep-red/20 border-y border-deep-red/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Bell className="w-6 h-6 text-gold animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-cream">
                  Products Launching Soon
                </h3>
                <p className="text-cream/60 text-sm">
                  Be the first to know when our premium sauces are available
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-charcoal border-gold/20 text-cream placeholder:text-cream/40 focus:border-gold"
              />
              <Button variant="gold">Notify Me</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Ranges */}
      <section className="py-24 lg:py-32 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          {productRanges.map((range, index) => (
            <div
              key={range.name}
              className={`grid lg:grid-cols-2 gap-12 items-center mb-24 last:mb-0 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="relative group">
                  <div className="aspect-square overflow-hidden rounded-lg border border-gold/10">
                    <img
                      src={range.image}
                      alt={range.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent rounded-lg" />
                </div>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">
                  {range.name}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-6">
                  {range.name.split(" ")[0]}{" "}
                  <span className="text-gradient-gold">{range.name.split(" ")[1]}</span>
                </h2>
                <p className="text-cream/60 text-lg leading-relaxed mb-8">
                  {range.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {range.products.map((product) => (
                    <span
                      key={product}
                      className="px-4 py-2 bg-charcoal border border-gold/10 rounded-full text-cream/70 text-sm"
                    >
                      {product}
                    </span>
                  ))}
                </div>
                <Button variant="gold-outline" size="lg" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-section">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream mb-6">
            Interested in <span className="text-gradient-gold">Bulk Orders?</span>
          </h2>
          <p className="text-cream/60 text-lg max-w-2xl mx-auto mb-10">
            Partner with Y7 for your restaurant, hotel, or retail business. 
            Premium pricing for premium partners.
          </p>
          <Link to="/bulk-orders">
            <Button variant="gold" size="lg">
              Request B2B Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Products;
