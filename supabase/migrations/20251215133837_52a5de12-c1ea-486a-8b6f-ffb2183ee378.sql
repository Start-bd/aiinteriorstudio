-- Create collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for collection images
CREATE TABLE public.collection_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES public.generated_images(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (collection_id, image_id)
);

-- Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;

-- Collections policies
CREATE POLICY "Users can view their own collections"
ON public.collections FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections"
ON public.collections FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
ON public.collections FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
ON public.collections FOR DELETE
USING (auth.uid() = user_id);

-- Collection images policies (user must own the collection)
CREATE POLICY "Users can view images in their collections"
ON public.collection_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE collections.id = collection_images.collection_id
    AND collections.user_id = auth.uid()
  )
);

CREATE POLICY "Users can add images to their collections"
ON public.collection_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE collections.id = collection_images.collection_id
    AND collections.user_id = auth.uid()
  )
);

CREATE POLICY "Users can remove images from their collections"
ON public.collection_images FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.collections
    WHERE collections.id = collection_images.collection_id
    AND collections.user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_collections_updated_at
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();