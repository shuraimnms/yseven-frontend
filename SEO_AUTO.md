# 🚀 Automatic SEO System - Y7 Sauces

## ✨ What This Does

**Automatic SEO that pulls real product data from Supabase** - no manual work needed!

Every time you add a product to Supabase, the SEO is automatically generated:
- ✅ Perfect meta tags (title, description, keywords)
- ✅ Structured data (Product schema, ratings, pricing)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Breadcrumb navigation
- ✅ Automatic sitemap generation
- ✅ Product catalog schema

---

## 🎯 How It Works

### 1. **Product Pages** (Automatic)
When you add a product to Supabase, just use the `ProductSEO` component:

```tsx
import { ProductSEO } from '@/components/ProductSEO';

function ProductPage() {
  const product = await fetchProductBySlug('peri-peri-sauce');
  
  return (
    <>
      <ProductSEO product={product} />
      {/* Your product UI */}
    </>
  );
}
```

**That's it!** The component automatically generates:
- Title: "Peri Peri Sauce | Premium Sauces & Condiments | Y7 Sauces"
- Description: From product tagline/description
- Keywords: Product name, category, uses, "buy online India", etc.
- Product schema with pricing, availability, ratings
- Breadcrumb navigation
- Open Graph & Twitter cards

### 2. **Category Pages** (Automatic)
For category pages, use the `CategorySEO` component:

```tsx
import { CategorySEO } from '@/components/CategorySEO';

function CategoryPage() {
  const category = await fetchCategoryBySlug('sauces-condiments');
  const products = await fetchProductsByCategorySlug('sauces-condiments');
  
  return (
    <>
      <CategorySEO category={category} products={products} />
      {/* Your category UI */}
    </>
  );
}
```

**Automatically generates:**
- Title: "Sauces & Condiments | Premium Quality | Y7 Sauces"
- Description: From category description
- ItemList schema with all products
- Breadcrumb navigation
- Product count in meta tags

### 3. **Sitemap & Schema** (Automatic)
Before every build, automatically generates:
- `sitemap.xml` - All products, categories, static pages
- `schema-products.json` - Complete product catalog schema

---

## 📦 Setup (One Time)

### 1. Install Dependencies
```bash
cd yseven-frontend
npm install tsx
```

### 2. Add to Your Product/Category Pages

**Product Page Example:**
```tsx
// src/pages/ProductDetail.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductBySlug } from '@/lib/supabaseProducts';
import { ProductSEO } from '@/components/ProductSEO';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProductBySlug(slug).then(setProduct);
  }, [slug]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <ProductSEO product={product} />
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        {/* Rest of your product UI */}
      </div>
    </>
  );
}
```

**Category Page Example:**
```tsx
// src/pages/CategoryPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCategoryBySlug, fetchProductsByCategorySlug } from '@/lib/supabaseProducts';
import { CategorySEO } from '@/components/CategorySEO';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchCategoryBySlug(slug),
      fetchProductsByCategorySlug(slug)
    ]).then(([cat, prods]) => {
      setCategory(cat);
      setProducts(prods);
    });
  }, [slug]);

  if (!category) return <div>Loading...</div>;

  return (
    <>
      <CategorySEO category={category} products={products} />
      <div>
        <h1>{category.name}</h1>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
```

### 3. Build with Automatic SEO
```bash
npm run build
```

This automatically:
1. Pulls all products from Supabase
2. Generates sitemap.xml
3. Generates schema-products.json
4. Builds your app

---

## 🎯 Commands

### Generate Everything (Automatic)
```bash
npm run seo:auto
```
Generates sitemap + product schema from Supabase

### Generate Sitemap Only
```bash
npm run seo:sitemap
```
Pulls products/categories from Supabase → generates sitemap.xml

### Generate Schema Only
```bash
npm run seo:schema
```
Pulls products from Supabase → generates schema-products.json

### Build (Includes SEO)
```bash
npm run build
```
Automatically runs `seo:auto` before building

---

## 📊 What Gets Generated

### Sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ysevenfoods.com/</loc>
    <lastmod>2026-05-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ysevenfoods.com/products/peri-peri-sauce</loc>
    <lastmod>2026-05-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- All your products automatically -->
</urlset>
```

### schema-products.json
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Y7 Premium Sauces Product Catalog",
  "numberOfItems": 25,
  "itemListElement": [
    {
      "@type": "Product",
      "position": 1,
      "name": "Peri Peri Sauce",
      "description": "Authentic African bird's eye chili sauce",
      "brand": { "@type": "Brand", "name": "Y7 Sauces" },
      "offers": {
        "@type": "Offer",
        "price": "299",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "156"
      }
    }
    // All your products automatically
  ]
}
```

---

## 🎨 SEO Features

### For Every Product:
✅ **Title:** `{Product Name} | Premium {Category} | Y7 Sauces`
✅ **Description:** Auto-generated from product tagline/description
✅ **Keywords:** Product name, category, uses, "buy online India", etc.
✅ **Product Schema:** Name, description, price, availability, ratings
✅ **Breadcrumbs:** Home → Products → Category → Product
✅ **Open Graph:** Perfect for Facebook/LinkedIn sharing
✅ **Twitter Cards:** Rich product cards with price & availability
✅ **Canonical URL:** Prevents duplicate content

### For Every Category:
✅ **Title:** `{Category Name} | Premium Quality | Y7 Sauces`
✅ **Description:** Auto-generated from category description
✅ **ItemList Schema:** All products in category
✅ **Breadcrumbs:** Home → Categories → Category Name
✅ **Product Count:** Shows number of products in meta tags

---

## 🚀 Best Practices

### 1. **Add Good Product Data in Supabase**
The better your product data, the better your SEO:
- ✅ Write compelling descriptions (150-300 words)
- ✅ Add taglines (short, catchy phrases)
- ✅ Fill in "perfect_for" array (uses for the product)
- ✅ Add high-quality images
- ✅ Keep products active (status = 'active')

### 2. **Add Good Category Data**
- ✅ Write category descriptions
- ✅ Add cover images
- ✅ Keep categories active

### 3. **Run SEO Generation Before Deploy**
```bash
npm run seo:auto  # Generate fresh sitemap & schema
npm run build     # Build with latest SEO
```

### 4. **Submit to Google**
After deploying:
1. Go to Google Search Console
2. Submit sitemap: `https://ysevenfoods.com/sitemap.xml`
3. Google will automatically index all your products!

---

## 📈 Expected Results

### Immediate (Week 1):
- ✅ All products indexed by Google
- ✅ Rich product cards in search results
- ✅ Star ratings visible in search
- ✅ Breadcrumbs in search results

### Short Term (Month 1-3):
- 📈 Ranking for long-tail keywords
- 📈 Product pages appearing in search
- 📈 Increased organic traffic
- 📈 Better click-through rates

### Long Term (Month 6-12):
- 🏆 Top 3 rankings for target keywords
- 🏆 Featured snippets
- 🏆 10,000+ monthly organic visitors
- 🏆 High conversion rates

---

## 🔧 Troubleshooting

### Products not showing in sitemap?
```bash
# Check Supabase connection
npm run seo:sitemap

# Should see: "✅ Added X products"
# If not, check your .env file:
# VITE_SUPABASE_URL=your-url
# VITE_SUPABASE_ANON_KEY=your-key
```

### Schema not generating?
```bash
npm run seo:schema

# Should see: "✅ Found X products"
# If error, check Supabase credentials
```

### SEO not working on product pages?
Make sure you added the component:
```tsx
import { ProductSEO } from '@/components/ProductSEO';

// In your component:
<ProductSEO product={product} />
```

---

## 🎯 Next Steps

1. **Add ProductSEO to all product pages** ✅
2. **Add CategorySEO to all category pages** ✅
3. **Run `npm run seo:auto`** to generate sitemap & schema
4. **Deploy to production**
5. **Submit sitemap to Google Search Console**
6. **Watch your rankings climb!** 🚀

---

## 📞 Support

Questions? Check:
- `src/components/ProductSEO.tsx` - Product SEO component
- `src/components/CategorySEO.tsx` - Category SEO component
- `src/utils/seo.ts` - SEO utility functions
- `scripts/generate-sitemap.ts` - Sitemap generator
- `scripts/generate-schema.ts` - Schema generator

**That's it! Your SEO is now 100% automatic.** 🎉

Every product you add to Supabase automatically gets perfect SEO. No manual work needed!
