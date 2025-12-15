-- Add sharing fields to collections
ALTER TABLE public.collections 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN share_token TEXT UNIQUE;

-- Add position to collection_images for ordering
ALTER TABLE public.collection_images 
ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

-- Create a function to generate share token
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$;

-- Allow public access to shared collections
CREATE POLICY "Anyone can view public collections"
ON public.collections FOR SELECT
USING (is_public = true);

-- Allow public access to images in shared collections
CREATE POLICY "Anyone can view images in public collections"
ON public.collection_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE collections.id = collection_images.collection_id
    AND collections.is_public = true
  )
);

-- Allow users to update image positions in their collections
CREATE POLICY "Users can update image positions in their collections"
ON public.collection_images FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE collections.id = collection_images.collection_id
    AND collections.user_id = auth.uid()
  )
);