-- ============================================================
-- Y7 Foods – Complete Data Seed
-- Paste this entire file into Supabase SQL Editor and run it.
-- Safe to re-run (uses ON CONFLICT DO UPDATE).
-- ============================================================

-- ─── 1. CATEGORIES ───────────────────────────────────────────
insert into categories (id, name, slug, description, status) values
  ('11111111-0000-0000-0000-000000000001', 'Sauces & Condiments',          'sauces-condiments',       'Premium sauces crafted for exceptional taste and quality',  'active'),
  ('11111111-0000-0000-0000-000000000002', 'Flakes & Powders (Agro Products)', 'flakes-powders',      'Premium dried flakes and powders for authentic flavor',     'active'),
  ('11111111-0000-0000-0000-000000000003', 'Raw Banana Powders',            'banana-powders',          'Nutritious banana powders from premium varieties',          'active'),
  ('11111111-0000-0000-0000-000000000004', 'Fruit & Vegetable Powders',     'fruit-vegetable-powders', 'Natural nutrition in every spoonful',                       'active')
on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  status      = excluded.status;

-- ─── 2. PRODUCTS ─────────────────────────────────────────────
-- Sauces & Condiments (16 products)
insert into products (name, slug, category_id, tagline, description, benefits, perfect_for, status, is_best_seller, is_new) values

('Tomato Ketchup', 'tomato-ketchup',
  '11111111-0000-0000-0000-000000000001',
  'Rich tomato base with balanced spices',
  'Classic tomato ketchup made from ripe, high-quality tomatoes, blended with a balanced mix of spices for rich flavor and smooth texture.',
  '["Rich tomato antioxidants (lycopene)","Enhances taste instantly","Low-fat condiment","Kid-friendly flavor"]',
  '["Burgers","Fries","Sandwiches","Snacks","Wraps"]',
  'active', true, false),

('Tomato Sauce / Continental Sauce', 'tomato-sauce-continental',
  '11111111-0000-0000-0000-000000000001',
  'Perfect for continental and fusion dishes',
  'A tangy, mildly spiced tomato-based sauce ideal for continental dishes and fusion recipes.',
  '["Improves digestion","Adds depth of flavor","Low calorie","Versatile use"]',
  '["Pasta","Pizzas","Sandwiches","Gravies"]',
  'active', false, false),

('Snack Sauce', 'snack-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Bold flavor for Indian street food',
  'A bold, tangy, spicy sauce crafted for Indian snacks and street food flavors.',
  '["Bold tangy flavor","Perfect for Indian snacks","Appetite stimulant","No artificial flavors"]',
  '["Samosas","Pakoras","Chaat","Fries"]',
  'active', false, false),

('Green Chilli Sauce', 'green-chilli-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Fresh green chilies with sharp heat',
  'Spicy sauce made from fresh green chilies, delivering sharp heat and bold aroma.',
  '["Made from fresh green chilies","Sharp heat level","Rich in Vitamin C","Boosts metabolism"]',
  '["Noodles","Momos","Stir-fries"]',
  'active', false, false),

('Red Chilli Sauce', 'red-chilli-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Intense red chili flavor',
  'Fiery red chili sauce with rich color and intense flavor for spicy food lovers.',
  '["Intense red chili flavor","Rich color","Enhances metabolism","Antioxidant rich"]',
  '["Chinese dishes","Snacks","Spring rolls"]',
  'active', false, false),

('Soya Sauce', 'soya-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Authentic umami for Asian dishes',
  'Fermented soy-based sauce delivering deep umami flavor for Asian cuisines.',
  '["Authentic umami flavor","Fermented goodness","Low calorie","Versatile use"]',
  '["Fried rice","Noodles","Marinades"]',
  'active', false, false),

('Vinegar', 'vinegar',
  '11111111-0000-0000-0000-000000000001',
  'Naturally fermented for health',
  'Naturally fermented vinegar for culinary and health applications.',
  '["Natural fermentation","Aids digestion","Preservative properties","Tangy flavor"]',
  '["Salads","Pickling","Marinades"]',
  'active', false, false),

('Hot & Spicy Sauce', 'hot-spicy-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Powerful blend for heat lovers',
  'A powerful blend of chilies and spices for intense heat lovers.',
  '["Intense heat","Bold flavor","Metabolism booster","Appetite enhancer"]',
  '["Grills","Wraps","Burgers"]',
  'active', false, false),

('Garlic Sauce', 'garlic-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Creamy garlic with bold aroma',
  'Creamy garlic-based sauce with bold aroma and savory richness.',
  '["Bold garlic flavor","Creamy texture","Heart health support","Immunity booster"]',
  '["Shawarma","Wraps","Dips"]',
  'active', false, false),

('Schezwan Sauce', 'schezwan-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Authentic Indo-Chinese flavor',
  'Authentic Schezwan sauce made with red chilies, garlic, and aromatic spices.',
  '["Authentic Indo-Chinese flavor","Perfect heat level","Rich garlic blend","Versatile cooking sauce"]',
  '["Fried rice","Noodles","Momos"]',
  'active', true, false),

('Lite Mayonnaise', 'lite-mayonnaise',
  '11111111-0000-0000-0000-000000000001',
  'Low-fat creamy option',
  'Low-fat creamy mayonnaise with smooth texture and mild flavor.',
  '["Low-fat formula","Smooth texture","Mild flavor","Healthier option"]',
  '["Sandwiches","Burgers","Dips"]',
  'active', false, false),

('Classic Mayonnaise', 'classic-mayonnaise',
  '11111111-0000-0000-0000-000000000001',
  'Premium quality creamy mayo',
  'Rich and creamy mayonnaise made from premium quality oils and fresh eggs.',
  '["Premium quality","Creamy texture","Fresh egg-based","No trans fats"]',
  '["Sandwiches","Burgers","Salads"]',
  'active', false, false),

('Cheese Blend', 'cheese-blend',
  '11111111-0000-0000-0000-000000000001',
  'Rich cheesy flavor',
  'Creamy cheese-flavored sauce for rich, savory dishes.',
  '["Rich cheesy flavor","Creamy texture","Versatile use","Kid-friendly"]',
  '["Nachos","Fries","Pasta"]',
  'active', false, false),

('Peri Peri Sauce', 'peri-peri-sauce',
  '11111111-0000-0000-0000-000000000001',
  'African fire and flavor',
  'Tangy, spicy African-style sauce made with bird''s eye chilies.',
  '["African fire & flavor","Tangy and spicy","Rich in Vitamin C","Metabolism booster"]',
  '["Grilled chicken","Fries"]',
  'active', false, false),

('Romesco Sauce', 'romesco-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Spanish nutty delight',
  'Spanish-style nutty tomato-based sauce with rich smoky flavor.',
  '["Spanish nutty delight","Smoky flavor","Rich in antioxidants","Unique taste"]',
  '["Grilled vegetables","Pasta"]',
  'active', false, false),

('Sambal Sauce', 'sambal-sauce',
  '11111111-0000-0000-0000-000000000001',
  'Indonesian spicy tang',
  'Indonesian-style chili sauce with bold spice and tangy notes.',
  '["Indonesian spicy tang","Bold spice","Tangy notes","Authentic flavor"]',
  '["Rice","Noodles","Stir-fries"]',
  'active', false, false),

-- Flakes & Powders (2 products)
('Green Chilli Flakes', 'green-chilli-flakes',
  '11111111-0000-0000-0000-000000000002',
  'Bold heat and aroma',
  'Dried green chilies crushed into flakes for bold heat and aroma.',
  '["Boosts metabolism","Rich in Vitamin C","Improves digestion","Bold heat"]',
  '["Pizza topping","Spice blends"]',
  'active', false, false),

('Green Chilli Powder', 'green-chilli-powder',
  '11111111-0000-0000-0000-000000000002',
  'Intense green chili flavor',
  'Finely ground green chili powder with intense flavor.',
  '["Intense flavor","Rich in Vitamin C","Metabolism booster","Versatile spice"]',
  '["Curries","Marinades"]',
  'active', false, false),

-- Raw Banana Powders (3 products)
('Yelkahi Banana Powder', 'yelkahi-banana-powder',
  '11111111-0000-0000-0000-000000000003',
  'Premium Tungabhadra bananas',
  'Made from premium Yelkahi bananas grown near Tungabhadra River.',
  '["Resistant starch","Gut health support","Low glycemic index","Energy booster"]',
  '["Smoothies","Porridge"]',
  'active', false, false),

('Rasabale Banana Powder', 'rasabale-banana-powder',
  '11111111-0000-0000-0000-000000000003',
  'Aromatic Cauvery bananas',
  'Powdered aromatic bananas from Cauvery river belt.',
  '["Energy boosting","Rich in potassium","Aromatic flavor","Digestive support"]',
  '["Smoothies","Health drinks"]',
  'active', false, false),

('G9 Banana Powder', 'g9-banana-powder',
  '11111111-0000-0000-0000-000000000003',
  'Export-grade Grand Naine',
  'Powder made from export-grade Grand Naine bananas.',
  '["Export-grade quality","Rich in fiber","Energy booster","Nutrient-rich"]',
  '["Smoothies","Baking"]',
  'active', false, false),

-- Fruit & Vegetable Powders (5 products)
('Raw Papaya Powder', 'raw-papaya-powder',
  '11111111-0000-0000-0000-000000000004',
  'Enzyme-rich papaya powder',
  'Unripe papaya powder rich in papain enzyme.',
  '["Improves digestion","Anti-inflammatory","Detox support","Enzyme-rich"]',
  '["Health drinks","Cooking"]',
  'active', false, false),

('Mango Powder', 'mango-powder',
  '11111111-0000-0000-0000-000000000004',
  'Naturally sweet mango',
  'Naturally sweet mango powder from ripe mangoes.',
  '["Rich in Vitamin A & C","Immunity booster","Natural sweetness","Antioxidant-rich"]',
  '["Smoothies","Desserts"]',
  'active', false, false),

('Guava Powder', 'guava-powder',
  '11111111-0000-0000-0000-000000000004',
  'Fiber-rich guava powder',
  'Powdered guava rich in fiber and antioxidants.',
  '["Fiber-rich","Improves digestion","Boosts immunity","Antioxidant power"]',
  '["Health drinks","Smoothies"]',
  'active', false, false),

('Sweet Potato Powder', 'sweet-potato-powder',
  '11111111-0000-0000-0000-000000000004',
  'Naturally sweet and nutritious',
  'Naturally sweet powder made from dried sweet potatoes.',
  '["Rich in fiber","Blood sugar control","Natural sweetness","Nutrient-dense"]',
  '["Baking","Smoothies"]',
  'active', false, false),

('Chikoo (Sapota) Powder', 'chikoo-sapota-powder',
  '11111111-0000-0000-0000-000000000004',
  'Sweet nutrient-rich sapota',
  'Sweet, nutrient-rich sapota powder.',
  '["Energy booster","Digestive support","Antioxidant rich","Natural sweetness"]',
  '["Smoothies","Desserts"]',
  'active', false, false)

on conflict (slug) do update set
  name           = excluded.name,
  category_id    = excluded.category_id,
  tagline        = excluded.tagline,
  description    = excluded.description,
  benefits       = excluded.benefits,
  perfect_for    = excluded.perfect_for,
  status         = excluded.status,
  is_best_seller = excluded.is_best_seller;

-- ─── VERIFY ──────────────────────────────────────────────────
select 'Categories inserted: ' || count(*)::text from categories;
select 'Products inserted: '   || count(*)::text from products;
