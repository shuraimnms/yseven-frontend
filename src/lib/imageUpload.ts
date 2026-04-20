/**
 * Image compression + Supabase Storage upload utility.
 *
 * Compresses any image to WebP format at reduced quality/size
 * before uploading — typically 70-90% smaller than the original PNG.
 */
import { supabase } from './supabase';

export interface CompressOptions {
  maxWidth?: number;   // default 800px
  maxHeight?: number;  // default 800px
  quality?: number;    // 0–1, default 0.82
  format?: 'webp' | 'jpeg'; // default 'webp'
}

/**
 * Compress an image File using canvas and return a new Blob.
 * Falls back to original file if canvas is unavailable.
 */
export async function compressImage(
  file: File,
  opts: CompressOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.82,
    format = 'webp',
  } = opts;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions keeping aspect ratio
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => resolve(blob ?? file),
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

/**
 * Compress then upload to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function compressAndUpload(
  file: File,
  folder: 'products' | 'categories' = 'products',
  opts: CompressOptions = {}
): Promise<string> {
  const compressed = await compressImage(file, opts);

  const ext = opts.format === 'jpeg' ? 'jpg' : 'webp';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, compressed, {
      upsert: true,
      contentType: `image/${opts.format ?? 'webp'}`,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

/** Human-readable file size */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
