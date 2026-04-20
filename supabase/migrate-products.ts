/**
 * Migration script – inserts all existing static products into Supabase.
 * Run once: npx tsx supabase/migrate-products.ts
 *
 * Requires env vars:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (service role, not anon key)
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── Static category data ─────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Sauces & Condiments',
    slug: 'sauces-condiments',
    description: 'Premium sauces crafted for exceptional taste and quality',
    status: 'active',
  },
  {
    name: 'Flakes & Powders (Agro Products)',
    slug: 'flakes-powders',
    description: 'Premium dried flakes and powders for authentic flavor',
    status: 'active',
  },
  {
    name: 'Raw Banana Powders',
    slug: 'banana-powders',
    description: 'Nutritious banana powders from premium varieties',
    status: 'active',
  },
  {
    name: 'Fruit & Vegetable Powders',
    slug: 'fruit-vegetable-powders',
    description: 'Natural nutrition in every spoonful',
    status: 'active',
  },
];

// ─── Static product data ──────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: 'Tomato Ketchup', slug: 'tomato-ketchup',
    category: 'Sauces & Condiments',
    tagline: 'Rich tomato base with balanced spices',
    description: 'Classic tomato ketchup made from ripe, high-quality tomatoes, blended with a balanced mix of spices for rich flavor and smooth texture.',
    benefits: ['Rich tomato antioxidants (lycopene)', 'Enhances taste instantly', 'Low-fat condiment', 'Kid-friendly flavor'],
    perfect_for: ['Burgers', 'Fries', 'Sandwiches', 'Snacks', 'Wraps'],
    is_best_seller: true,
  },
  {
    name: 'Tomato Sauce / Continental Sauce', slug: 'tomato-sauce-continental',
    category: 'Sauces & Condiments',
    tagline: 'Perfect for continental and fusion dishes',
    description: 'A tangy, mildly spiced tomato-based sauce ideal for continental dishes and fusion recipes.',
    benefits: ['Improves digestion', 'Adds depth of flavor', 'Low calorie', 'Versatile use'],
    perfect_for: ['Pasta', 'Pizzas', 'Sandwiches', 'Gravies'],
  },
  {
    name: 'Snack Sauce', slug: 'snack-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Bold flavor for Indian street food',
    description: 'A bold, tangy, spicy sauce crafted for Indian snacks and street food flavors.',
    benefits: ['Bold tangy flavor', 'Perfect for Indian snacks', 'Appetite stimulant', 'No artificial flavors'],
    perfect_for: ['Samosas', 'Pakoras', 'Chaat', 'Fries'],
  },
  {
    name: 'Green Chilli Sauce', slug: 'green-chilli-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Fresh green chilies with sharp heat',
    description: 'Spicy sauce made from fresh green chilies, delivering sharp heat and bold aroma.',
    benefits: ['Made from fresh green chilies', 'Sharp heat level', 'Rich in Vitamin C', 'Boosts metabolism'],
    perfect_for: ['Noodles', 'Momos', 'Stir-fries'],
  },
  {
    name: 'Red Chilli Sauce', slug: 'red-chilli-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Intense red chili flavor',
    description: 'Fiery red chili sauce with rich color and intense flavor for spicy food lovers.',
    benefits: ['Intense red chili flavor', 'Rich color', 'Enhances metabolism', 'Antioxidant rich'],
    perfect_for: ['Chinese dishes', 'Snacks', 'Spring rolls'],
  },
  {
    name: 'Soya Sauce', slug: 'soya-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Authentic umami for Asian dishes',
    description: 'Fermented soy-based sauce delivering deep umami flavor for Asian cuisines.',
    benefits: ['Authentic umami flavor', 'Fermented goodness', 'Low calorie', 'Versatile use'],
    perfect_for: ['Fried rice', 'Noodles', 'Marinades'],
  },
  {
    name: 'Vinegar', slug: 'vinegar',
    category: 'Sauces & Condiments',
    tagline: 'Naturally fermented for health',
    description: 'Naturally fermented vinegar for culinary and health applications.',
    benefits: ['Natural fermentation', 'Aids digestion', 'Preservative properties', 'Tangy flavor'],
    perfect_for: ['Salads', 'Pickling', 'Marinades'],
  },
  {
    name: 'Hot & Spicy Sauce', slug: 'hot-spicy-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Powerful blend for heat lovers',
    description: 'A powerful blend of chilies and spices for intense heat lovers.',
    benefits: ['Intense heat', 'Bold flavor', 'Metabolism booster', 'Appetite enhancer'],
    perfect_for: ['Grills', 'Wraps', 'Burgers'],
  },
  {
    name: 'Garlic Sauce', slug: 'garlic-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Creamy garlic with bold aroma',
    description: 'Creamy garlic-based sauce with bold aroma and savory richness.',
    benefits: ['Bold garlic flavor', 'Creamy texture', 'Heart health support', 'Immunity booster'],
    perfect_for: ['Shawarma', 'Wraps', 'Dips'],
  },
  {
    name: 'Schezwan Sauce', slug: 'schezwan-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Authentic Indo-Chinese flavor',
    description: 'Authentic Schezwan sauce made with red chilies, garlic, and aromatic spices.',
    benefits: ['Authentic Indo-Chinese flavor', 'Perfect heat level', 'Rich garlic blend', 'Versatile cooking sauce'],
    perfect_for: ['Fried rice', 'Noodles', 'Momos'],
    is_best_seller: true,
  },
  {
    name: 'Lite Mayonnaise', slug: 'lite-mayonnaise',
    category: 'Sauces & Condiments',
    tagline: 'Low-fat creamy option',
    description: 'Low-fat creamy mayonnaise with smooth texture and mild flavor.',
    benefits: ['Low-fat formula', 'Smooth texture', 'Mild flavor', 'Healthier option'],
    perfect_for: ['Sandwiches', 'Burgers', 'Dips'],
  },
  {
    name: 'Classic Mayonnaise', slug: 'classic-mayonnaise',
    category: 'Sauces & Condiments',
    tagline: 'Premium quality creamy mayo',
    description: 'Rich and creamy mayonnaise made from premium quality oils and fresh eggs.',
    benefits: ['Premium quality', 'Creamy texture', 'Fresh egg-based', 'No trans fats'],
    perfect_for: ['Sandwiches', 'Burgers', 'Salads'],
  },
  {
    name: 'Cheese Blend', slug: 'cheese-blend',
    category: 'Sauces & Condiments',
    tagline: 'Rich cheesy flavor',
    description: 'Creamy cheese-flavored sauce for rich, savory dishes.',
    benefits: ['Rich cheesy flavor', 'Creamy texture', 'Versatile use', 'Kid-friendly'],
    perfect_for: ['Nachos', 'Fries', 'Pasta'],
  },
  {
    name: 'Peri Peri Sauce', slug: 'peri-peri-sauce',
    category: 'Sauces & Condiments',
    tagline: 'African fire and flavor',
    description: "Tangy, spicy African-style sauce made with bird's eye chilies.",
    benefits: ['African fire & flavor', 'Tangy and spicy', 'Rich in Vitamin C', 'Metabolism booster'],
    perfect_for: ['Grilled chicken', 'Fries'],
  },
  {
    name: 'Romesco Sauce', slug: 'romesco-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Spanish nutty delight',
    description: 'Spanish-style nutty tomato-based sauce with rich smoky flavor.',
    benefits: ['Spanish nutty delight', 'Smoky flavor', 'Rich in antioxidants', 'Unique taste'],
    perfect_for: ['Grilled vegetables', 'Pasta'],
  },
  {
    name: 'Sambal Sauce', slug: 'sambal-sauce',
    category: 'Sauces & Condiments',
    tagline: 'Indonesian spicy tang',
    description: 'Indonesian-style chili sauce with bold spice and tangy notes.',
    benefits: ['Indonesian spicy tang', 'Bold spice', 'Tangy notes', 'Authentic flavor'],
    perfect_for: ['Rice', 'Noodles', 'Stir-fries'],
  },
  {
    name: 'Green Chilli Flakes', slug: 'green-chilli-flakes',
    category: 'Flakes & Powders (Agro Products)',
    tagline: 'Bold heat and aroma',
    description: 'Dried green chilies crushed into flakes for bold heat and aroma.',
    benefits: ['Boosts metabolism', 'Rich in Vitamin C', 'Improves digestion', 'Bold heat'],
    perfect_for: ['Pizza topping', 'Spice blends'],
  },
  {
    name: 'Green Chilli Powder', slug: 'green-chilli-powder',
    category: 'Flakes & Powders (Agro Products)',
    tagline: 'Intense green chili flavor',
    description: 'Finely ground green chili powder with intense flavor.',
    benefits: ['Intense flavor', 'Rich in Vitamin C', 'Metabolism booster', 'Versatile spice'],
    perfect_for: ['Curries', 'Marinades'],
  },
  {
    name: 'Yelkahi Banana Powder', slug: 'yelkahi-banana-powder',
    category: 'Raw Banana Powders',
    tagline: 'Premium Tungabhadra bananas',
    description: 'Made from premium Yelkahi bananas grown near Tungabhadra River.',
    benefits: ['Resistant starch', 'Gut health support', 'Low glycemic index', 'Energy booster'],
    perfect_for: ['Smoothies', 'Porridge'],
  },
  {
    name: 'Rasabale Banana Powder', slug: 'rasabale-banana-powder',
    category: 'Raw Banana Powders',
    tagline: 'Aromatic Cauvery bananas',
    description: 'Powdered aromatic bananas from Cauvery river belt.',
    benefits: ['Energy boosting', 'Rich in potassium', 'Aromatic flavor', 'Digestive support'],
    perfect_for: ['Smoothies', 'Health drinks'],
  },
  {
    name: 'G9 Banana Powder', slug: 'g9-banana-powder',
    category: 'Raw Banana Powders',
    tagline: 'Export-grade Grand Naine',
    description: 'Powder made from export-grade Grand Naine bananas.',
    benefits: ['Export-grade quality', 'Rich in fiber', 'Energy booster', 'Nutrient-rich'],
    perfect_for: ['Smoothies', 'Baking'],
  },
  {
    name: 'Raw Papaya Powder', slug: 'raw-papaya-powder',
    category: 'Fruit & Vegetable Powders',
    tagline: 'Enzyme-rich papaya powder',
    description: 'Unripe papaya powder rich in papain enzyme.',
    benefits: ['Improves digestion', 'Anti-inflammatory', 'Detox support', 'Enzyme-rich'],
    perfect_for: ['Health drinks', 'Cooking'],
  },
  {
    name: 'Mango Powder', slug: 'mango-powder',
    category: 'Fruit & Vegetable Powders',
    tagline: 'Naturally sweet mango',
    description: 'Naturally sweet mango powder from ripe mangoes.',
    benefits: ['Rich in Vitamin A & C', 'Immunity booster', 'Natural sweetness', 'Antioxidant-rich'],
    perfect_for: ['Smoothies', 'Desserts'],
  },
  {
    name: 'Guava Powder', slug: 'guava-powder',
    category: 'Fruit & Vegetable Powders',
    tagline: 'Fiber-rich guava powder',
    description: 'Powdered guava rich in fiber and antioxidants.',
    benefits: ['Fiber-rich', 'Improves digestion', 'Boosts immunity', 'Antioxidant power'],
    perfect_for: ['Health drinks', 'Smoothies'],
  },
  {
    name: 'Sweet Potato Powder', slug: 'sweet-potato-powder',
    category: 'Fruit & Vegetable Powders',
    tagline: 'Naturally sweet and nutritious',
    description: 'Naturally sweet powder made from dried sweet potatoes.',
    benefits: ['Rich in fiber', 'Blood sugar control', 'Natural sweetness', 'Nutrient-dense'],
    perfect_for: ['Baking', 'Smoothies'],
  },
  {
    name: 'Chikoo (Sapota) Powder', slug: 'chikoo-sapota-powder',
    category: 'Fruit & Vegetable Powders',
    tagline: 'Sweet nutrient-rich sapota',
    description: 'Sweet, nutrient-rich sapota powder.',
    benefits: ['Energy booster', 'Digestive support', 'Antioxidant rich', 'Natural sweetness'],
    perfect_for: ['Smoothies', 'Desserts'],
  },
];

async function migrate() {
  console.log('Starting migration...\n');

  // 1. Insert categories
  console.log('Inserting categories...');
  const { data: insertedCats, error: catError } = await supabase
    .from('categories')
    .upsert(CATEGORIES, { onConflict: 'slug' })
    .select();

  if (catError) {
    console.error('Category insert error:', catError);
    process.exit(1);
  }
  console.log(`✓ ${insertedCats?.length} categories inserted\n`);

  // Build category name → id map
  const catMap: Record<string, string> = {};
  (insertedCats || []).forEach(c => { catMap[c.name] = c.id; });

  // 2. Insert products
  console.log('Inserting products...');
  const productRows = PRODUCTS.map(p => ({
    name: p.name,
    slug: p.slug,
    category_id: catMap[p.category] || null,
    tagline: p.tagline || null,
    description: p.description || null,
    benefits: p.benefits || [],
    perfect_for: p.perfect_for || [],
    features: [],
    pack_sizes: [],
    gallery_images: [],
    status: 'active',
    is_best_seller: p.is_best_seller || false,
    is_new: false,
  }));

  const { data: insertedProds, error: prodError } = await supabase
    .from('products')
    .upsert(productRows, { onConflict: 'slug' })
    .select();

  if (prodError) {
    console.error('Product insert error:', prodError);
    process.exit(1);
  }
  console.log(`✓ ${insertedProds?.length} products inserted\n`);
  console.log('Migration complete!');
}

migrate();
