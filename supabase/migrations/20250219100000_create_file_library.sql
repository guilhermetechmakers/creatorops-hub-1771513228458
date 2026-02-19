-- File Library: assets and versioning
-- S3-compatible storage paths stored; actual files in Supabase Storage

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- file_library_asset: metadata for uploaded files
CREATE TABLE IF NOT EXISTS file_library_asset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  thumbnail_path TEXT,
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- file_library_version: version history for assets
CREATE TABLE IF NOT EXISTS file_library_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES file_library_asset(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(asset_id, version_number)
);

-- Indexes for search and listing
CREATE INDEX IF NOT EXISTS idx_file_library_asset_user_id ON file_library_asset(user_id);
CREATE INDEX IF NOT EXISTS idx_file_library_asset_created_at ON file_library_asset(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_file_library_asset_tags ON file_library_asset USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_file_library_version_asset_id ON file_library_version(asset_id);

-- Enable RLS
ALTER TABLE file_library_asset ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_library_version ENABLE ROW LEVEL SECURITY;

-- file_library_asset policies
CREATE POLICY "file_library_asset_read_own" ON file_library_asset
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "file_library_asset_insert_own" ON file_library_asset
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "file_library_asset_update_own" ON file_library_asset
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "file_library_asset_delete_own" ON file_library_asset
  FOR DELETE USING (auth.uid() = user_id);

-- file_library_version: users can read/insert versions for their assets
CREATE POLICY "file_library_version_read" ON file_library_version
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM file_library_asset a WHERE a.id = asset_id AND a.user_id = auth.uid())
  );

CREATE POLICY "file_library_version_insert" ON file_library_version
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM file_library_asset a WHERE a.id = asset_id AND a.user_id = auth.uid())
  );

-- Updated_at trigger for file_library_asset
CREATE OR REPLACE FUNCTION update_file_library_asset_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_file_library_asset_updated_at ON file_library_asset;
CREATE TRIGGER update_file_library_asset_updated_at
  BEFORE UPDATE ON file_library_asset
  FOR EACH ROW
  EXECUTE FUNCTION update_file_library_asset_updated_at();

-- Storage bucket for file library (100MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('file-library', 'file-library', false, 104857600)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can manage their own files (path starts with user_id)
DROP POLICY IF EXISTS "file_library_storage_select" ON storage.objects;
CREATE POLICY "file_library_storage_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'file-library' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "file_library_storage_insert" ON storage.objects;
CREATE POLICY "file_library_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'file-library' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "file_library_storage_update" ON storage.objects;
CREATE POLICY "file_library_storage_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'file-library' AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "file_library_storage_delete" ON storage.objects;
CREATE POLICY "file_library_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'file-library' AND (storage.foldername(name))[1] = auth.uid()::text
  );
