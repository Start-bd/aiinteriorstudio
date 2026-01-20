-- Fix security issues: Strengthen RLS policies for profiles and payments tables
-- The goal is to ensure admin functions don't expose sensitive data to non-admins
-- and that proper access controls are enforced at the database level

-- PROFILES TABLE: Update RLS policies to be more restrictive
-- Drop existing policies that might have security issues
DROP POLICY IF EXISTS "Users can view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create separate, more restrictive policies
-- Users can ONLY view their own profile (not via admin function)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins need a separate policy that only kicks in when is_admin is true
-- This is still safe because is_admin is a SECURITY DEFINER function
CREATE POLICY "Admins can view all profiles for management"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND is_admin(auth.uid())
);

-- Service role needs access for backend operations
CREATE POLICY "Service role can view all profiles"
ON public.profiles
FOR SELECT
USING (auth.role() = 'service_role');

-- PAYMENTS TABLE: Update RLS policies to remove admin function dependency
DROP POLICY IF EXISTS "Users can view own payments only" ON public.payments;

-- Users can ONLY view their own payments (direct ownership check)
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all payments for management purposes
CREATE POLICY "Admins can view all payments for management"
ON public.payments
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND is_admin(auth.uid())
);

-- Service role already has access via existing policies

-- SUBSCRIPTIONS TABLE: Apply same pattern for consistency
DROP POLICY IF EXISTS "Users can view own subscriptions only" ON public.subscriptions;

-- Users can view their own subscriptions directly
CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions for management"
ON public.subscriptions
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND is_admin(auth.uid())
);

-- Service role access for backend operations
CREATE POLICY "Service role can view all subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.role() = 'service_role');

-- Add comment explaining the security model
COMMENT ON TABLE public.profiles IS 'User profiles with sensitive data. RLS ensures users can only see their own profile unless they are admins. Client-side code should use profiles_safe view when possible to avoid exposing stripe_customer_id.';

COMMENT ON TABLE public.payments IS 'Payment records with sensitive transaction data. RLS ensures users can only see their own payments. Client-side code should use payments_safe view to avoid exposing payment intent IDs.';