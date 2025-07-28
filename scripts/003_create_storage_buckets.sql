-- ===========================================
-- 003_create_storage_buckets.sql
-- Maakt de benodigde storage buckets aan
-- ===========================================

-- Maak de grave-photos bucket aan
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'grave-photos',
  'grave-photos', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Maak de deceased-photos bucket aan
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'deceased-photos',
  'deceased-photos',
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- RLS policies voor grave-photos bucket
CREATE POLICY "Allow public read access on grave-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'grave-photos');

CREATE POLICY "Allow authenticated uploads to grave-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'grave-photos' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to update own grave-photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'grave-photos'
  AND auth.role() = 'authenticated' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete own grave-photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'grave-photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS policies voor deceased-photos bucket
CREATE POLICY "Allow public read access on deceased-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'deceased-photos');

CREATE POLICY "Allow authenticated uploads to deceased-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'deceased-photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to update own deceased-photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'deceased-photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete own deceased-photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'deceased-photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
