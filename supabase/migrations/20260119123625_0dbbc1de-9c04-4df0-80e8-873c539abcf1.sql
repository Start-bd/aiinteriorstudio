-- FIX: Re-add user access policies for their own data
-- The security_invoker views need the underlying table to allow the user's access

-- For profiles: Users need to access their own row (for the view to work)
DROP POLICY IF EXISTS "Users can view own profile via view only" ON public.profiles;

-- Create a policy that allows users to view ONLY their own profile row
-- This is safe because the view excludes stripe_customer_id
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR is_admin(auth.uid()) 
    OR auth.role() = 'service_role'
  )
);

-- For payments: Users need to access their own payments (for the view to work)
DROP POLICY IF EXISTS "Users can view own payments via view only" ON public.payments;

-- Create a policy that allows users to view their own payment rows
-- Note: payments uses profile.id as user_id, not auth.uid directly
-- We need to check if the user owns the profile that matches the payment's user_id
CREATE POLICY "Users can view own payments"
ON public.payments
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = payments.user_id 
      AND p.user_id = auth.uid()
    )
    OR is_admin(auth.uid()) 
    OR auth.role() = 'service_role'
  )
);