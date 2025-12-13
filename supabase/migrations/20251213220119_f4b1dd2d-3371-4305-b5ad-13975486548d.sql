-- Add restrictive policies to prevent unauthorized modifications on generated_images

-- Prevent all updates (images should be immutable)
CREATE POLICY "No one can update generated images"
ON public.generated_images
FOR UPDATE
USING (false);

-- Prevent all deletions (only service role can delete)
CREATE POLICY "No one can delete generated images"
ON public.generated_images
FOR DELETE
USING (false);