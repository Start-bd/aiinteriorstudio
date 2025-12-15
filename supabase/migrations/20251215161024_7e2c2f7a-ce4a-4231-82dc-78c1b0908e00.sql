-- Add cover_image_id to collections
ALTER TABLE public.collections 
ADD COLUMN cover_image_id UUID REFERENCES public.generated_images(id) ON DELETE SET NULL;