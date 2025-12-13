-- Add style column to generated_images table
ALTER TABLE public.generated_images 
ADD COLUMN style TEXT NOT NULL DEFAULT 'Other';

-- Create index for faster filtering by style
CREATE INDEX idx_generated_images_style ON public.generated_images(style);