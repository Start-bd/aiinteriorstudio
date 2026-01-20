-- FIX: Strengthen RLS policies to ensure strict row-level access
-- The current "Block anonymous" policies don't actually restrict row access properly

-- ============================================
-- PROFILES TABLE: Simplify and strengthen
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

-- Single clear policy: users can ONLY see their own profile row
CREATE POLICY "Users can view own profile only"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR is_admin(auth.uid())
  OR auth.role() = 'service_role'
);

-- ============================================
-- PAYMENTS TABLE: Simplify the policy
-- ============================================
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Block anonymous access to payments" ON public.payments;

-- Simpler policy: check profile ownership directly
CREATE POLICY "Users can view own payments only"
ON public.payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = payments.user_id 
    AND p.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
  OR auth.role() = 'service_role'
);

-- ============================================
-- SUBSCRIPTIONS TABLE: Add proper row-level restriction
-- ============================================
DROP POLICY IF EXISTS "Block anonymous access to subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Single clear policy: users can ONLY see their own subscriptions
CREATE POLICY "Users can view own subscriptions only"
ON public.subscriptions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = subscriptions.user_id 
    AND p.user_id = auth.uid()
  )
  OR is_admin(auth.uid())
  OR auth.role() = 'service_role'
);

-- ============================================
-- CREDIT_TRANSACTIONS: Strengthen the policy
-- ============================================
DROP POLICY IF EXISTS "Block anonymous access to credit_transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;

-- Single clear policy: users can ONLY see their own transactions
CREATE POLICY "Users can view own credit transactions only"
ON public.credit_transactions
FOR SELECT
USING (
  auth.uid() = user_id
  OR is_admin(auth.uid())
  OR auth.role() = 'service_role'
);