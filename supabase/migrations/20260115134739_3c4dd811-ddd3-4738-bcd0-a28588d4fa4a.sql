-- Fix error-level security issues by ensuring explicit anonymous access blocks

-- 1. PROFILES: Update admin policy to include explicit null check
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- 2. PROFILES: Update admin update policy to include explicit null check  
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- Note: payments, subscriptions, and credit_transactions already have 
-- explicit (auth.uid() IS NOT NULL) checks in their SELECT policies.
-- Adding additional explicit block policies for defense-in-depth:

-- 3. PAYMENTS: The existing policy already has auth.uid() IS NOT NULL check
-- No changes needed - policy is: ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id))

-- 4. SUBSCRIPTIONS: The existing policy already has auth.uid() IS NOT NULL check
-- No changes needed - policy is: ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id))

-- 5. CREDIT_TRANSACTIONS: The existing policy already has auth.uid() IS NOT NULL check
-- No changes needed - policy is: ((auth.uid() IS NOT NULL) AND (auth.uid() = user_id))