-- Fix duplicate policies and add missing restrictions

-- Remove duplicate payment policy
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;

-- Fix generated_images to prevent NULL user_id inserts
DROP POLICY IF EXISTS "Authenticated users can insert images" ON public.generated_images;
CREATE POLICY "Authenticated users can insert images" 
  ON public.generated_images 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Add explicit service role policies for credit_transactions
CREATE POLICY "Service role can manage credit transactions" 
  ON public.credit_transactions 
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Tighten subscriptions service role policy to specific operations
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can insert subscriptions" 
  ON public.subscriptions 
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update subscriptions" 
  ON public.subscriptions 
  FOR UPDATE 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete subscriptions" 
  ON public.subscriptions 
  FOR DELETE 
  USING (auth.role() = 'service_role');