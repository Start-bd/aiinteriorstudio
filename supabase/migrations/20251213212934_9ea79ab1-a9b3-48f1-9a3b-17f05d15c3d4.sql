-- Create table for storing generated interior design images
CREATE TABLE public.generated_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view images (public gallery)
CREATE POLICY "Anyone can view generated images" 
ON public.generated_images 
FOR SELECT 
USING (true);

-- Allow anyone to insert images (from the chatbot)
CREATE POLICY "Anyone can insert generated images" 
ON public.generated_images 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster ordering by date
CREATE INDEX idx_generated_images_created_at ON public.generated_images(created_at DESC);