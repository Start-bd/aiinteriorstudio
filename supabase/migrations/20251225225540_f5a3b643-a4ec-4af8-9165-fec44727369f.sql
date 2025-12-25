-- Fix RLS policies to explicitly require authentication (prevent null auth.uid() scenarios)

-- Fix payments table - require authenticated user
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix credit_transactions table - require authenticated user
DROP POLICY IF EXISTS "Users can view their own credit transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can view own credit transactions" ON public.credit_transactions;
CREATE POLICY "Users can view their own credit transactions" 
  ON public.credit_transactions 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix subscriptions table - require authenticated user
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" 
  ON public.subscriptions 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Fix profiles table - require authenticated user
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);