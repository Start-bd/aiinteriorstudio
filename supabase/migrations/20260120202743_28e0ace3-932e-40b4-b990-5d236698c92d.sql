-- Create a safe view for publicly accessible featured images
-- This anonymizes user_id to prevent tracking user activity patterns

CREATE OR REPLACE VIEW public.generated_images_public AS
SELECT 
    id,
    created_at,
    prompt,
    image_url,
    style,
    room_type,
    likes_count,
    views_count,
    downloads_count,
    is_featured
    -- user_id is intentionally excluded to anonymize public image attribution
FROM public.generated_images
WHERE is_featured = true;

-- Grant SELECT access to authenticated and anonymous users for the public gallery
GRANT SELECT ON public.generated_images_public TO anon, authenticated;

-- Add a comment explaining the view's purpose
COMMENT ON VIEW public.generated_images_public IS 'Anonymized view of featured images for public gallery display. Excludes user_id to prevent activity tracking.';