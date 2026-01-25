import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  ChefHat, 
  Star, 
  Search,
  Filter,
  Flame,
  Heart,
  BookOpen,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import { generateSEO, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo';

// Recipe data
const recipes = [
  {
    id: 1,
    title: 'Peri-Peri Grilled Chicken',
    description: 'Authentic Portuguese-style grilled chicken with Y7 peri-peri marinade',
    image: '/recipes/peri-peri-chicken.jpg',
    cookTime: '45 min',
    difficulty: 'Medium',
    servings: 4,
    category: 'Main Course',
    sauce: 'Peri-Peri',
    rating: 4.9,
    reviews: 847,
    featured: true,
    tags: ['Grilled', 'Spicy', 'Portuguese']
  },
  {
    id: 2,
    title: 'Sambal Fried Rice',
    description: 'Indonesian-style fried rice with aromatic sambal and fresh vegetables',
    image: '/recipes/sambal-fried-rice.jpg',
    cookTime: '20 min',
    difficulty: 'Easy',
    servings: 2,
    category: 'Rice & Noodles',
    sauce: 'Sambal',
    rating: 4.7,
    reviews: 623,
    featured: true,
    tags: ['Indonesian', 'Quick', 'Vegetarian']
  },
  {
    id: 3,
    title: 'Truffle Mayo Deviled Eggs',
    description: 'Elevated deviled eggs with luxurious truffle mayonnaise',
    image: '/recipes/truffle-deviled-eggs.jpg',
    cookTime: '15 min',
    difficulty: 'Easy',
    servings: 6,
    category: 'Appetizers',
    sauce: 'Truffle Mayo',
    rating: 4.8,
    reviews: 456,
    featured: false,
    tags: ['Appetizer', 'Luxury', 'Party']
  },
  {
    id: 4,
    title: 'BBQ Glazed Ribs',
    description: 'Fall-off-the-bone ribs with Kansas City BBQ glaze',
    image: '/recipes/bbq-ribs.jpg',
    cookTime: '3 hours',
    difficulty: 'Hard',
    servings: 4,
    category: 'Main Course',
    sauce: 'BBQ',
    rating: 4.9,
    reviews: 1234,
    featured: true,
    tags: ['BBQ', 'Ribs', 'American']
  },
  {
    id: 5,
    title: 'Harissa Roasted Vegetables',
    description: 'Mediterranean roasted vegetables with spicy harissa coating',
    image: '/recipes/harissa-vegetables.jpg',
    cookTime: '35 min',
    difficulty: 'Easy',
    servings: 4,
    category: 'Sides',
    sauce: 'Harissa',
    rating: 4.6,
    reviews: 389,
    featured: false,
    tags: ['Vegetarian', 'Healthy', 'Mediterranean']
  },
  {
    id: 6,
    title: 'Sriracha Mayo Tuna Poke',
    description: 'Fresh tuna poke bowl with spicy sriracha mayo dressing',
    image: '/recipes/sriracha-poke.jpg',
    cookTime: '15 min',
    difficulty: 'Medium',
    servings: 2,
    category: 'Seafood',
    sauce: 'Sriracha Mayo',
    rating: 4.8,
    reviews: 567,
    featured: false,
    tags: ['Healthy', 'Fresh', 'Asian Fusion']
  }
];

const categories = ['All', 'Main Course', 'Appetizers', 'Sides', 'Rice & Noodles', 'Seafood'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
const sauces = ['All', 'Peri-Peri', 'Sambal', 'Truffle Mayo', 'BBQ', 'Harissa', 'Sriracha Mayo'];

export default function Recipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSauce, setSelectedSauce] = useState('All');

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    const matchesSauce = selectedSauce === 'All' || recipe.sauce === selectedSauce;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesSauce;
  });

  const featuredRecipes = recipes.filter(recipe => recipe.featured);

  // SEO configuration
  const recipeSEO = generateSEO({
    title: 'Y7 Sauce Recipes - Gourmet Cooking with Premium Sauces',
    description: 'Discover expert recipes using Y7 premium sauces. From peri-peri chicken to sambal fried rice, elevate your cooking with authentic global flavors and professional techniques.',
    keywords: 'sauce recipes, peri peri recipes, sambal recipes, BBQ recipes, cooking with sauces, gourmet recipes, Y7 recipes',
    path: '/recipes'
  });

  // Recipe FAQs for schema
  const recipeFAQs = [
    {
      question: "Are Y7 sauce recipes suitable for beginners?",
      answer: "Yes! Our recipes range from easy 15-minute dishes to advanced techniques. Each recipe includes difficulty level, prep time, and step-by-step instructions with tips for success."
    },
    {
      question: "Can I substitute Y7 sauces in the recipes?",
      answer: "Absolutely! While recipes are optimized for specific Y7 sauces, you can experiment with substitutions. We provide flavor notes and alternative sauce suggestions for each recipe."
    },
    {
      question: "Do you provide nutritional information for recipes?",
      answer: "Yes, all Y7 recipes include detailed nutritional information, dietary considerations (vegetarian, gluten-free, etc.), and ingredient substitution suggestions for various dietary needs."
    },
    {
      question: "How often do you add new recipes?",
      answer: "We publish new recipes weekly, featuring seasonal ingredients, trending cuisines, and innovative ways to use Y7 sauces. Subscribe to our newsletter for the latest recipe updates."
    }
  ];

  // Breadcrumb schema
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' }
  ];

  const faqSchema = generateFAQSchema(recipeFAQs);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <SEOHead 
        seo={recipeSEO} 
        schema={[faqSchema, breadcrumbSchema]}
      />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-yellow-500 text-black mb-6 text-sm px-4 py-2">
                GOURMET RECIPE COLLECTION
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Master Gourmet Cooking
                <br />
                <span className="text-yellow-500">with Y7 Sauces</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Discover chef-crafted recipes that showcase the full potential of Y7's premium 
                sauce collection. From quick weeknight dinners to impressive dinner party dishes.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Featured Recipes
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Chef-approved recipes that showcase the versatility and flavor depth 
                of Y7's premium sauce collection.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-black border-gray-800 hover:border-yellow-500 transition-colors h-full group cursor-pointer">
                    <div className="relative">
                      <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-black ml-1" fill="currentColor" />
                        </div>
                      </div>

                      {/* Difficulty Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getDifficultyColor(recipe.difficulty)} bg-black/80`}>
                          {recipe.difficulty}
                        </Badge>
                      </div>

                      {/* Cook Time */}
                      <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded text-white text-sm">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {recipe.cookTime}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-yellow-500 transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{recipe.servings}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{recipe.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters and All Recipes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Filter className="w-5 h-5 mr-2 text-yellow-500" />
                      Category
                    </h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                            selectedCategory === category 
                              ? 'bg-yellow-500 text-black' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <ChefHat className="w-5 h-5 mr-2 text-yellow-500" />
                      Difficulty
                    </h3>
                    <div className="space-y-2">
                      {difficulties.map(difficulty => (
                        <button
                          key={difficulty}
                          onClick={() => setSelectedDifficulty(difficulty)}
                          className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                            selectedDifficulty === difficulty 
                              ? 'bg-yellow-500 text-black' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sauce Filter */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Flame className="w-5 h-5 mr-2 text-yellow-500" />
                      Sauce Type
                    </h3>
                    <div className="space-y-2">
                      {sauces.map(sauce => (
                        <button
                          key={sauce}
                          onClick={() => setSelectedSauce(sauce)}
                          className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                            selectedSauce === sauce 
                              ? 'bg-yellow-500 text-black' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          {sauce}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">
                    All Recipes
                    <span className="text-gray-400 text-lg ml-2">({filteredRecipes.length})</span>
                  </h2>
                  {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedSauce !== 'All') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedDifficulty('All');
                        setSelectedSauce('All');
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="bg-gray-900 border-gray-800 hover:border-yellow-500 transition-colors h-full group cursor-pointer">
                        <div className="relative">
                          <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-yellow-500 text-black">
                              {recipe.sauce}
                            </Badge>
                            <Badge className={`${getDifficultyColor(recipe.difficulty)} bg-black/80`}>
                              {recipe.difficulty}
                            </Badge>
                          </div>

                          {/* Cook Time */}
                          <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded text-white text-sm">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {recipe.cookTime}
                          </div>
                        </div>

                        <CardHeader className="pb-3">
                          <h3 className="text-lg font-semibold group-hover:text-yellow-500 transition-colors line-clamp-1">
                            {recipe.title}
                          </h3>
                          <p className="text-gray-300 text-sm line-clamp-2">{recipe.description}</p>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {recipe.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{recipe.servings}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>{recipe.rating}</span>
                              </div>
                            </div>
                            <span className="text-xs">{recipe.reviews} reviews</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredRecipes.length === 0 && (
                  <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
                    <p className="text-gray-400 mb-6">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                        setSelectedDifficulty('All');
                        setSelectedSauce('All');
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      Show All Recipes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <Heart className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">
                Get Weekly Recipe Inspiration
              </h2>
              <p className="text-gray-300 mb-8">
                Subscribe to receive new recipes, cooking tips, and exclusive sauce pairing 
                guides delivered to your inbox every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}