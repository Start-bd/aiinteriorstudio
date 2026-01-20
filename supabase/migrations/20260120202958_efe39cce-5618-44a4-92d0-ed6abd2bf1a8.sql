-- Drop and recreate the view with SQL SECURITY INVOKER (default behavior)
-- This ensures the view uses the permissions of the querying user, not the creator

DROP VIEW IF EXISTS public.generated_images_public;

CREATE VIEW public.generated_images_public 
WITH (security_invoker = true) AS
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
COMMENT ON VIEW public.generated_images_public IS 'Anonymized view of featured images for public gallery display. Excludes user_id to prevent activity tracking. Uses security_invoker=true for proper RLS enforcement.';