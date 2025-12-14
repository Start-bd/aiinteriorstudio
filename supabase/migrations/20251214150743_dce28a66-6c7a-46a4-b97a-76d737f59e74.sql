-- Allow users to delete their own generated images
CREATE POLICY "Users can delete their own images" 
ON public.generated_images 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drop the old restrictive delete policy
DROP POLICY IF EXISTS "No one can delete generated images" ON public.generated_images;