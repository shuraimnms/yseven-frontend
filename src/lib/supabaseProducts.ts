/**
 * Supabase product/category data fetching with static fallback.
 * Old products continue to work if Supabase is not configured or returns nothing.
 */
import { supabase, isSupabaseConfigured } from './supabase';
import { allProducts } from '@/data/products';
import { categoryData } from '@/data/categoryData';
import type { SupabaseProduct, SupabaseCategory, NormalizedProduct, NormalizedCategory } from '@/types/supabase';

// ─── Normalizers ────────────────────────────────────────────────────────────

function normalizeProduct(p: SupabaseProduct): NormalizedProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    tagline: p.tagline || '',
    benefits: p.benefits || [],
    uses: (p.perfect_for || []).join(', '),
    category: p.categories?.name || '',
    category_id: p.category_id,
    image: p.main_image || '',
    gallery_images: p.gallery_images || [],
    inStock: p.status === 'active',
    isBestSeller: p.is_best_seller,
    isNew: p.is_new,
    ingredients: p.ingredients || '',
    features: p.features || [],
    perfect_for: p.perfect_for || [],
    pack_sizes: p.pack_sizes || [],
    selected_size: p.selected_size || '',
  };
}

function normalizeCategory(c: SupabaseCategory): NormalizedCategory {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    title: c.name.toUpperCase(),
    tagline: c.description || 'Premium products crafted for exceptional taste',
    cover_image: c.cover_image || '',
    cover_video: c.cover_video || '',
    description: c.description || '',
    status: c.status,
  };
}

// ─── Static fallback normalizers ────────────────────────────────────────────

function staticProductToNormalized(p: (typeof allProducts)[0]): NormalizedProduct {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    tagline: p.tagline || '',
    benefits: p.benefits,
    uses: p.uses,
    category: p.category,
    category_id: null,
    image: p.image,
    gallery_images: [],
    inStock: p.inStock,
    isBestSeller: p.isBestSeller || false,
    isNew: p.isNew || false,
    ingredients: '',
    features: [],
    perfect_for: p.uses ? p.uses.split(',').map(s => s.trim()) : [],
    pack_sizes: [],
    selected_size: '',
  };
}

// ─── Categories ─────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<NormalizedCategory[]> {
  if (!isSupabaseConfigured()) return getStaticCategories();

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return getStaticCategories();
    return data.map(normalizeCategory);
  } catch {
    return getStaticCategories();
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<NormalizedCategory | null> {
  if (!isSupabaseConfigured()) return getStaticCategoryBySlug(slug);

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return getStaticCategoryBySlug(slug);
    return normalizeCategory(data);
  } catch {
    return getStaticCategoryBySlug(slug);
  }
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchAllProducts(): Promise<NormalizedProduct[]> {
  if (!isSupabaseConfigured()) return allProducts.map(staticProductToNormalized);

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return allProducts.map(staticProductToNormalized);
    }
    return data.map(normalizeProduct);
  } catch {
    return allProducts.map(staticProductToNormalized);
  }
}

export async function fetchProductBySlug(slug: string): Promise<NormalizedProduct | null> {
  // Always try static first as fallback
  const staticProduct = allProducts.find(p => p.slug === slug);

  if (!isSupabaseConfigured()) {
    return staticProduct ? staticProductToNormalized(staticProduct) : null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return staticProduct ? staticProductToNormalized(staticProduct) : null;
    }
    return normalizeProduct(data);
  } catch {
    return staticProduct ? staticProductToNormalized(staticProduct) : null;
  }
}

export async function fetchProductsByCategorySlug(categorySlug: string): Promise<NormalizedProduct[]> {
  if (!isSupabaseConfigured()) return getStaticProductsByCategory(categorySlug);

  try {
    // First get category id
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (!cat) return getStaticProductsByCategory(categorySlug);

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('category_id', cat.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return getStaticProductsByCategory(categorySlug);
    return data.map(normalizeProduct);
  } catch {
    return getStaticProductsByCategory(categorySlug);
  }
}

export async function fetchRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4
): Promise<NormalizedProduct[]> {
  const products = await fetchProductsByCategorySlug(categorySlug);
  return products.filter(p => p.slug !== excludeSlug).slice(0, limit);
}

// ─── Static fallback helpers ─────────────────────────────────────────────────

function getStaticCategories(): NormalizedCategory[] {
  return categoryData.map(c => ({
    id: c.slug,
    slug: c.slug,
    name: c.title,
    title: c.title.toUpperCase(),
    tagline: c.tagline,
    cover_image: c.videoPoster,
    cover_video: c.video || '',
    description: c.tagline,
    status: 'active' as const,
  }));
}

function getStaticCategoryBySlug(slug: string): NormalizedCategory | null {
  const slugMap: Record<string, string> = {
    'sauces-condiments': 'sauces-condiments',
    'sauces-and-condiments': 'sauces-condiments',
    'flakes-powders-agro-products': 'flakes-powders',
    'flakes-and-powders-agro-products': 'flakes-powders',
    'raw-banana-powders': 'banana-powders',
    'fruit-vegetable-powders': 'fruit-vegetable-powders',
    'fruit-and-vegetable-powders': 'fruit-vegetable-powders',
  };
  const mappedSlug = slugMap[slug] || slug;
  const cat = categoryData.find(c => c.slug === mappedSlug);
  if (!cat) return null;
  return {
    id: cat.slug,
    slug: cat.slug,
    name: cat.title,
    title: cat.title.toUpperCase(),
    tagline: cat.tagline,
    cover_image: cat.videoPoster,
    cover_video: cat.video || '',
    description: cat.tagline,
    status: 'active' as const,
  };
}

function getStaticProductsByCategory(categorySlug: string): NormalizedProduct[] {
  const slugMap: Record<string, string> = {
    'sauces-condiments': 'Sauces & Condiments',
    'sauces-and-condiments': 'Sauces & Condiments',
    'flakes-powders': 'Flakes & Powders (Agro Products)',
    'flakes-powders-agro-products': 'Flakes & Powders (Agro Products)',
    'banana-powders': 'Raw Banana Powders',
    'raw-banana-powders': 'Raw Banana Powders',
    'fruit-vegetable-powders': 'Fruit & Vegetable Powders',
    'fruit-and-vegetable-powders': 'Fruit & Vegetable Powders',
  };
  const categoryName = slugMap[categorySlug] || categorySlug;
  return allProducts
    .filter(p => p.category === categoryName)
    .map(staticProductToNormalized);
}
