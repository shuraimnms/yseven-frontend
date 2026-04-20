// Supabase database types

export interface SupabaseCategory {
  id: string;
  name: string;
  slug: string;
  cover_image: string | null;
  cover_video: string | null;   // video URL (Supabase Storage or external)
  description: string | null;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  tagline: string | null;
  description: string | null;
  ingredients: string | null;
  features: string[] | null;
  benefits: string[] | null;
  perfect_for: string[] | null;
  pack_sizes: PackSize[] | null;
  selected_size: string | null;
  main_image: string | null;
  gallery_images: string[] | null;
  status: 'active' | 'inactive';
  is_best_seller: boolean;
  is_new: boolean;
  created_at: string;
  // joined
  categories?: SupabaseCategory;
}

export interface PackSize {
  size: string;
  label: string;
  type: 'Sachet' | 'Bottle' | 'Pouch' | 'Jar' | 'Other';
}

// Normalized product for frontend use (compatible with existing ProductData)
export interface NormalizedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  benefits: string[];
  uses: string;
  category: string;
  category_id: string | null;
  image: string;
  gallery_images: string[];
  inStock: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  ingredients: string;
  features: string[];
  perfect_for: string[];
  pack_sizes: PackSize[];
  selected_size: string;
}

// Normalized category for frontend use
export interface NormalizedCategory {
  id: string;
  slug: string;
  name: string;
  title: string;
  tagline: string;
  cover_image: string;
  cover_video: string;          // video URL for hero background
  description: string;
  status: 'active' | 'inactive';
}
