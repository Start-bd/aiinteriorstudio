-- 1. Add user self-view policy for rate_limits
CREATE POLICY "Users can view their own rate limits"
ON public.rate_limits
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Add referrals UPDATE policy (service role only for status changes)
CREATE POLICY "Service role can update referrals"
ON public.referrals
FOR UPDATE
USING (auth.role() = 'service_role');

-- 3. Add referrals DELETE policy (service role only)
CREATE POLICY "Service role can delete referrals"
ON public.referrals
FOR DELETE
USING (auth.role() = 'service_role');

-- 4. Fix generated_images - allow service role to update metadata (for featuring images, updating counts)
DROP POLICY IF EXISTS "No one can update generated images" ON public.generated_images;

CREATE POLICY "Service role can update generated images"
ON public.generated_images
FOR UPDATE
USING (auth.role() = 'service_role');

-- 5. Add explicit INSERT policy for payments (service role only - created by webhooks)
CREATE POLICY "Service role can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- 6. Add service role UPDATE/DELETE for payments (for status updates from webhooks)
CREATE POLICY "Service role can update payments"
ON public.payments
FOR UPDATE
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete payments"
ON public.payments
FOR DELETE
USING (auth.role() = 'service_role');