import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchAllProducts,
  fetchProductBySlug,
  fetchProductsByCategorySlug,
  fetchRelatedProducts,
  fetchCategories,
  fetchCategoryBySlug,
} from '@/lib/supabaseProducts';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { NormalizedProduct, NormalizedCategory } from '@/types/supabase';

// Unique ID per hook instance to avoid channel name collisions
let _uid = 0;
function uid() { return ++_uid; }

// ─── All Products ─────────────────────────────────────────────────────────────

export function useAllProducts() {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = useRef(uid()).current;

  const load = useCallback(() => {
    fetchAllProducts()
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`products-all-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [load, id]);

  return { products, loading, error, refetch: load };
}

// ─── Single Product ───────────────────────────────────────────────────────────

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<NormalizedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = useRef(uid()).current;

  const load = useCallback(() => {
    if (!slug) { setLoading(false); return; }
    setLoading(true);
    fetchProductBySlug(slug)
      .then(setProduct)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    load();
    if (!slug || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`product-${slug}-${id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'products',
        filter: `slug=eq.${slug}`,
      }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [slug, load, id]);

  return { product, loading, error, refetch: load };
}

// ─── Products by Category ─────────────────────────────────────────────────────

export function useProductsByCategory(categorySlug: string | undefined) {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = useRef(uid()).current;

  const load = useCallback(() => {
    if (!categorySlug) { setLoading(false); return; }
    setLoading(true);
    fetchProductsByCategorySlug(categorySlug)
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  useEffect(() => {
    load();
    if (!categorySlug || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`products-cat-${categorySlug}-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [categorySlug, load, id]);

  return { products, loading, error, refetch: load };
}

// ─── Related Products ─────────────────────────────────────────────────────────

export function useRelatedProducts(
  categorySlug: string | undefined,
  excludeSlug: string | undefined
) {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const id = useRef(uid()).current;

  const load = useCallback(() => {
    if (!categorySlug || !excludeSlug) { setLoading(false); return; }
    fetchRelatedProducts(categorySlug, excludeSlug, 4)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [categorySlug, excludeSlug]);

  useEffect(() => {
    load();
    if (!categorySlug || !excludeSlug || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`related-${categorySlug}-${excludeSlug}-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [categorySlug, excludeSlug, load, id]);

  return { products, loading, refetch: load };
}

// ─── All Categories ───────────────────────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<NormalizedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = useRef(uid()).current;

  const load = useCallback(() => {
    fetchCategories()
      .then(setCategories)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`categories-all-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [load, id]);

  return { categories, loading, error, refetch: load };
}

// ─── Single Category ──────────────────────────────────────────────────────────

export function useCategory(slug: string | undefined) {
  const [category, setCategory] = useState<NormalizedCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const id = useRef(uid()).current;

  const load = useCallback(() => {
    if (!slug) { setLoading(false); return; }
    fetchCategoryBySlug(slug)
      .then(setCategory)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    load();
    if (!slug || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`category-${slug}-${id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'categories',
        filter: `slug=eq.${slug}`,
      }, load)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [slug, load, id]);

  return { category, loading, refetch: load };
}
