-- Create storage policies for voice-notes with IF NOT EXISTS workaround
DO $$ BEGIN
  CREATE POLICY "Public read voice notes"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'voice-notes');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can upload voice notes to their folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'voice-notes' AND (auth.uid())::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own voice notes"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'voice-notes' AND (auth.uid())::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete their own voice notes"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'voice-notes' AND (auth.uid())::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;