// Y7 Sauces - Comprehensive Keyword Database
export interface Keyword {
  term: string;
  intent: 'commercial' | 'informational' | 'navigational' | 'transactional';
  difficulty: 'low' | 'medium' | 'high';
  volume: 'low' | 'medium' | 'high';
  buyerReadiness: 'low' | 'medium' | 'high';
  targetPage: string;
  category: string;
}

export const commercialKeywords: Keyword[] = [
  // Hot Sauce Commercial Keywords
  { term: 'buy peri peri sauce online', intent: 'commercial', difficulty: 'medium', volume: 'high', buyerReadiness: 'high', targetPage: '/products/peri-peri', category: 'hot-sauce' },
  { term: 'premium hot sauce brand', intent: 'commercial', difficulty: 'high', volume: 'high', buyerReadiness: 'high', targetPage: '/hot-sauces', category: 'hot-sauce' },
  { term: 'ghost pepper sauce online', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/ghost-pepper', category: 'hot-sauce' },
  { term: 'carolina reaper sauce buy', intent: 'commercial', difficulty: 'high', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/carolina-reaper', category: 'hot-sauce' },
  { term: 'sriracha sauce premium', intent: 'commercial', difficulty: 'medium', volume: 'high', buyerReadiness: 'high', targetPage: '/products/sriracha', category: 'hot-sauce' },
  { term: 'habanero sauce gourmet', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/habanero', category: 'hot-sauce' },
  { term: 'chipotle sauce online store', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/chipotle', category: 'hot-sauce' },
  { term: 'jalapeño sauce premium', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/jalapeno', category: 'hot-sauce' },
  { term: 'tabasco alternative sauce', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/hot-sauces', category: 'hot-sauce' },
  { term: 'gourmet hot sauce gift set', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/gift-sets', category: 'hot-sauce' },
  
  // Mayonnaise Commercial Keywords
  { term: 'premium mayonnaise brand', intent: 'commercial', difficulty: 'high', volume: 'high', buyerReadiness: 'high', targetPage: '/mayonnaise', category: 'mayonnaise' },
  { term: 'organic mayonnaise buy', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/organic-mayo', category: 'mayonnaise' },
  { term: 'garlic mayonnaise online', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/garlic-mayo', category: 'mayonnaise' },
  { term: 'chipotle mayonnaise premium', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/chipotle-mayo', category: 'mayonnaise' },
  { term: 'truffle mayonnaise gourmet', intent: 'commercial', difficulty: 'medium', volume: 'low', buyerReadiness: 'high', targetPage: '/products/truffle-mayo', category: 'mayonnaise' },
  { term: 'sriracha mayonnaise buy', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/sriracha-mayo', category: 'mayonnaise' },
  { term: 'avocado oil mayonnaise', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/avocado-mayo', category: 'mayonnaise' },
  { term: 'vegan mayonnaise premium', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/vegan-mayo', category: 'mayonnaise' },
  { term: 'japanese mayonnaise online', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/japanese-mayo', category: 'mayonnaise' },
  { term: 'herb mayonnaise gourmet', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/herb-mayo', category: 'mayonnaise' },
  
  // International Sauce Commercial Keywords
  { term: 'sambal oelek sauce buy', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/sambal-oelek', category: 'international' },
  { term: 'harissa sauce premium', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/harissa', category: 'international' },
  { term: 'chimichurri sauce online', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/chimichurri', category: 'international' },
  { term: 'gochujang sauce buy', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/gochujang', category: 'international' },
  { term: 'tahini sauce premium', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/tahini', category: 'international' },
  { term: 'za\'atar sauce online', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/zaatar', category: 'international' },
  { term: 'berbere sauce premium', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/berbere', category: 'international' },
  { term: 'yuzu sauce buy online', intent: 'commercial', difficulty: 'medium', volume: 'low', buyerReadiness: 'high', targetPage: '/products/yuzu', category: 'international' },
  { term: 'ponzu sauce premium', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/ponzu', category: 'international' },
  { term: 'romesco sauce gourmet', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/romesco', category: 'international' },
  
  // BBQ Sauce Commercial Keywords
  { term: 'premium bbq sauce buy', intent: 'commercial', difficulty: 'medium', volume: 'high', buyerReadiness: 'high', targetPage: '/bbq-sauces', category: 'bbq' },
  { term: 'kansas city bbq sauce', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/kansas-city-bbq', category: 'bbq' },
  { term: 'carolina bbq sauce buy', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/carolina-bbq', category: 'bbq' },
  { term: 'texas bbq sauce premium', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/texas-bbq', category: 'bbq' },
  { term: 'smoky bbq sauce online', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/smoky-bbq', category: 'bbq' },
  { term: 'honey bbq sauce gourmet', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/honey-bbq', category: 'bbq' },
  { term: 'spicy bbq sauce premium', intent: 'commercial', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/spicy-bbq', category: 'bbq' },
  { term: 'bourbon bbq sauce online', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/bourbon-bbq', category: 'bbq' },
  { term: 'maple bbq sauce buy', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/maple-bbq', category: 'bbq' },
  { term: 'korean bbq sauce buy', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/korean-bbq', category: 'bbq' },
  
  // Condiment Commercial Keywords
  { term: 'gourmet mustard online', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/condiments/mustard', category: 'condiments' },
  { term: 'truffle ketchup premium', intent: 'commercial', difficulty: 'medium', volume: 'low', buyerReadiness: 'high', targetPage: '/products/truffle-ketchup', category: 'condiments' },
  { term: 'organic tomato ketchup', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/organic-ketchup', category: 'condiments' },
  { term: 'artisan vinegar online', intent: 'commercial', difficulty: 'medium', volume: 'low', buyerReadiness: 'high', targetPage: '/condiments/vinegar', category: 'condiments' },
  { term: 'balsamic glaze premium', intent: 'commercial', difficulty: 'medium', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/balsamic-glaze', category: 'condiments' }
];

export const informationalKeywords: Keyword[] = [
  // Sauce Education
  { term: 'what is peri peri sauce', intent: 'informational', difficulty: 'low', volume: 'high', buyerReadiness: 'medium', targetPage: '/blog/what-is-peri-peri', category: 'education' },
  { term: 'how to use sambal sauce', intent: 'informational', difficulty: 'low', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/how-to-use-sambal', category: 'education' },
  { term: 'difference between sriracha and hot sauce', intent: 'informational', difficulty: 'low', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/sriracha-vs-hot-sauce', category: 'education' },
  { term: 'what is harissa sauce made of', intent: 'informational', difficulty: 'low', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/what-is-harissa', category: 'education' },
  { term: 'gochujang vs sriracha difference', intent: 'informational', difficulty: 'low', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/gochujang-vs-sriracha', category: 'education' },
  { term: 'what is tahini sauce used for', intent: 'informational', difficulty: 'low', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/tahini-uses', category: 'education' },
  { term: 'how spicy is ghost pepper sauce', intent: 'informational', difficulty: 'low', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/ghost-pepper-heat', category: 'education' },
  { term: 'scoville scale hot sauce guide', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/scoville-scale-guide', category: 'education' },
  { term: 'fermented hot sauce benefits', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'low', targetPage: '/blog/fermented-sauce-benefits', category: 'education' },
  { term: 'sauce pairing with food', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/sauce-food-pairing', category: 'education' },
  
  // Recipe & Cooking
  { term: 'best sauces for burgers', intent: 'informational', difficulty: 'medium', volume: 'high', buyerReadiness: 'medium', targetPage: '/blog/best-burger-sauces', category: 'recipes' },
  { term: 'sauce recipes for grilled chicken', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/grilled-chicken-sauces', category: 'recipes' },
  { term: 'marinade sauce recipes', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/marinade-recipes', category: 'recipes' },
  { term: 'dipping sauce ideas', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/dipping-sauce-ideas', category: 'recipes' },
  { term: 'wing sauce flavor combinations', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/wing-sauce-flavors', category: 'recipes' },
  { term: 'bbq sauce regional styles', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/bbq-sauce-styles', category: 'recipes' },
  { term: 'seafood sauce pairings', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/seafood-sauce-pairings', category: 'recipes' },
  { term: 'sauce recipes for meal prep', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/meal-prep-sauces', category: 'recipes' },
  { term: 'quick sauce recipes 5 minutes', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/quick-sauce-recipes', category: 'recipes' },
  { term: 'gourmet sauce techniques', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/gourmet-sauce-techniques', category: 'recipes' },
  
  // Health & Nutrition
  { term: 'healthy mayonnaise alternatives', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/healthy-mayo-alternatives', category: 'health' },
  { term: 'low calorie sauce options', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/low-calorie-sauces', category: 'health' },
  { term: 'sugar free sauce recipes', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/sugar-free-sauces', category: 'health' },
  { term: 'probiotic sauce benefits', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/probiotic-sauces', category: 'health' },
  { term: 'organic sauce benefits', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/organic-sauce-benefits', category: 'health' },
  { term: 'preservative free sauces', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/preservative-free-sauces', category: 'health' },
  { term: 'keto friendly sauces', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/keto-sauces', category: 'health' },
  { term: 'paleo sauce recipes', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/paleo-sauces', category: 'health' },
  { term: 'gluten free sauce options', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/gluten-free-sauces', category: 'health' },
  { term: 'diabetic friendly sauces', intent: 'informational', difficulty: 'medium', volume: 'medium', buyerReadiness: 'medium', targetPage: '/blog/diabetic-sauces', category: 'health' }
];

export const longTailKeywords: Keyword[] = [
  // Purchase Intent Long-Tail
  { term: 'where to buy authentic peri peri sauce online', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/peri-peri', category: 'long-tail-commercial' },
  { term: 'best place to order gourmet hot sauce gift sets', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/gift-sets', category: 'long-tail-commercial' },
  { term: 'premium organic mayonnaise free shipping worldwide', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/organic-mayo', category: 'long-tail-commercial' },
  { term: 'artisan sambal oelek sauce small batch production', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/sambal-oelek', category: 'long-tail-commercial' },
  { term: 'gluten free harissa sauce certified organic buy online', intent: 'commercial', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/harissa', category: 'long-tail-commercial' },
  
  // Recipe & Usage Long-Tail
  { term: 'how to make authentic peri peri sauce at home recipe', intent: 'informational', difficulty: 'low', volume: 'low', buyerReadiness: 'low', targetPage: '/blog/peri-peri-recipe', category: 'long-tail-informational' },
  { term: 'best way to use sambal oelek in stir fry cooking', intent: 'informational', difficulty: 'low', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/sambal-stir-fry', category: 'long-tail-informational' },
  { term: 'harissa sauce marinade recipe for grilled chicken thighs', intent: 'informational', difficulty: 'low', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/harissa-chicken-marinade', category: 'long-tail-informational' },
  { term: 'chimichurri sauce pairing with different types of meat', intent: 'informational', difficulty: 'low', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/chimichurri-meat-pairing', category: 'long-tail-informational' },
  { term: 'gochujang sauce substitutes in korean cooking recipes', intent: 'informational', difficulty: 'low', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/gochujang-substitutes', category: 'long-tail-informational' },
  
  // Health & Diet Long-Tail
  { term: 'low sodium hot sauce options for heart healthy diet', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/low-sodium-hot-sauce', category: 'long-tail-health' },
  { term: 'keto friendly bbq sauce sugar free carb free options', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/keto-bbq-sauce', category: 'long-tail-health' },
  { term: 'paleo approved mayonnaise avocado oil based natural ingredients', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/paleo-mayonnaise', category: 'long-tail-health' },
  { term: 'whole30 compliant hot sauce no sugar added clean eating', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/whole30-hot-sauce', category: 'long-tail-health' },
  { term: 'gluten free soy sauce alternatives tamari coconut aminos', intent: 'informational', difficulty: 'medium', volume: 'low', buyerReadiness: 'medium', targetPage: '/blog/gluten-free-soy-alternatives', category: 'long-tail-health' }
];

export const brandedKeywords: Keyword[] = [
  // Direct Brand Searches
  { term: 'Y7 sauces', intent: 'navigational', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/', category: 'branded' },
  { term: 'Y7 hot sauce', intent: 'navigational', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/hot-sauces', category: 'branded' },
  { term: 'Y7 mayonnaise', intent: 'navigational', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/mayonnaise', category: 'branded' },
  { term: 'Y7 peri peri sauce', intent: 'navigational', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/products/peri-peri', category: 'branded' },
  { term: 'Y7 sambal sauce', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/sambal', category: 'branded' },
  { term: 'Y7 condiments', intent: 'navigational', difficulty: 'low', volume: 'medium', buyerReadiness: 'high', targetPage: '/shop', category: 'branded' },
  { term: 'Y7 sauce company', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'medium', targetPage: '/about', category: 'branded' },
  { term: 'Y7 gourmet sauces', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/gourmet-collection', category: 'branded' },
  { term: 'Y7 premium condiments', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/premium-collection', category: 'branded' },
  { term: 'Y7 international sauces', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/international-collection', category: 'branded' },
  
  // Product-Specific Branded
  { term: 'Y7 ghost pepper sauce', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/ghost-pepper', category: 'branded-product' },
  { term: 'Y7 carolina reaper sauce', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/carolina-reaper', category: 'branded-product' },
  { term: 'Y7 sriracha sauce', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/sriracha', category: 'branded-product' },
  { term: 'Y7 harissa sauce', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/harissa', category: 'branded-product' },
  { term: 'Y7 chimichurri sauce', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/products/chimichurri', category: 'branded-product' },
  
  // Service & Experience Branded
  { term: 'Y7 sauce subscription', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/subscription', category: 'branded-service' },
  { term: 'Y7 sauce gift set', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/gift-sets', category: 'branded-service' },
  { term: 'Y7 sauce online store', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/shop', category: 'branded-service' },
  { term: 'Y7 sauce wholesale', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/wholesale', category: 'branded-service' },
  { term: 'Y7 sauce bulk order', intent: 'navigational', difficulty: 'low', volume: 'low', buyerReadiness: 'high', targetPage: '/bulk-orders', category: 'branded-service' }
];

// Keyword analysis functions
export const getKeywordsByCategory = (category: string): Keyword[] => {
  const allKeywords = [...commercialKeywords, ...informationalKeywords, ...longTailKeywords, ...brandedKeywords];
  return allKeywords.filter(keyword => keyword.category === category);
};

export const getHighValueKeywords = (): Keyword[] => {
  const allKeywords = [...commercialKeywords, ...informationalKeywords, ...longTailKeywords, ...brandedKeywords];
  return allKeywords.filter(keyword => 
    keyword.buyerReadiness === 'high' && 
    (keyword.volume === 'high' || keyword.volume === 'medium')
  );
};

export const getKeywordsByIntent = (intent: string): Keyword[] => {
  const allKeywords = [...commercialKeywords, ...informationalKeywords, ...longTailKeywords, ...brandedKeywords];
  return allKeywords.filter(keyword => keyword.intent === intent);
};

export const getAllKeywords = (): Keyword[] => {
  return [...commercialKeywords, ...informationalKeywords, ...longTailKeywords, ...brandedKeywords];
};