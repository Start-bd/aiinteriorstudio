
-- Duplicate SELECT policies
DROP POLICY IF EXISTS "Users can view their own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can view referrals they are part of" ON public.referrals;

-- Redundant share_token-based policies (public collections already covered by is_public policies)
DROP POLICY IF EXISTS "Anyone can view images in shared collections" ON public.collection_images;
DROP POLICY IF EXISTS "Anyone can view images in shared collections" ON public.generated_images;

-- Lock down SECURITY DEFINER helpers not needed by end users
REVOKE EXECUTE ON FUNCTION public.generate_share_token() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Remove anon execute on role-check helpers (authenticated must retain access for RLS policy evaluation)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
