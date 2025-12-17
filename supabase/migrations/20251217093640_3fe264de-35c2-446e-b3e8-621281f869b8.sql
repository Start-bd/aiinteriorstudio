-- Fix 1: Restrict generated_images to show only user's own images or featured images
-- This preserves the public gallery functionality while protecting user privacy
DROP POLICY IF EXISTS "Users can view all generated images" ON public.generated_images;

CREATE POLICY "Users can view own or featured images" 
ON public.generated_images FOR SELECT 
USING (
  auth.uid() = user_id 
  OR is_featured = true
);

-- Fix 2: Restrict generation_likes to only show user's own likes
-- Remove the public "Anyone can view likes" policy
DROP POLICY IF EXISTS "Anyone can view likes" ON public.generation_likes;

CREATE POLICY "Users can view own likes" 
ON public.generation_likes FOR SELECT 
USING (auth.uid() = user_id);