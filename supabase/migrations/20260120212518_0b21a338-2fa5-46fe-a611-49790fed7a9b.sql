-- Fix security issues: Add security_invoker to views so they respect RLS policies

-- 1. Fix profiles_safe view - recreate with security_invoker = true
-- This ensures the view respects RLS policies on the base profiles table
DROP VIEW IF EXISTS public.profiles_safe;

CREATE VIEW public.profiles_safe
WITH (security_invoker = true) AS
SELECT 
    id,
    user_id,
    display_name,
    avatar_url,
    credits,
    total_generations,
    subscription_tier,
    subscription_status,
    referral_code,
    referred_by,
    preferred_language,
    status,
    status_reason,
    status_updated_at,
    status_updated_by,
    created_at,
    updated_at
FROM public.profiles;

COMMENT ON VIEW public.profiles_safe IS 'Safe view of profiles table that excludes stripe_customer_id. Uses security_invoker to respect RLS policies - users can only see their own profile unless they are admins.';

-- 2. Fix generated_images_public view - recreate with security_invoker = true
-- This view already correctly excludes user_id for anonymity, but needs security_invoker
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
FROM public.generated_images
WHERE is_featured = true;

COMMENT ON VIEW public.generated_images_public IS 'Public view of featured images that anonymizes content by excluding user_id. Uses security_invoker to respect RLS policies. Only shows featured images for public gallery.';

-- 3. Fix payments_safe view for consistency - recreate with security_invoker = true
DROP VIEW IF EXISTS public.payments_safe;

CREATE VIEW public.payments_safe
WITH (security_invoker = true) AS
SELECT 
    id,
    user_id,
    amount,
    currency,
    payment_type,
    payment_method,
    credits_added,
    status,
    created_at,
    completed_at
FROM public.payments;

COMMENT ON VIEW public.payments_safe IS 'Safe view of payments table that excludes sensitive payment identifiers (stripe_payment_intent_id, bkash_payment_id, nagad_payment_ref). Uses security_invoker to respect RLS policies.';