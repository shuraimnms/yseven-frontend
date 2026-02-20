import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Package, Truck, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import ProductVideo from '@/components/ProductVideo';

// Import all product images
import tomatoKetchup from '@/assets/Tomato-Ketchup.png';
import tomatoSauce from '@/assets/Tomato-Sauce.png';
import snackSauce from '@/assets/Snack-Sauce.png';
import greenChilliSauce from '@/assets/Green-Chilli-Sauce.png';
import redChilliSauce from '@/assets/Red-Chilli-Sauce.png';
import soyaSauce from '@/assets/Soya-Sauce.png';
import vinegar from '@/assets/Vinegar.png';
import hotSpicySauce from '@/assets/Hot-&-Spicy-Sauce.png';
import garlicSauce from '@/assets/Garlic-Sauce.png';
import schezwanSauce from '@/assets/Schezwan-Sauce.png';
import liteMayonnaise from '@/assets/Lite-Mayonnaise.png';
import classicMayonnaise from '@/assets/Classic-Mayonnaise.png';
import cheeseBlend from '@/assets/Cheese-Blend.png';
import periPeriSauce from '@/assets/Peri-Peri-Sauce.png';
import romescoSauce from '@/assets/Romesco-Sauce.png';
import sambalSauce from '@/assets/Sambal-Sauce.png';
import greenChilliFlakesVideo from '@/assets/Green-Chilli-Flakes.mp4';
import greenChilliFlakesFallback from '@/assets/Green-Chilli-Flakes.png';
import tomatoKetchupVideo from '@/assets/Tomato-Ketchup.mp4';
import greenChilliPowder from '@/assets/Green-Chilli-Powder.png';
import yelkahiBananaPowderVideo from '@/assets/Yelkahi-Banana-Powde.mp4';
import yelkahiBananaPowderFallback from '@/assets/Yelkahi-Banana-Powde.png';
import rawPapayaPowderVideo from '@/assets/Raw-Papaya-Powder.mp4';
import rasabaleBananaPowder from '@/assets/Rasabale-Banana-Powder.png';
import g9BananaPowder from '@/assets/G9-Banana-Powder.png';
import rawPapayaPowderFallback from '@/assets/Raw-Papaya-Powder.png';
import mangoPowder from '@/assets/Mango-Powder.png';
import guavaPowder from '@/assets/Guava-Powder.png';
import sweetPotatoPowder from '@/assets/Sweet-Potato-Powder.png';
import chikooSapotaPowder from '@/assets/Chikoo(Sapota)-Powder.png';

// Product data with variants
const productsData = [
  {
    id: 1,
    slug: 'tomato-ketchup',
    name: 'Tomato Ketchup',
    tagline: 'The Classic Taste Everyone Loves',
    description: 'Premium tomato ketchup made from ripe, sun-ripened tomatoes, blended with a perfect balance of spices and natural ingredients. Our ketchup delivers rich flavor, smooth texture, and consistent quality that makes every meal memorable.',
    category: 'Sauces & Condiments',
    image: tomatoKetchup,
    videoSrc: tomatoKetchupVideo,
    hasVideo: true,
    keyFeatures: [
      'Made from 100% ripe tomatoes',
      'No artificial colors or preservatives',
      'Rich in natural lycopene antioxidants',
      'Smooth and consistent texture',
      'Perfect balance of sweet and tangy',
      'FSSAI certified and quality tested'
    ],
    shelfLife: '12 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    variants: [
      { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
      { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: [
      { nutrient: 'Energy', per100g: '110 kcal' },
      { nutrient: 'Protein', per100g: '1.2g' },
      { nutrient: 'Carbohydrates', per100g: '25g' },
      { nutrient: 'Sugar', per100g: '22g' },
      { nutrient: 'Fat', per100g: '0.1g' },
      { nutrient: 'Sodium', per100g: '1200mg' }
    ],
    usageImages: [
      { title: 'With Snacks', description: 'Perfect with fries, nuggets, and finger foods' },
      { title: 'With Fast Food', description: 'Ideal for burgers, sandwiches, and wraps' },
      { title: 'With Traditional Items', description: 'Great with pakoras, samosas, and cutlets' },
      { title: 'With Combo Meals', description: 'Complements pizza, pasta, and more' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '12 months from the date of manufacturing when stored properly in a cool, dry place.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, we specialize in bulk supply for restaurants, hotels, caterers, and retail businesses with competitive B2B pricing.' },
      { question: 'Is private labeling available?', answer: 'Yes, we offer private labeling services for bulk orders. Contact us for minimum order quantities and customization options.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size. For mixed orders and custom requirements, please contact our sales team.' },
      { question: 'Do you export?', answer: 'Yes, we export to multiple countries with all necessary certifications and export-quality packaging.' }
    ]
  },
  {
    id: 2,
    slug: 'classic-mayonnaise',
    name: 'Classic Mayonnaise',
    tagline: 'Creamy Perfection in Every Spoon',
    description: 'Rich and creamy mayonnaise made from premium quality oils and fresh eggs. Our classic mayonnaise delivers smooth texture, rich taste, and versatile application for all your culinary needs.',
    category: 'Sauces & Condiments',
    image: classicMayonnaise,
    hasVideo: false,
    keyFeatures: [
      'Made with premium vegetable oils',
      'Fresh egg-based formulation',
      'Smooth and creamy texture',
      'No trans fats',
      'Perfect for sandwiches and dips',
      'FSSAI certified'
    ],
    shelfLife: '9 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening and consume within 30 days.',
    variants: [
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: [
      { nutrient: 'Energy', per100g: '680 kcal' },
      { nutrient: 'Protein', per100g: '1.5g' },
      { nutrient: 'Carbohydrates', per100g: '2g' },
      { nutrient: 'Sugar', per100g: '1g' },
      { nutrient: 'Fat', per100g: '75g' },
      { nutrient: 'Sodium', per100g: '800mg' }
    ],
    usageImages: [
      { title: 'With Sandwiches', description: 'Perfect spread for all types of sandwiches' },
      { title: 'With Burgers', description: 'Essential ingredient for gourmet burgers' },
      { title: 'As Dip Base', description: 'Create delicious dips and dressings' },
      { title: 'With Salads', description: 'Make creamy salad dressings' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '9 months from the date of manufacturing when stored properly. After opening, refrigerate and consume within 30 days.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, we offer bulk supply with competitive pricing for B2B customers including restaurants, hotels, and food service providers.' },
      { question: 'Is private labeling available?', answer: 'Yes, private labeling is available for bulk orders. Contact us for customization details.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size. Mixed orders are welcome.' },
      { question: 'Do you export?', answer: 'Yes, we export with proper certifications and export-grade packaging.' }
    ]
  },
  {
    id: 3,
    slug: 'schezwan-sauce',
    name: 'Schezwan Sauce',
    tagline: 'Bold Indo-Chinese Flavor',
    description: 'Authentic Schezwan sauce made with red chilies, garlic, and aromatic spices. Perfect for Indo-Chinese dishes, this sauce delivers the right balance of heat, flavor, and aroma that food lovers crave.',
    category: 'Sauces & Condiments',
    image: schezwanSauce,
    hasVideo: false,
    keyFeatures: [
      'Authentic Indo-Chinese flavor',
      'Made with premium red chilies',
      'Rich garlic and spice blend',
      'Perfect heat level',
      'Versatile cooking sauce',
      'No artificial flavors'
    ],
    shelfLife: '12 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    variants: [
      { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
      { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: [
      { nutrient: 'Energy', per100g: '95 kcal' },
      { nutrient: 'Protein', per100g: '2g' },
      { nutrient: 'Carbohydrates', per100g: '18g' },
      { nutrient: 'Sugar', per100g: '8g' },
      { nutrient: 'Fat', per100g: '2g' },
      { nutrient: 'Sodium', per100g: '1500mg' }
    ],
    usageImages: [
      { title: 'With Fried Rice', description: 'Essential for authentic Schezwan fried rice' },
      { title: 'With Noodles', description: 'Perfect for Schezwan noodles and Hakka noodles' },
      { title: 'With Momos', description: 'Ideal dipping sauce for momos and dumplings' },
      { title: 'As Marinade', description: 'Great for marinating chicken and vegetables' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '12 months from manufacturing date when stored in a cool, dry place.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, we provide bulk supply for restaurants, cloud kitchens, and food businesses with competitive pricing.' },
      { question: 'Is private labeling available?', answer: 'Yes, we offer private labeling for bulk orders. Contact us for details.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size. Mixed orders accepted.' },
      { question: 'Do you export?', answer: 'Yes, we export globally with all necessary certifications.' }
    ]
  }
];

// Helper function to create standard product data
const createProductData = (
  id: number,
  slug: string,
  name: string,
  tagline: string,
  description: string,
  category: string,
  image: string,
  videoSrc?: string,
  hasVideo: boolean = false
) => ({
  id,
  slug,
  name,
  tagline,
  description,
  category,
  image,
  videoSrc,
  hasVideo,
  keyFeatures: [
    'Premium quality ingredients',
    'FSSAI certified',
    'No artificial preservatives',
    'Consistent quality',
    'Export quality available',
    'Bulk supply available'
  ],
  shelfLife: '12 months from manufacturing date',
  storage: 'Store in a cool, dry place. Refrigerate after opening.',
  variants: [
    { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
    { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
    { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
    { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
    { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
    { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
  ],
  moq: '1 carton per size',
  privateLabeling: true,
  exportQuality: true,
  nutritionalInfo: [
    { nutrient: 'Energy', per100g: '95 kcal' },
    { nutrient: 'Protein', per100g: '2g' },
    { nutrient: 'Carbohydrates', per100g: '18g' },
    { nutrient: 'Sugar', per100g: '8g' },
    { nutrient: 'Fat', per100g: '2g' },
    { nutrient: 'Sodium', per100g: '1500mg' }
  ],
  usageImages: [
    { title: 'With Snacks', description: 'Perfect accompaniment for snacks' },
    { title: 'With Fast Food', description: 'Ideal for fast food items' },
    { title: 'With Traditional Items', description: 'Great with traditional dishes' },
    { title: 'With Combo Meals', description: 'Complements combo meals' }
  ],
  faqs: [
    { question: 'What is the shelf life?', answer: '12 months from manufacturing date when stored properly.' },
    { question: 'Do you provide bulk supply?', answer: 'Yes, we offer bulk supply with competitive B2B pricing.' },
    { question: 'Is private labeling available?', answer: 'Yes, private labeling is available for bulk orders.' },
    { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size.' },
    { question: 'Do you export?', answer: 'Yes, we export globally with all necessary certifications.' }
  ]
});

// Add all remaining products
productsData.push(
  // 4-7: Missing sauces
  {
    id: 4,
    slug: 'tomato-sauce-continental',
    name: 'Tomato Sauce / Continental Sauce',
    tagline: 'Tangy & Versatile Continental Flavor',
    description: 'A tangy, mildly spiced tomato-based sauce ideal for continental dishes and fusion recipes. Perfect for pasta, pizzas, and sandwiches.',
    category: 'Sauces & Condiments',
    image: tomatoSauce,
    hasVideo: false,
    keyFeatures: ['Tangy tomato base', 'Mild spice level', 'Versatile for multiple cuisines', 'No artificial colors', 'Perfect for continental dishes', 'FSSAI certified'],
    shelfLife: '12 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    variants: [
      { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
      { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: [
      { nutrient: 'Energy', per100g: '105 kcal' },
      { nutrient: 'Protein', per100g: '1.5g' },
      { nutrient: 'Carbohydrates', per100g: '23g' },
      { nutrient: 'Sugar', per100g: '20g' },
      { nutrient: 'Fat', per100g: '0.2g' },
      { nutrient: 'Sodium', per100g: '1100mg' }
    ],
    usageImages: [
      { title: 'With Pasta', description: 'Perfect base for pasta dishes' },
      { title: 'With Pizza', description: 'Ideal pizza sauce' },
      { title: 'With Sandwiches', description: 'Great sandwich spread' },
      { title: 'With Gravies', description: 'Excellent for gravies' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '12 months from manufacturing date.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, we offer bulk supply for restaurants and food businesses.' },
      { question: 'Is private labeling available?', answer: 'Yes, private labeling available for bulk orders.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size.' },
      { question: 'Do you export?', answer: 'Yes, we export with proper certifications.' }
    ]
  },
  {
    id: 5,
    slug: 'snack-sauce',
    name: 'Snack Sauce',
    tagline: 'Bold & Tangy Street Food Flavor',
    description: 'A bold, tangy, spicy sauce crafted for Indian snacks and street food flavors. Perfect for samosas, pakoras, and chaat.',
    category: 'Sauces & Condiments',
    image: snackSauce,
    hasVideo: false,
    keyFeatures: ['Bold tangy flavor', 'Perfect for Indian snacks', 'Street food authentic taste', 'No artificial flavors', 'Appetite stimulant', 'FSSAI certified'],
    shelfLife: '12 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    variants: [
      { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
      { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: [
      { nutrient: 'Energy', per100g: '100 kcal' },
      { nutrient: 'Protein', per100g: '1.8g' },
      { nutrient: 'Carbohydrates', per100g: '22g' },
      { nutrient: 'Sugar', per100g: '18g' },
      { nutrient: 'Fat', per100g: '0.3g' },
      { nutrient: 'Sodium', per100g: '1300mg' }
    ],
    usageImages: [
      { title: 'With Samosas', description: 'Perfect dipping sauce for samosas' },
      { title: 'With Pakoras', description: 'Ideal for pakoras and fritters' },
      { title: 'With Chaat', description: 'Essential for chaat items' },
      { title: 'With Fries', description: 'Great with French fries' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '12 months from manufacturing date.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, bulk supply available with competitive pricing.' },
      { question: 'Is private labeling available?', answer: 'Yes, for bulk orders.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size.' },
      { question: 'Do you export?', answer: 'Yes, we export globally.' }
    ]
  },
  {
    id: 6,
    slug: 'green-chilli-sauce',
    name: 'Green Chilli Sauce',
    tagline: 'Fresh Green Heat',
    description: 'Spicy sauce made from fresh green chilies, delivering sharp heat and bold aroma. Perfect for noodles, momos, and stir-fries.',
    category: 'Sauces & Condiments',
    image: greenChilliSauce,
    hasVideo: false,
    keyFeatures: ['Made from fresh green chilies', 'Sharp heat level', 'Rich in Vitamin C', 'Boosts metabolism', 'No artificial colors', 'FSSAI certified'],
    shelfLife: '12 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    variants: [
      { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
      { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: [
      { nutrient: 'Energy', per100g: '85 kcal' },
      { nutrient: 'Protein', per100g: '2.2g' },
      { nutrient: 'Carbohydrates', per100g: '16g' },
      { nutrient: 'Sugar', per100g: '6g' },
      { nutrient: 'Fat', per100g: '1.5g' },
      { nutrient: 'Sodium', per100g: '1400mg' }
    ],
    usageImages: [
      { title: 'With Noodles', description: 'Perfect for noodle dishes' },
      { title: 'With Momos', description: 'Ideal dipping sauce for momos' },
      { title: 'With Stir-Fry', description: 'Great for stir-fry dishes' },
      { title: 'As Marinade', description: 'Excellent marinade base' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '12 months from manufacturing date.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, bulk supply available.' },
      { question: 'Is private labeling available?', answer: 'Yes, for bulk orders.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size.' },
      { question: 'Do you export?', answer: 'Yes, we export globally.' }
    ]
  },
  {
    id: 7,
    slug: 'red-chilli-sauce',
    name: 'Red Chilli Sauce',
    tagline: 'Fiery Red Intensity',
    description: 'Fiery red chili sauce with rich color and intense flavor for spicy food lovers. Perfect for Chinese dishes and snacks.',
    category: 'Sauces & Condiments',
    image: redChilliSauce,
    hasVideo: false,
    keyFeatures: ['Intense red chili flavor', 'Rich color', 'Enhances metabolism', 'Antioxidant rich', 'Perfect heat level', 'FSSAI certified'],
    shelfLife: '12 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    variants: [
      { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
      { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: [
      { nutrient: 'Energy', per100g: '90 kcal' },
      { nutrient: 'Protein', per100g: '2g' },
      { nutrient: 'Carbohydrates', per100g: '17g' },
      { nutrient: 'Sugar', per100g: '7g' },
      { nutrient: 'Fat', per100g: '1.8g' },
      { nutrient: 'Sodium', per100g: '1450mg' }
    ],
    usageImages: [
      { title: 'With Chinese Dishes', description: 'Perfect for Chinese cuisine' },
      { title: 'With Snacks', description: 'Ideal dipping sauce' },
      { title: 'With Dips', description: 'Great dip base' },
      { title: 'With Spring Rolls', description: 'Excellent with spring rolls' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '12 months from manufacturing date.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, bulk supply available.' },
      { question: 'Is private labeling available?', answer: 'Yes, for bulk orders.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size.' },
      { question: 'Do you export?', answer: 'Yes, we export globally.' }
    ]
  },
  // 8-26: All remaining products
  ...[ 
    { id: 8, slug: 'soya-sauce', name: 'Soya Sauce', tagline: 'Authentic Umami Flavor', description: 'Fermented soy-based sauce delivering deep umami flavor for Asian cuisines. Perfect for fried rice, noodles, and marinades.', category: 'Sauces & Condiments', image: soyaSauce },
    { id: 9, slug: 'vinegar', name: 'Vinegar', tagline: 'Natural Fermented Goodness', description: 'Naturally fermented vinegar for culinary and health applications. Ideal for salads, pickling, and marinades.', category: 'Sauces & Condiments', image: vinegar },
    { id: 10, slug: 'hot-spicy-sauce', name: 'Hot & Spicy Sauce', tagline: 'Intense Heat for Heat Lovers', description: 'A powerful blend of chilies and spices for intense heat lovers. Perfect for grills, wraps, and burgers.', category: 'Sauces & Condiments', image: hotSpicySauce },
    { id: 11, slug: 'garlic-sauce', name: 'Garlic Sauce', tagline: 'Creamy Garlic Richness', description: 'Creamy garlic-based sauce with bold aroma and savory richness. Ideal for shawarma, wraps, and dips.', category: 'Sauces & Condiments', image: garlicSauce },
    { id: 12, slug: 'lite-mayonnaise', name: 'Lite Mayonnaise', tagline: 'Light & Healthy Creaminess', description: 'Low-fat creamy mayonnaise with smooth texture and mild flavor. Perfect for sandwiches, burgers, and dips.', category: 'Sauces & Condiments', image: liteMayonnaise },
    { id: 13, slug: 'cheese-blend', name: 'Cheese Blend', tagline: 'Rich Cheesy Goodness', description: 'Creamy cheese-flavored sauce for rich, savory dishes. Ideal for nachos, fries, and pasta.', category: 'Sauces & Condiments', image: cheeseBlend },
    { id: 14, slug: 'peri-peri-sauce', name: 'Peri Peri Sauce', tagline: 'African Fire & Flavor', description: 'Tangy, spicy African-style sauce made with bird\'s eye chilies. Perfect for grilled chicken and fries.', category: 'Sauces & Condiments', image: periPeriSauce },
    { id: 15, slug: 'romesco-sauce', name: 'Romesco Sauce', tagline: 'Spanish Nutty Delight', description: 'Spanish-style nutty tomato-based sauce with rich smoky flavor. Great for grilled vegetables and pasta.', category: 'Sauces & Condiments', image: romescoSauce },
    { id: 16, slug: 'sambal-sauce', name: 'Sambal Sauce', tagline: 'Indonesian Spicy Tang', description: 'Indonesian-style chili sauce with bold spice and tangy notes. Perfect for rice, noodles, and stir-fries.', category: 'Sauces & Condiments', image: sambalSauce },
    { id: 17, slug: 'green-chilli-flakes', name: 'Green Chilli Flakes', tagline: 'Dried Green Heat', description: 'Dried green chilies crushed into flakes for bold heat and aroma. Perfect for pizza topping and spice blends.', category: 'Flakes & Powders (Agro Products)', image: greenChilliFlakesFallback, videoSrc: greenChilliFlakesVideo, hasVideo: true },
    { id: 18, slug: 'green-chilli-powder', name: 'Green Chilli Powder', tagline: 'Finely Ground Green Fire', description: 'Finely ground green chili powder with intense flavor. Ideal for curries and marinades.', category: 'Flakes & Powders (Agro Products)', image: greenChilliPowder },
    { id: 19, slug: 'yelkahi-banana-powder', name: 'Yelkahi Banana Powder', tagline: 'Premium Tungabhadra Bananas', description: 'Made from premium Yelkahi bananas grown near Tungabhadra River. Rich in resistant starch and gut health support.', category: 'Raw Banana Powders', image: yelkahiBananaPowderFallback, videoSrc: yelkahiBananaPowderVideo, hasVideo: true },
    { id: 20, slug: 'rasabale-banana-powder', name: 'Rasabale Banana Powder', tagline: 'Aromatic Cauvery Bananas', description: 'Powdered aromatic bananas from Cauvery river belt. Energy boosting and rich in potassium.', category: 'Raw Banana Powders', image: rasabaleBananaPowder },
    { id: 21, slug: 'g9-banana-powder', name: 'G9 Banana Powder', tagline: 'Export-Grade Grand Naine', description: 'Powder made from export-grade Grand Naine bananas. Rich in fiber and energy booster.', category: 'Raw Banana Powders', image: g9BananaPowder },
    { id: 22, slug: 'raw-papaya-powder', name: 'Raw Papaya Powder', tagline: 'Enzyme-Rich Papain Power', description: 'Unripe papaya powder rich in papain enzyme. Improves digestion and provides detox support.', category: 'Fruit & Vegetable Powders', image: rawPapayaPowderFallback, videoSrc: rawPapayaPowderVideo, hasVideo: true },
    { id: 23, slug: 'mango-powder', name: 'Mango Powder', tagline: 'Sweet Tropical Goodness', description: 'Naturally sweet mango powder from ripe mangoes. Rich in Vitamin A & C and immunity booster.', category: 'Fruit & Vegetable Powders', image: mangoPowder },
    { id: 24, slug: 'guava-powder', name: 'Guava Powder', tagline: 'Fiber-Rich Tropical Fruit', description: 'Powdered guava rich in fiber and antioxidants. Improves digestion and boosts immunity.', category: 'Fruit & Vegetable Powders', image: guavaPowder },
    { id: 25, slug: 'sweet-potato-powder', name: 'Sweet Potato Powder', tagline: 'Naturally Sweet Nutrition', description: 'Naturally sweet powder made from dried sweet potatoes. Rich in fiber and helps with blood sugar control.', category: 'Fruit & Vegetable Powders', image: sweetPotatoPowder },
    { id: 26, slug: 'chikoo-sapota-powder', name: 'Chikoo (Sapota) Powder', tagline: 'Sweet Nutrient-Rich Sapota', description: 'Sweet, nutrient-rich sapota powder. Energy booster with digestive support and antioxidant rich.', category: 'Fruit & Vegetable Powders', image: chikooSapotaPowder }
  ].map(p => ({
    ...p,
    hasVideo: p.hasVideo || false,
    keyFeatures: ['Premium quality ingredients', 'FSSAI certified', 'No artificial preservatives', 'Consistent quality', 'Export quality available', 'Bulk supply available'],
    shelfLife: '12 months from manufacturing date',
    storage: 'Store in a cool, dry place. Refrigerate after opening.',
    variants: p.category.includes('Powder') || p.category.includes('Flakes') ? [
      { size: '50g', netWeight: '50g', packaging: 'Pouch', cartonQty: '100 pouches' },
      { size: '100g', netWeight: '100g', packaging: 'Pouch', cartonQty: '50 pouches' },
      { size: '250g', netWeight: '250g', packaging: 'Pouch', cartonQty: '24 pouches' },
      { size: '500g', netWeight: '500g', packaging: 'Pouch', cartonQty: '12 pouches' },
      { size: '1kg', netWeight: '1kg', packaging: 'Pouch', cartonQty: '10 pouches' }
    ] : [
      { size: '8g', netWeight: '8g', packaging: 'Sachet', cartonQty: '1000 sachets' },
      { size: '40g', netWeight: '40g', packaging: 'Pouch', cartonQty: '200 pouches' },
      { size: '100ml', netWeight: '100ml', packaging: 'Bottle', cartonQty: '48 bottles' },
      { size: '250ml', netWeight: '250ml', packaging: 'Bottle', cartonQty: '24 bottles' },
      { size: '500ml', netWeight: '500ml', packaging: 'Bottle', cartonQty: '12 bottles' },
      { size: '1000ml', netWeight: '1L', packaging: 'Bottle', cartonQty: '6 bottles' }
    ],
    moq: '1 carton per size',
    privateLabeling: true,
    exportQuality: true,
    nutritionalInfo: p.category.includes('Powder') ? [
      { nutrient: 'Energy', per100g: '350 kcal' },
      { nutrient: 'Protein', per100g: '3.5g' },
      { nutrient: 'Carbohydrates', per100g: '85g' },
      { nutrient: 'Sugar', per100g: '45g' },
      { nutrient: 'Fat', per100g: '0.5g' },
      { nutrient: 'Fiber', per100g: '8g' }
    ] : [
      { nutrient: 'Energy', per100g: '95 kcal' },
      { nutrient: 'Protein', per100g: '2g' },
      { nutrient: 'Carbohydrates', per100g: '18g' },
      { nutrient: 'Sugar', per100g: '8g' },
      { nutrient: 'Fat', per100g: '2g' },
      { nutrient: 'Sodium', per100g: '1500mg' }
    ],
    usageImages: [
      { title: 'With Snacks', description: 'Perfect accompaniment for snacks' },
      { title: 'With Fast Food', description: 'Ideal for fast food items' },
      { title: 'With Traditional Items', description: 'Great with traditional dishes' },
      { title: 'With Combo Meals', description: 'Complements combo meals' }
    ],
    faqs: [
      { question: 'What is the shelf life?', answer: '12 months from manufacturing date when stored properly.' },
      { question: 'Do you provide bulk supply?', answer: 'Yes, we offer bulk supply with competitive B2B pricing for restaurants, hotels, and food businesses.' },
      { question: 'Is private labeling available?', answer: 'Yes, private labeling is available for bulk orders. Contact us for customization details.' },
      { question: 'What is the minimum order quantity?', answer: 'MOQ is 1 carton per size. Mixed orders are welcome.' },
      { question: 'Do you export?', answer: 'Yes, we export globally with all necessary certifications and export-quality packaging.' }
    ]
  }))
);

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    quantity: '',
    message: ''
  });

  const product = productsData.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-obsidian text-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button variant="outline" className="border-gold text-gold">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const seoData = {
    title: `${product.name} - ${product.tagline} | Y7 Premium Sauces`,
    description: product.description,
    keywords: `${product.name}, Y7 sauces, bulk supply, B2B, ${product.category}`,
    canonical: `/products/${product.slug}`,
    ogTitle: `${product.name} - Y7 Premium Sauces`,
    ogDescription: product.description
  };

  return (
    <>
      <SEOHead seo={seoData} />
      
      <div className="min-h-screen bg-obsidian text-cream">
        {/* 1️⃣ Hero Section - Product Overview */}
        <section className="container mx-auto px-6 lg:px-12 pt-16 pb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="relative">
              <div className="sticky top-16">
                <div className="w-full h-96 rounded-2xl overflow-hidden border border-gold/20 bg-charcoal/50">
                  {product.hasVideo && product.videoSrc ? (
                    <ProductVideo
                      videoSrc={product.videoSrc}
                      fallbackImage={product.image}
                      alt={product.name}
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <Badge variant="outline" className="border-gold text-gold mb-4">
                {product.category}
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-gradient-gold">
                {product.name}
              </h1>
              
              <p className="text-2xl text-gold/80 font-semibold mb-6">
                {product.tagline}
              </p>
              
              <p className="text-lg text-cream/80 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Variant Selector */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Available Sizes:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      className={`
                        px-6 py-3 rounded-lg font-semibold transition-all duration-300
                        ${selectedVariant === index
                          ? 'bg-gold text-obsidian shadow-lg shadow-gold/30'
                          : 'bg-charcoal border border-gold/30 text-gold hover:border-gold hover:bg-gold/10'
                        }
                      `}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Details */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-charcoal/50 rounded-xl border border-gold/20 mb-8">
                <div>
                  <p className="text-cream/60 text-sm mb-1">Net Weight</p>
                  <p className="text-xl font-semibold text-gold">{currentVariant.netWeight}</p>
                </div>
                <div>
                  <p className="text-cream/60 text-sm mb-1">Packaging Type</p>
                  <p className="text-xl font-semibold text-gold">{currentVariant.packaging}</p>
                </div>
                <div>
                  <p className="text-cream/60 text-sm mb-1">Carton Quantity</p>
                  <p className="text-xl font-semibold text-gold">{currentVariant.cartonQty}</p>
                </div>
                <div>
                  <p className="text-cream/60 text-sm mb-1">MOQ</p>
                  <p className="text-xl font-semibold text-gold">{product.moq}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4">
                <a href="#bulk-inquiry">
                  <Button size="lg" className="bg-gold text-obsidian hover:bg-gold/90">
                    Request Bulk Quote
                  </Button>
                </a>
                <a href={`https://wa.me/919876543210?text=Hi, I'm interested in ${product.name}`} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Product Description Section */}
        <section className="container mx-auto px-6 lg:px-12 py-16 border-t border-gold/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Product <span className="text-gradient-gold">Information</span>
            </h2>
            
            <div className="space-y-8">
              {/* Key Features */}
              <div className="bg-charcoal/30 rounded-xl p-8 border border-gold/20">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-gold" />
                  Key Features
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  {product.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gold mr-3">✓</span>
                      <span className="text-cream/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Storage & Shelf Life */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-charcoal/30 rounded-xl p-6 border border-gold/20">
                  <h4 className="text-xl font-semibold mb-3 text-gold">Shelf Life</h4>
                  <p className="text-cream/80">{product.shelfLife}</p>
                </div>
                <div className="bg-charcoal/30 rounded-xl p-6 border border-gold/20">
                  <h4 className="text-xl font-semibold mb-3 text-gold">Storage Instructions</h4>
                  <p className="text-cream/80">{product.storage}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ Nutritional Information Table */}
        <section className="container mx-auto px-6 lg:px-12 py-16 bg-charcoal/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Nutritional <span className="text-gradient-gold">Information</span>
            </h2>
            
            <div className="bg-obsidian rounded-xl overflow-hidden border border-gold/20">
              <table className="w-full">
                <thead>
                  <tr className="bg-gold text-obsidian">
                    <th className="px-6 py-4 text-left font-semibold">Nutrient</th>
                    <th className="px-6 py-4 text-right font-semibold">Per 100g</th>
                  </tr>
                </thead>
                <tbody>
                  {product.nutritionalInfo.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-t border-gold/10 ${
                        index % 2 === 0 ? 'bg-charcoal/30' : 'bg-charcoal/10'
                      }`}
                    >
                      <td className="px-6 py-4 text-cream">{item.nutrient}</td>
                      <td className="px-6 py-4 text-right text-gold font-semibold">{item.per100g}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4️⃣ Packaging & Bulk Supply Section */}
        <section className="container mx-auto px-6 lg:px-12 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Packaging & <span className="text-gradient-gold">Bulk Supply</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Available Sizes */}
              <div className="bg-gradient-to-br from-charcoal/50 to-charcoal/30 rounded-xl p-8 border border-gold/20">
                <div className="flex items-center mb-4">
                  <Package className="w-6 h-6 text-gold mr-3" />
                  <h3 className="text-xl font-semibold">Available Sizes</h3>
                </div>
                <ul className="space-y-2">
                  {product.variants.map((variant, index) => (
                    <li key={index} className="flex justify-between text-cream/80">
                      <span>{variant.size}</span>
                      <span className="text-gold">{variant.packaging}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Carton Details */}
              <div className="bg-gradient-to-br from-charcoal/50 to-charcoal/30 rounded-xl p-8 border border-gold/20">
                <div className="flex items-center mb-4">
                  <Truck className="w-6 h-6 text-gold mr-3" />
                  <h3 className="text-xl font-semibold">Carton Packing</h3>
                </div>
                <ul className="space-y-2">
                  {product.variants.map((variant, index) => (
                    <li key={index} className="flex justify-between text-cream/80">
                      <span>{variant.size}</span>
                      <span className="text-gold">{variant.cartonQty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MOQ */}
              <div className="bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl p-8 border border-gold/30">
                <h3 className="text-xl font-semibold mb-2 text-gold">Minimum Order Quantity</h3>
                <p className="text-2xl font-bold text-cream">{product.moq}</p>
              </div>

              {/* Private Labeling */}
              <div className="bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl p-8 border border-gold/30">
                <h3 className="text-xl font-semibold mb-2 text-gold">Private Labeling</h3>
                <p className="text-2xl font-bold text-cream">
                  {product.privateLabeling ? 'Available ✓' : 'Not Available'}
                </p>
              </div>

              {/* Export Quality */}
              <div className="bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl p-8 border border-gold/30 md:col-span-2">
                <h3 className="text-xl font-semibold mb-2 text-gold">Export Quality</h3>
                <p className="text-2xl font-bold text-cream">
                  {product.exportQuality ? 'Available for International Markets ✓' : 'Domestic Only'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Usage Section */}
        <section className="container mx-auto px-6 lg:px-12 py-16 bg-charcoal/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Perfect <span className="text-gradient-gold">Pairings</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.usageImages.map((usage, index) => (
                <div
                  key={index}
                  className="bg-charcoal/50 rounded-xl p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
                >
                  <div className="w-full h-40 bg-gradient-to-br from-gold/20 to-gold/5 rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-gold/40" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-gold">{usage.title}</h4>
                  <p className="text-sm text-cream/70">{usage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6️⃣ Bulk Inquiry Section */}
        <section id="bulk-inquiry" className="container mx-auto px-6 lg:px-12 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-8 lg:p-12 border-2 border-gold/30">
              <div className="text-center mb-10">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                  Looking for <span className="text-gradient-gold">Bulk Orders?</span>
                </h2>
                <p className="text-lg text-cream/80">
                  Fill out the form below and our team will get back to you within 24 hours with a customized quote.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-cream">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-obsidian border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-cream"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-cream">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-obsidian border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-cream"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-cream">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-obsidian border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-cream"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-cream">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-obsidian border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-cream"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-cream">
                    Required Quantity *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-obsidian border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-cream"
                    placeholder="e.g., 100 cartons of 500ml"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-cream">
                    Additional Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-obsidian border border-gold/30 rounded-lg focus:outline-none focus:border-gold text-cream resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gold text-obsidian hover:bg-gold/90 text-lg font-semibold py-6"
                >
                  Submit Inquiry
                </Button>
              </form>

              {/* Contact Options */}
              <div className="mt-10 pt-10 border-t border-gold/20">
                <p className="text-center text-cream/80 mb-6">Or reach us directly:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <a
                    href={`https://wa.me/919876543210?text=Hi, I'm interested in ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">WhatsApp</span>
                  </a>

                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-charcoal hover:bg-charcoal/80 border border-gold/30 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gold" />
                    <span className="font-semibold">Call Now</span>
                  </a>

                  <a
                    href="mailto:sales@y7sauces.com"
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-charcoal hover:bg-charcoal/80 border border-gold/30 rounded-lg transition-colors"
                  >
                    <Mail className="w-5 h-5 text-gold" />
                    <span className="font-semibold">Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7️⃣ FAQ Section */}
        <section className="container mx-auto px-6 lg:px-12 py-16 bg-charcoal/20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h2>
            
            <div className="space-y-4">
              {product.faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-charcoal/50 rounded-xl border border-gold/20 overflow-hidden hover:border-gold/40 transition-all"
                >
                  <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between font-semibold text-lg text-cream hover:text-gold transition-colors">
                    <span>{faq.question}</span>
                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-6 pb-4 text-cream/80 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products CTA */}
        <section className="container mx-auto px-6 lg:px-12 py-16">
          <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 rounded-2xl p-12 text-center border border-gold/30">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Explore More <span className="text-gradient-gold">Premium Products</span>
            </h2>
            <p className="text-lg text-cream/80 mb-8 max-w-2xl mx-auto">
              Discover our complete range of sauces, condiments, and agro products crafted for excellence.
            </p>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-obsidian">
                View All Products
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
