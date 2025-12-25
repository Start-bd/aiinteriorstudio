-- Fix RLS policies for payments table (PUBLIC_PAYMENT_DATA)
-- Drop existing permissive SELECT policy if any and create restrictive one
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Fix RLS policies for credit_transactions table (PUBLIC_CREDIT_TRANSACTION_DATA)
DROP POLICY IF EXISTS "Users can view their own credit transactions" ON public.credit_transactions;
CREATE POLICY "Users can view their own credit transactions" 
  ON public.credit_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Fix RLS policies for subscriptions table (PUBLIC_SUBSCRIPTION_DATA)
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Fix RLS policies for profiles table (PUBLIC_PROFILE_DATA)
-- Users should only see their own profile, admins can see all
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );