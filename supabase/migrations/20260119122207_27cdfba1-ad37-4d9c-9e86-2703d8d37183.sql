-- SECURITY FIX: Create views to hide sensitive fields from profiles and payments tables
-- This prevents exposure of payment processor IDs and sensitive financial data

-- 1. Create a safe view for profiles that excludes sensitive payment processor data
CREATE VIEW public.profiles_safe
WITH (security_invoker=on) AS
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
    -- EXCLUDED: stripe_customer_id (sensitive payment processor identifier)
  FROM public.profiles;

-- 2. Create a safe view for payments that excludes sensitive payment processor IDs
CREATE VIEW public.payments_safe
WITH (security_invoker=on) AS
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
    -- EXCLUDED: stripe_payment_intent_id, bkash_payment_id, nagad_payment_ref, transaction_id, metadata
    -- These payment processor IDs should only be accessed server-side
  FROM public.payments;

-- 3. Update profiles RLS: Deny direct user SELECT access, only allow admin access to base table
-- Drop existing user SELECT policy and recreate with restricted access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Users should access through profiles_safe view, not directly
CREATE POLICY "Users can view own profile via view only"
ON public.profiles
FOR SELECT
USING (
  -- Only allow direct access for admin operations or service role
  (auth.uid() IS NOT NULL AND is_admin(auth.uid()))
  OR auth.role() = 'service_role'
);

-- 4. Update payments RLS: Deny direct user SELECT access
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;

-- Users should access through payments_safe view, not directly
CREATE POLICY "Users can view own payments via view only"
ON public.payments
FOR SELECT
USING (
  -- Only allow direct access for admin or service role
  (auth.uid() IS NOT NULL AND is_admin(auth.uid()))
  OR auth.role() = 'service_role'
);

-- 5. Grant SELECT on views to authenticated users
GRANT SELECT ON public.profiles_safe TO authenticated;
GRANT SELECT ON public.payments_safe TO authenticated;

-- 6. Add comment explaining the security pattern
COMMENT ON VIEW public.profiles_safe IS 'Safe view excluding stripe_customer_id for user access. Use this view in application code instead of direct profiles table access.';
COMMENT ON VIEW public.payments_safe IS 'Safe view excluding payment processor IDs (stripe, bkash, nagad) for user access. Use this view in application code instead of direct payments table access.';