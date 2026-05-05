# 🚀 Setup Automatic SEO - 5 Minutes

## ✅ What You Already Have

You already have:
- ✅ Supabase tables (products, categories)
- ✅ Products in Supabase
- ✅ SEO components ready

## 🎯 Quick Setup (3 Steps)

### Step 1: Check Your Products (1 min)

Go to your Supabase dashboard:
1. Open **Table Editor**
2. Click **products** table
3. Make sure you have products with:
   - ✅ `name` filled
   - ✅ `slug` filled
   - ✅ `description` filled
   - ✅ `status` = 'active'
   - ✅ `main_image` filled

**If you don't have products yet:**
```bash
cd yseven-frontend
npx tsx supabase/migrate-products.ts
```

### Step 2: Generate SEO Files (1 min)

```bash
cd yseven-frontend
npm install tsx
npm run seo:auto
```

This creates:
- ✅ `public/sitemap.xml` - All your products
- ✅ `public/schema-products.json` - Product catalog schema

You should see:
```
✅ Found 25 products
✅ Sitemap generated
✅ Schema generated
```

### Step 3: Add SEO to Your Pages (2 min)

**For Product Pages:**

Find your product detail page (probably `src/pages/ProductDetail.tsx` or similar) and add:

```tsx
import { ProductSEO } from '@/components/ProductSEO';

export default function ProductDetail() {
  const product = // your product data from Supabase
  
  return (
    <>
      <ProductSEO product={product} />
      {/* Your existing product UI */}
    </>
  );
}
```

**For Category Pages:**

Find your category page and add:

```tsx
import { CategorySEO } from '@/components/CategorySEO';

export default function CategoryPage() {
  const category = // your category data
  const products = // products in this category
  
  return (
    <>
      <CategorySEO category={category} products={products} />
      {/* Your existing category UI */}
    </>
  );
}
```

## ✅ Done! 

Now every product automatically gets:
- Perfect meta tags
- Product schema with ratings
- Open Graph tags
- Twitter cards
- Breadcrumbs
- Automatic sitemap

## 🚀 Deploy

```bash
npm run build
# Deploy to your hosting
```

## 📊 Submit to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `ysevenfoods.com`
3. Verify ownership
4. Submit sitemap: `https://ysevenfoods.com/sitemap.xml`

**That's it!** Google will automatically index all your products with perfect SEO.

---

## 🔧 Optional: Run SQL in Supabase (Only if needed)

**Only run this if you DON'T have the tables yet:**

Go to Supabase → SQL Editor → New Query:

```sql
-- Check if you have products
SELECT COUNT(*) FROM products;

-- Check if you have categories  
SELECT COUNT(*) FROM categories;
```

If you get errors, run this once:

```sql
-- Copy everything from: yseven-frontend/supabase/schema.sql
-- Paste in SQL Editor
-- Click "Run"
```

But you probably already have this! ✅

---

## 📞 Need Help?

Check if products exist:
```bash
npm run seo:sitemap
```

Should show: `✅ Added X products`

If you see `⚠️ No products found`, then run:
```bash
npx tsx supabase/migrate-products.ts
```

That's it! Your SEO is now 100% automatic. 🎉
