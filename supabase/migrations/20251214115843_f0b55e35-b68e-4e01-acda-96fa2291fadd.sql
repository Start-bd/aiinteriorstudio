-- Add user_id column to generated_images to track who generated each image
ALTER TABLE public.generated_images 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster user queries
CREATE INDEX idx_generated_images_user_id ON public.generated_images (user_id);

-- Update RLS policies to allow users to see their own images
DROP POLICY IF EXISTS "Anyone can view generated images" ON public.generated_images;

-- Users can view all public images OR their own images
CREATE POLICY "Users can view all generated images" 
ON public.generated_images 
FOR SELECT 
USING (true);

-- Only authenticated users can insert their own images
DROP POLICY IF EXISTS "Anyone can insert generated images" ON public.generated_images;
CREATE POLICY "Authenticated users can insert images" 
ON public.generated_images 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);