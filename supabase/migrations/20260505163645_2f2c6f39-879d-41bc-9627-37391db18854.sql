
-- Collections: drop overly broad policy that exposed any collection with a share_token
DROP POLICY IF EXISTS "Allow access to public collections or authenticated users" ON public.collections;

-- Generated images: drop policy that let any authenticated user read all images
DROP POLICY IF EXISTS "Block anonymous access to private images" ON public.generated_images;

-- Favorites
DROP POLICY IF EXISTS "Block anonymous access to favorites" ON public.favorites;

-- Generation likes
DROP POLICY IF EXISTS "Block anonymous access to generation_likes" ON public.generation_likes;

-- Referrals
DROP POLICY IF EXISTS "Block anonymous access to referrals" ON public.referrals;

-- Rate limits
DROP POLICY IF EXISTS "Block anonymous access to rate_limits" ON public.rate_limits;

-- Styles: hide proprietary prompt templates from public table access (use styles_public view instead)
REVOKE SELECT ON public.styles FROM anon, authenticated;

-- Revoke EXECUTE on sensitive SECURITY DEFINER functions (they self-check service_role)
REVOKE EXECUTE ON FUNCTION public.purge_old_suspicious_logs() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_generation_stat(uuid, text) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.add_credits(uuid, integer, text, text, uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.deduct_credits(uuid, integer, uuid) FROM anon, authenticated, PUBLIC;
