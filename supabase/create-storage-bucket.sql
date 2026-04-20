-- ============================================================
-- Create the product-images storage bucket
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create the bucket (public = anyone can view images)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB max per file
  array['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml'];

-- Allow anyone to read (view) images
drop policy if exists "Public read product-images" on storage.objects;
create policy "Public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated users (admins) to upload
drop policy if exists "Auth upload product-images" on storage.objects;
create policy "Auth upload product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Allow authenticated users to update/replace
drop policy if exists "Auth update product-images" on storage.objects;
create policy "Auth update product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Allow authenticated users to delete
drop policy if exists "Auth delete product-images" on storage.objects;
create policy "Auth delete product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
