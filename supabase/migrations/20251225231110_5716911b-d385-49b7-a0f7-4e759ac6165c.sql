-- Add policy for public read access to featured images
CREATE POLICY "Anyone can view featured images" 
  ON public.generated_images 
  FOR SELECT 
  USING (is_featured = true);

-- Add policy for public access to collection images via share_token
CREATE POLICY "Anyone can view images in shared collections" 
  ON public.collection_images 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.collections 
      WHERE collections.id = collection_images.collection_id 
      AND collections.is_public = true 
      AND collections.share_token IS NOT NULL
    )
  );