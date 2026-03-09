// Import all product images
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
import greenChilliFlakesFallback from "@/assets/Green-Chilli-Flakes.png";
import greenChilliPowder from "@/assets/Green-Chilli-Powder.png";
import yelkahiBananaPowderFallback from "@/assets/Yelkahi-Banana-Powde.png";
import rasabaleBananaPowder from "@/assets/Rasabale-Banana-Powder.png";
import g9BananaPowder from "@/assets/G9-Banana-Powder.png";
import rawPapayaPowderFallback from "@/assets/Raw-Papaya-Powder.png";
import mangoPowder from "@/assets/Mango-Powder.png";
import guavaPowder from "@/assets/Guava-Powder.png";
import sweetPotatoPowder from "@/assets/Sweet-Potato-Powder.png";
import chikooSapotaPowder from "@/assets/Chikoo(Sapota)-Powder.png";

export interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string;
  tagline?: string;
  benefits: string[];
  uses: string;
  category: string;
  image: string;
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

// All 26 products data
export const allProducts: ProductData[] = [
  {
    id: 1,
    name: "Tomato Ketchup",
    slug: "tomato-ketchup",
    description: "Classic tomato ketchup made from ripe, high-quality tomatoes, blended with a balanced mix of spices for rich flavor and smooth texture.",
    tagline: "Rich tomato base with balanced spices",
    benefits: ["Rich tomato antioxidants (lycopene)", "Enhances taste instantly", "Low-fat condiment", "Kid-friendly flavor"],
    uses: "Burgers, fries, sandwiches, snacks, wraps",
    category: "Sauces & Condiments",
    image: tomatoKetchup,
    inStock: true,
    isBestSeller: true
  },
  {
    id: 2,
    name: "Tomato Sauce / Continental Sauce",
    slug: "tomato-sauce-continental",
    description: "A tangy, mildly spiced tomato-based sauce ideal for continental dishes and fusion recipes.",
    tagline: "Perfect for continental and fusion dishes",
    benefits: ["Improves digestion", "Adds depth of flavor", "Low calorie", "Versatile use"],
    uses: "Pasta, pizzas, sandwiches, gravies",
    category: "Sauces & Condiments",
    image: tomatoSauce,
    inStock: true
  },
  {
    id: 3,
    name: "Snack Sauce",
    slug: "snack-sauce",
    description: "A bold, tangy, spicy sauce crafted for Indian snacks and street food flavors.",
    tagline: "Bold flavor for Indian street food",
    benefits: ["Bold tangy flavor", "Perfect for Indian snacks", "Appetite stimulant", "No artificial flavors"],
    uses: "Samosas, pakoras, chaat, fries",
    category: "Sauces & Condiments",
    image: snackSauce,
    inStock: true
  },
  {
    id: 4,
    name: "Green Chilli Sauce",
    slug: "green-chilli-sauce",
    description: "Spicy sauce made from fresh green chilies, delivering sharp heat and bold aroma.",
    tagline: "Fresh green chilies with sharp heat",
    benefits: ["Made from fresh green chilies", "Sharp heat level", "Rich in Vitamin C", "Boosts metabolism"],
    uses: "Noodles, momos, stir-fries",
    category: "Sauces & Condiments",
    image: greenChilliSauce,
    inStock: true
  },
  {
    id: 5,
    name: "Red Chilli Sauce",
    slug: "red-chilli-sauce",
    description: "Fiery red chili sauce with rich color and intense flavor for spicy food lovers.",
    tagline: "Intense red chili flavor",
    benefits: ["Intense red chili flavor", "Rich color", "Enhances metabolism", "Antioxidant rich"],
    uses: "Chinese dishes, snacks, spring rolls",
    category: "Sauces & Condiments",
    image: redChilliSauce,
    inStock: true
  },
  {
    id: 6,
    name: "Soya Sauce",
    slug: "soya-sauce",
    description: "Fermented soy-based sauce delivering deep umami flavor for Asian cuisines.",
    tagline: "Authentic umami for Asian dishes",
    benefits: ["Authentic umami flavor", "Fermented goodness", "Low calorie", "Versatile use"],
    uses: "Fried rice, noodles, marinades",
    category: "Sauces & Condiments",
    image: soyaSauce,
    inStock: true
  },
  {
    id: 7,
    name: "Vinegar",
    slug: "vinegar",
    description: "Naturally fermented vinegar for culinary and health applications.",
    tagline: "Naturally fermented for health",
    benefits: ["Natural fermentation", "Aids digestion", "Preservative properties", "Tangy flavor"],
    uses: "Salads, pickling, marinades",
    category: "Sauces & Condiments",
    image: vinegar,
    inStock: true
  },
  {
    id: 8,
    name: "Hot & Spicy Sauce",
    slug: "hot-spicy-sauce",
    description: "A powerful blend of chilies and spices for intense heat lovers.",
    tagline: "Powerful blend for heat lovers",
    benefits: ["Intense heat", "Bold flavor", "Metabolism booster", "Appetite enhancer"],
    uses: "Grills, wraps, burgers",
    category: "Sauces & Condiments",
    image: hotSpicySauce,
    inStock: true
  },
  {
    id: 9,
    name: "Garlic Sauce",
    slug: "garlic-sauce",
    description: "Creamy garlic-based sauce with bold aroma and savory richness.",
    tagline: "Creamy garlic with bold aroma",
    benefits: ["Bold garlic flavor", "Creamy texture", "Heart health support", "Immunity booster"],
    uses: "Shawarma, wraps, dips",
    category: "Sauces & Condiments",
    image: garlicSauce,
    inStock: true
  },
  {
    id: 10,
    name: "Schezwan Sauce",
    slug: "schezwan-sauce",
    description: "Authentic Schezwan sauce made with red chilies, garlic, and aromatic spices.",
    tagline: "Authentic Indo-Chinese flavor",
    benefits: ["Authentic Indo-Chinese flavor", "Perfect heat level", "Rich garlic blend", "Versatile cooking sauce"],
    uses: "Fried rice, noodles, momos",
    category: "Sauces & Condiments",
    image: schezwanSauce,
    inStock: true,
    isBestSeller: true
  },
  {
    id: 11,
    name: "Lite Mayonnaise",
    slug: "lite-mayonnaise",
    description: "Low-fat creamy mayonnaise with smooth texture and mild flavor.",
    tagline: "Low-fat creamy option",
    benefits: ["Low-fat formula", "Smooth texture", "Mild flavor", "Healthier option"],
    uses: "Sandwiches, burgers, dips",
    category: "Sauces & Condiments",
    image: liteMayonnaise,
    inStock: true
  },
  {
    id: 12,
    name: "Classic Mayonnaise",
    slug: "classic-mayonnaise",
    description: "Rich and creamy mayonnaise made from premium quality oils and fresh eggs.",
    tagline: "Premium quality creamy mayo",
    benefits: ["Premium quality", "Creamy texture", "Fresh egg-based", "No trans fats"],
    uses: "Sandwiches, burgers, salads",
    category: "Sauces & Condiments",
    image: classicMayonnaise,
    inStock: true
  },
  {
    id: 13,
    name: "Cheese Blend",
    slug: "cheese-blend",
    description: "Creamy cheese-flavored sauce for rich, savory dishes.",
    tagline: "Rich cheesy flavor",
    benefits: ["Rich cheesy flavor", "Creamy texture", "Versatile use", "Kid-friendly"],
    uses: "Nachos, fries, pasta",
    category: "Sauces & Condiments",
    image: cheeseBlend,
    inStock: true
  },
  {
    id: 14,
    name: "Peri Peri Sauce",
    slug: "peri-peri-sauce",
    description: "Tangy, spicy African-style sauce made with bird's eye chilies.",
    tagline: "African fire and flavor",
    benefits: ["African fire & flavor", "Tangy and spicy", "Rich in Vitamin C", "Metabolism booster"],
    uses: "Grilled chicken, fries",
    category: "Sauces & Condiments",
    image: periPeriSauce,
    inStock: true
  },
  {
    id: 15,
    name: "Romesco Sauce",
    slug: "romesco-sauce",
    description: "Spanish-style nutty tomato-based sauce with rich smoky flavor.",
    tagline: "Spanish nutty delight",
    benefits: ["Spanish nutty delight", "Smoky flavor", "Rich in antioxidants", "Unique taste"],
    uses: "Grilled vegetables, pasta",
    category: "Sauces & Condiments",
    image: romescoSauce,
    inStock: true
  },
  {
    id: 16,
    name: "Sambal Sauce",
    slug: "sambal-sauce",
    description: "Indonesian-style chili sauce with bold spice and tangy notes.",
    tagline: "Indonesian spicy tang",
    benefits: ["Indonesian spicy tang", "Bold spice", "Tangy notes", "Authentic flavor"],
    uses: "Rice, noodles, stir-fries",
    category: "Sauces & Condiments",
    image: sambalSauce,
    inStock: true
  },
  {
    id: 17,
    name: "Green Chilli Flakes",
    slug: "green-chilli-flakes",
    description: "Dried green chilies crushed into flakes for bold heat and aroma.",
    tagline: "Bold heat and aroma",
    benefits: ["Boosts metabolism", "Rich in Vitamin C", "Improves digestion", "Bold heat"],
    uses: "Pizza topping, spice blends",
    category: "Flakes & Powders (Agro Products)",
    image: greenChilliFlakesFallback,
    inStock: true
  },
  {
    id: 18,
    name: "Green Chilli Powder",
    slug: "green-chilli-powder",
    description: "Finely ground green chili powder with intense flavor.",
    tagline: "Intense green chili flavor",
    benefits: ["Intense flavor", "Rich in Vitamin C", "Metabolism booster", "Versatile spice"],
    uses: "Curries, marinades",
    category: "Flakes & Powders (Agro Products)",
    image: greenChilliPowder,
    inStock: true
  },
  {
    id: 19,
    name: "Yelkahi Banana Powder",
    slug: "yelkahi-banana-powder",
    description: "Made from premium Yelkahi bananas grown near Tungabhadra River.",
    tagline: "Premium Tungabhadra bananas",
    benefits: ["Resistant starch", "Gut health support", "Low glycemic index", "Energy booster"],
    uses: "Smoothies, porridge",
    category: "Raw Banana Powders",
    image: yelkahiBananaPowderFallback,
    inStock: true
  },
  {
    id: 20,
    name: "Rasabale Banana Powder",
    slug: "rasabale-banana-powder",
    description: "Powdered aromatic bananas from Cauvery river belt.",
    tagline: "Aromatic Cauvery bananas",
    benefits: ["Energy boosting", "Rich in potassium", "Aromatic flavor", "Digestive support"],
    uses: "Smoothies, health drinks",
    category: "Raw Banana Powders",
    image: rasabaleBananaPowder,
    inStock: true
  },
  {
    id: 21,
    name: "G9 Banana Powder",
    slug: "g9-banana-powder",
    description: "Powder made from export-grade Grand Naine bananas.",
    tagline: "Export-grade Grand Naine",
    benefits: ["Export-grade quality", "Rich in fiber", "Energy booster", "Nutrient-rich"],
    uses: "Smoothies, baking",
    category: "Raw Banana Powders",
    image: g9BananaPowder,
    inStock: true
  },
  {
    id: 22,
    name: "Raw Papaya Powder",
    slug: "raw-papaya-powder",
    description: "Unripe papaya powder rich in papain enzyme.",
    tagline: "Enzyme-rich papaya powder",
    benefits: ["Improves digestion", "Anti-inflammatory", "Detox support", "Enzyme-rich"],
    uses: "Health drinks, cooking",
    category: "Fruit & Vegetable Powders",
    image: rawPapayaPowderFallback,
    inStock: true
  },
  {
    id: 23,
    name: "Mango Powder",
    slug: "mango-powder",
    description: "Naturally sweet mango powder from ripe mangoes.",
    tagline: "Naturally sweet mango",
    benefits: ["Rich in Vitamin A & C", "Immunity booster", "Natural sweetness", "Antioxidant-rich"],
    uses: "Smoothies, desserts",
    category: "Fruit & Vegetable Powders",
    image: mangoPowder,
    inStock: true
  },
  {
    id: 24,
    name: "Guava Powder",
    slug: "guava-powder",
    description: "Powdered guava rich in fiber and antioxidants.",
    tagline: "Fiber-rich guava powder",
    benefits: ["Fiber-rich", "Improves digestion", "Boosts immunity", "Antioxidant power"],
    uses: "Health drinks, smoothies",
    category: "Fruit & Vegetable Powders",
    image: guavaPowder,
    inStock: true
  },
  {
    id: 25,
    name: "Sweet Potato Powder",
    slug: "sweet-potato-powder",
    description: "Naturally sweet powder made from dried sweet potatoes.",
    tagline: "Naturally sweet and nutritious",
    benefits: ["Rich in fiber", "Blood sugar control", "Natural sweetness", "Nutrient-dense"],
    uses: "Baking, smoothies",
    category: "Fruit & Vegetable Powders",
    image: sweetPotatoPowder,
    inStock: true
  },
  {
    id: 26,
    name: "Chikoo (Sapota) Powder",
    slug: "chikoo-sapota-powder",
    description: "Sweet, nutrient-rich sapota powder.",
    tagline: "Sweet nutrient-rich sapota",
    benefits: ["Energy booster", "Digestive support", "Antioxidant rich", "Natural sweetness"],
    uses: "Smoothies, desserts",
    category: "Fruit & Vegetable Powders",
    image: chikooSapotaPowder,
    inStock: true
  }
];

// Helper function to get products by category
export const getProductsByCategory = (category: string): ProductData[] => {
  if (category === "All") return allProducts;
  return allProducts.filter(product => product.category === category);
};

// Helper function to get category names
export const getCategoryNames = (): string[] => {
  return Array.from(new Set(allProducts.map(product => product.category)));
};
