import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import ProductVideo from "@/components/ProductVideo";
// Product specific images
import tomatoKetchup from "@/assets/Tomato-Ketchup.png";
import tomatoSauce from "@/assets/Tomato-Sauce.png";
import snackSauce from "@/assets/Snack-Sauce.png";
import greenChilliSauce from "@/assets/Green-Chilli-Sauce.png";
import redChilliSauce from "@/assets/Red-Chilli-Sauce.png";
import soyaSauce from "@/assets/Soya-Sauce.png";
import vinegar from "@/assets/Vinegar.png";
import hotSpicySauce from "@/assets/Hot-&-Spicy-Sauce.png";
import garlicSauce from "@/assets/Garlic-Sauce.png";
import schezwanSauce from "@/assets/Schezwan-Sauce.png";
import liteMayonnaise from "@/assets/Lite-Mayonnaise.png";
import classicMayonnaise from "@/assets/Classic-Mayonnaise.png";
import cheeseBlend from "@/assets/Cheese-Blend.png";
import periPeriSauce from "@/assets/Peri-Peri-Sauce.png";
import romescoSauce from "@/assets/Romesco-Sauce.png";
import sambalSauce from "@/assets/Sambal-Sauce.png";
import greenChilliFlakesVideo from "@/assets/Green-Chilli-Flakes.mp4";
import greenChilliFlakesFallback from "@/assets/Green-Chilli-Flakes.png";
import tomatoKetchupVideo from "@/assets/Tomato-Ketchup.mp4";
import greenChilliPowder from "@/assets/Green-Chilli-Powder.png";
import yelkahiBananaPowderVideo from "@/assets/Yelkahi-Banana-Powde.mp4";
import yelkahiBananaPowderFallback from "@/assets/Yelkahi-Banana-Powde.png";
import rawPapayaPowderVideo from "@/assets/Raw-Papaya-Powder.mp4";
import rasabaleBananaPowder from "@/assets/Rasabale-Banana-Powder.png";
import g9BananaPowder from "@/assets/G9-Banana-Powder.png";
import rawPapayaPowderFallback from "@/assets/Raw-Papaya-Powder.png";
import mangoPowder from "@/assets/Mango-Powder.png";
import guavaPowder from "@/assets/Guava-Powder.png";
import sweetPotatoPowder from "@/assets/Sweet-Potato-Powder.png";
import chikooSapotaPowder from "@/assets/Chikoo(Sapota)-Powder.png";

const allProducts = [
  // Sauces & Condiments
  {
    id: 1,
    name: "Tomato Ketchup",
    description: "Classic tomato ketchup made from ripe, high-quality tomatoes, blended with a balanced mix of spices for rich flavor and smooth texture.",
    benefits: ["Rich tomato antioxidants (lycopene)", "Enhances taste instantly", "Low-fat condiment", "Kid-friendly flavor"],
    uses: "Burgers, fries, sandwiches, snacks, wraps",
    category: "Sauces & Condiments",
    image: tomatoKetchup,
    inStock: true
  },
  {
    id: 2,
    name: "Tomato Sauce / Continental Sauce",
    description: "A tangy, mildly spiced tomato-based sauce ideal for continental dishes and fusion recipes.",
    benefits: ["Improves digestion", "Adds depth of flavor", "Low calorie", "Versatile use"],
    uses: "Pasta, pizzas, sandwiches, gravies",
    category: "Sauces & Condiments",
    image: tomatoSauce,
    inStock: true
  },
  {
    id: 3,
    name: "Snack Sauce",
    description: "A bold, tangy, spicy sauce crafted for Indian snacks and street food flavors.",
    benefits: ["Boosts appetite", "Enhances snack flavor", "Low-fat condiment"],
    uses: "Samosa, pakora, chaat, fries",
    category: "Sauces & Condiments",
    image: snackSauce,
    inStock: true
  },
  {
    id: 4,
    name: "Green Chilli Sauce",
    description: "Spicy sauce made from fresh green chilies, delivering sharp heat and bold aroma.",
    benefits: ["Boosts metabolism", "Rich in Vitamin C", "Improves digestion"],
    uses: "Noodles, momos, stir-fry, marinades",
    category: "Sauces & Condiments",
    image: greenChilliSauce,
    inStock: true
  },
  {
    id: 5,
    name: "Red Chilli Sauce",
    description: "Fiery red chili sauce with rich color and intense flavor for spicy food lovers.",
    benefits: ["Enhances metabolism", "Rich in antioxidants", "Improves circulation"],
    uses: "Chinese dishes, snacks, dips",
    category: "Sauces & Condiments",
    image: redChilliSauce,
    inStock: true
  },
  {
    id: 6,
    name: "Soya Sauce",
    description: "Fermented soy-based sauce delivering deep umami flavor for Asian cuisines.",
    benefits: ["Rich in amino acids", "Enhances taste", "Low calorie seasoning"],
    uses: "Fried rice, noodles, marinades",
    category: "Sauces & Condiments",
    image: soyaSauce,
    inStock: true
  },
  {
    id: 7,
    name: "Vinegar",
    description: "Naturally fermented vinegar for culinary and health applications.",
    benefits: ["Aids digestion", "Supports weight loss", "Antibacterial properties"],
    uses: "Salads, pickling, marinades",
    category: "Sauces & Condiments",
    image: vinegar,
    inStock: true
  },
  {
    id: 8,
    name: "Hot & Spicy Sauce",
    description: "A powerful blend of chilies and spices for intense heat lovers.",
    benefits: ["Boosts metabolism", "Improves appetite", "Rich in antioxidants"],
    uses: "Grills, wraps, burgers",
    category: "Sauces & Condiments",
    image: hotSpicySauce,
    inStock: true
  },
  {
    id: 9,
    name: "Garlic Sauce",
    description: "Creamy garlic-based sauce with bold aroma and savory richness.",
    benefits: ["Heart-healthy compounds", "Boosts immunity", "Anti-inflammatory"],
    uses: "Shawarma, wraps, dips",
    category: "Sauces & Condiments",
    image: garlicSauce,
    inStock: true
  },
  {
    id: 10,
    name: "Schezwan Sauce",
    description: "Spicy Indo-Chinese sauce made with red chilies, garlic, and spices.",
    benefits: ["Enhances flavor", "Boosts metabolism", "Appetite stimulant"],
    uses: "Fried rice, noodles, momos",
    category: "Sauces & Condiments",
    image: schezwanSauce,
    inStock: true
  },
  {
    id: 11,
    name: "Lite Mayonnaise",
    description: "Low-fat creamy mayonnaise with smooth texture and mild flavor.",
    benefits: ["Reduced fat content", "Heart-friendly", "High protein (egg-based)"],
    uses: "Sandwiches, burgers, dips",
    category: "Sauces & Condiments",
    image: liteMayonnaise,
    inStock: true
  },
  {
    id: 12,
    name: "Classic Mayonnaise",
    description: "Rich, creamy mayonnaise made from premium oils and eggs.",
    benefits: ["Energy boosting", "Improves texture", "Rich mouthfeel"],
    uses: "Wraps, burgers, salads",
    category: "Sauces & Condiments",
    image: classicMayonnaise,
    inStock: true
  },
  {
    id: 13,
    name: "Cheese Blend",
    description: "Creamy cheese-flavored sauce for rich, savory dishes.",
    benefits: ["Calcium-rich", "Energy boosting", "Enhances flavor"],
    uses: "Nachos, fries, pasta",
    category: "Sauces & Condiments",
    image: cheeseBlend,
    inStock: true
  },
  {
    id: 14,
    name: "Peri Peri Sauce",
    description: "Tangy, spicy African-style sauce made with bird's eye chilies.",
    benefits: ["Boosts metabolism", "Rich in antioxidants", "Appetite stimulant"],
    uses: "Grilled chicken, fries",
    category: "Sauces & Condiments",
    image: periPeriSauce,
    inStock: true
  },
  {
    id: 15,
    name: "Romesco Sauce",
    description: "Spanish-style nutty tomato-based sauce with rich smoky flavor.",
    benefits: ["Healthy fats", "Antioxidant rich", "Heart-friendly"],
    uses: "Grilled vegetables, pasta",
    category: "Sauces & Condiments",
    image: romescoSauce,
    inStock: true
  },
  {
    id: 16,
    name: "Sambal Sauce",
    description: "Indonesian-style chili sauce with bold spice and tangy notes.",
    benefits: ["Improves digestion", "Boosts metabolism", "Rich in Vitamin C"],
    uses: "Rice, noodles, stir-fries",
    category: "Sauces & Condiments",
    image: sambalSauce,
    inStock: true
  },
  // Flakes & Powders
  {
    id: 17,
    name: "Green Chilli Flakes",
    description: "Dried green chilies crushed into flakes for bold heat and aroma.",
    benefits: ["Boosts metabolism", "Rich in Vitamin C", "Improves digestion"],
    uses: "Pizza topping, spice blends",
    category: "Flakes & Powders (Agro Products)",
    image: greenChilliFlakesFallback,
    inStock: true
  },
  {
    id: 18,
    name: "Green Chilli Powder",
    description: "Finely ground green chili powder with intense flavor.",
    benefits: ["Metabolism booster", "Antioxidant rich", "Enhances appetite"],
    uses: "Curries, marinades",
    category: "Flakes & Powders (Agro Products)",
    image: greenChilliPowder,
    inStock: true
  },
  // Raw Banana Powders
  {
    id: 19,
    name: "Yelkahi Banana Powder",
    description: "Made from premium Yelkahi bananas grown near Tungabhadra River.",
    benefits: ["Resistant starch", "Gut health support", "Low glycemic index"],
    uses: "Smoothies, porridge",
    category: "Raw Banana Powders",
    image: yelkahiBananaPowderFallback,
    inStock: true
  },
  {
    id: 20,
    name: "Rasabale Banana Powder",
    description: "Powdered aromatic bananas from Cauvery river belt.",
    benefits: ["Energy boosting", "Rich in potassium", "Digestive support"],
    uses: "Milkshakes, desserts",
    category: "Raw Banana Powders",
    image: rasabaleBananaPowder,
    inStock: true
  },
  {
    id: 21,
    name: "G9 Banana Powder",
    description: "Powder made from export-grade Grand Naine bananas.",
    benefits: ["Rich in fiber", "Energy booster", "Heart health"],
    uses: "Smoothies, baking",
    category: "Raw Banana Powders",
    image: g9BananaPowder,
    inStock: true
  },
  // Fruit & Vegetable Powders
  {
    id: 22,
    name: "Raw Papaya Powder",
    description: "Unripe papaya powder rich in papain enzyme.",
    benefits: ["Improves digestion", "Anti-inflammatory", "Detox support"],
    uses: "Health drinks, cooking",
    category: "Fruit & Vegetable Powders",
    image: rawPapayaPowderFallback,
    inStock: true
  },
  {
    id: 23,
    name: "Mango Powder",
    description: "Naturally sweet mango powder from ripe mangoes.",
    benefits: ["Vitamin A & C", "Immunity booster", "Antioxidant rich"],
    uses: "Smoothies, desserts",
    category: "Fruit & Vegetable Powders",
    image: mangoPowder,
    inStock: true
  },
  {
    id: 24,
    name: "Guava Powder",
    description: "Powdered guava rich in fiber and antioxidants.",
    benefits: ["Improves digestion", "Immunity booster", "Heart health"],
    uses: "Health drinks, baking",
    category: "Fruit & Vegetable Powders",
    image: guavaPowder,
    inStock: true
  },
  {
    id: 25,
    name: "Sweet Potato Powder",
    description: "Naturally sweet powder made from dried sweet potatoes.",
    benefits: ["Rich in fiber", "Blood sugar control", "Energy boosting"],
    uses: "Porridge, baking",
    category: "Fruit & Vegetable Powders",
    image: sweetPotatoPowder,
    inStock: true
  },
  {
    id: 26,
    name: "Chikoo (Sapota) Powder",
    description: "Sweet, nutrient-rich sapota powder.",
    benefits: ["Energy booster", "Digestive support", "Antioxidant rich"],
    uses: "Milkshakes, desserts",
    category: "Fruit & Vegetable Powders",
    image: chikooSapotaPowder,
    inStock: true
  }
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(allProducts.map(product => product.category)))];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  const seoData = {
    title: "Y7 Premium Sauces - Master Product Catalog | One Brand. Endless Flavor.",
    description: "Discover Y7's comprehensive range of premium sauces, condiments, and agro products. From classic tomato ketchup to exotic international sauces and nutritious fruit powders.",
    keywords: "Y7 sauces, premium condiments, tomato ketchup, mayonnaise, chili sauce, banana powder, fruit powders, agro products",
    canonical: "/products",
    ogTitle: "Y7 Premium Sauces - Master Product Catalog",
    ogDescription: "Discover Y7's comprehensive range of premium sauces, condiments, and agro products. From classic tomato ketchup to exotic international sauces and nutritious fruit powders.",
    twitterTitle: "Y7 Premium Sauces - Master Product Catalog",
    twitterDescription: "Discover Y7's comprehensive range of premium sauces, condiments, and agro products."
  };

  return (
    <>
      <SEOHead seo={seoData} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden -mt-20 pt-40">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-obsidian" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <p className="text-caption mb-6">Y7 Premium Sauces</p>
          <h1 className="text-hero text-gradient-gold mb-6">
            One Brand. <span className="text-gradient-gold">Endless Flavor.</span>
          </h1>
          <p className="text-hero-sub max-w-2xl mx-auto">
            Discover our comprehensive range of sauces, condiments, and agro products 
            crafted with premium ingredients for exceptional taste and nutrition.
          </p>
        </div>
      </section>

      {/* Individual Products Section */}
      <section className="py-12 lg:py-16 bg-obsidian">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-caption mb-4">
              Y7 / M/S CRUSH IN AGRO PRODUCTS
            </p>
            <h2 className="text-section-title mb-6">
              Master <span className="text-gradient-gold">Product Catalog</span>
            </h2>
            <p className="text-body-large max-w-3xl mx-auto">
              From premium sauces to nutritious agro products - Y7 brings you quality, 
              taste, and health benefits in every product we craft.
            </p>
          </div>

          {/* Category Filter Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <Filter className="w-5 h-5 text-gold mr-2" />
              <h3 className="text-nav font-body-semibold text-cream">Filter by Category</h3>
            </div>
            
            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {categories.slice(1).map((category) => {
                const categoryProducts = allProducts.filter(p => p.category === category);
                const firstProduct = categoryProducts[0];
                const categoryImage = firstProduct?.image;
                
                return (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      relative overflow-hidden rounded-lg border cursor-pointer transition-all duration-300 group
                      ${selectedCategory === category 
                        ? "border-gold bg-gold/10" 
                        : "border-gold/20 hover:border-gold/40"
                      }
                    `}
                  >
                    <div className="w-full h-64 overflow-hidden">
                      {firstProduct?.name === "Tomato Ketchup" ? (
                        <ProductVideo
                          videoSrc={tomatoKetchupVideo}
                          fallbackImage={categoryImage}
                          alt={category}
                          className="w-full h-full"
                        />
                      ) : firstProduct?.name === "Green Chilli Flakes" ? (
                        <ProductVideo
                          videoSrc={greenChilliFlakesVideo}
                          fallbackImage={categoryImage}
                          alt={category}
                          className="w-full h-full"
                        />
                      ) : firstProduct?.name === "Yelkahi Banana Powder" ? (
                        <ProductVideo
                          videoSrc={yelkahiBananaPowderVideo}
                          fallbackImage={categoryImage}
                          alt={category}
                          className="w-full h-full"
                        />
                      ) : firstProduct?.name === "Raw Papaya Powder" ? (
                        <ProductVideo
                          videoSrc={rawPapayaPowderVideo}
                          fallbackImage={categoryImage}
                          alt={category}
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={categoryImage}
                          alt={category}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h4 className="font-body-semibold text-cream text-sm mb-1">{category}</h4>
                      <p className="text-cream/60 text-xs">
                        {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {selectedCategory === category && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gold text-obsidian text-xs">
                          Selected
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    ${selectedCategory === category 
                      ? "bg-gold text-obsidian hover:bg-gold/90" 
                      : "border-gold/30 text-gold hover:bg-gold/10"
                    }
                    transition-all duration-300
                  `}
                >
                  {category}
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-obsidian/20 text-xs"
                  >
                    {category === "All" 
                      ? allProducts.length 
                      : allProducts.filter(p => p.category === category).length
                    }
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-center mt-6">
              <p className="text-cream/60">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} 
                {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              </p>
            </div>
          </div>

          {/* Individual Product Cards */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-24">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Product Image/Video */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative group">
                      <div className="w-full h-96 overflow-hidden rounded-lg border border-gold/20">
                        {product.name === "Tomato Ketchup" ? (
                          <ProductVideo
                            videoSrc={tomatoKetchupVideo}
                            fallbackImage={product.image}
                            alt={product.name}
                            className="w-full h-full"
                          />
                        ) : product.name === "Green Chilli Flakes" ? (
                          <ProductVideo
                            videoSrc={greenChilliFlakesVideo}
                            fallbackImage={product.image}
                            alt={product.name}
                            className="w-full h-full"
                          />
                        ) : product.name === "Yelkahi Banana Powder" ? (
                          <ProductVideo
                            videoSrc={yelkahiBananaPowderVideo}
                            fallbackImage={product.image}
                            alt={product.name}
                            className="w-full h-full"
                          />
                        ) : product.name === "Raw Papaya Powder" ? (
                          <ProductVideo
                            videoSrc={rawPapayaPowderVideo}
                            fallbackImage={product.image}
                            alt={product.name}
                            className="w-full h-full"
                          />
                        ) : (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent rounded-lg" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <Badge variant="outline" className="border-gold text-gold mb-4">
                      {product.category}
                    </Badge>
                    
                    <h3 className="text-product-title mb-4">
                      {product.name}
                    </h3>

                    <p className="text-body-premium mb-6">
                      {product.description}
                    </p>

                    {/* Stock Status */}
                    <div className="mb-6">
                      {product.inStock ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-500 text-red-500">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Key Benefits */}
                    <div className="mb-6">
                      <h4 className="font-body-semibold text-cream mb-3">Key Benefits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.benefits.map((benefit, benefitIndex) => (
                          <Badge
                            key={benefitIndex}
                            variant="outline"
                            className="border-gold/30 text-gold bg-gold/10"
                          >
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link to="/bulk-orders">
                        <Button 
                          variant="default" 
                          className="bg-gold text-obsidian hover:bg-gold/90 transition-all duration-300"
                        >
                          Bulk Order
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button 
                          variant="outline" 
                          className="border-gold text-gold hover:bg-gold/10 transition-all duration-300"
                        >
                          Get Quote
                        </Button>
                      </Link>
                      <Link to="/export">
                        <Button 
                          variant="outline" 
                          className="border-cream/30 text-cream hover:bg-cream/10 transition-all duration-300"
                        >
                          Export Inquiry
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Filter className="w-16 h-16 text-gold/30 mx-auto mb-6" />
                <h3 className="text-section-title mb-4">
                  No Products Found
                </h3>
                <p className="text-body-large mb-6">
                  No products available in the "{selectedCategory}" category at the moment.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory("All")}
                  className="border-gold/30 text-gold hover:bg-gold/10"
                >
                  View All Products
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-gradient-section">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-section-title mb-6">
            Interested in <span className="text-gradient-gold">Bulk Orders?</span>
          </h2>
          <p className="text-body-large max-w-2xl mx-auto mb-10">
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