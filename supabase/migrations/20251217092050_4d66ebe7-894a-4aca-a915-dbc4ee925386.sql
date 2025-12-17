-- Fix: Restrict profiles table to own profile only
-- This prevents exposure of email addresses, Stripe IDs, referral codes, etc.

DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);