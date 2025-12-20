-- Fix 1: Add RLS policy for rate_limits table to allow service role management
-- The rate_limits table should only be accessible by the service role (used in edge functions)
-- Users should NOT be able to view or manipulate their own rate limit records

CREATE POLICY "Service role can manage rate limits"
ON public.rate_limits
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Fix 2: Add explicit restrictive policies for referrals table
-- Referrals should only be created by backend service to prevent credit exploitation
-- Users can view their own referrals (where they are referrer or referred)

CREATE POLICY "Users can view referrals they are part of"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Explicitly deny user INSERT - only service role can create referrals
CREATE POLICY "Only service role can create referrals"
ON public.referrals
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Fix 3: Add policies to protect admin_activity_logs from tampering
-- Logs should be append-only - no UPDATE or DELETE allowed even for admins
-- This maintains audit trail integrity

CREATE POLICY "No one can update admin logs"
ON public.admin_activity_logs
FOR UPDATE
USING (false);

CREATE POLICY "No one can delete admin logs"
ON public.admin_activity_logs
FOR DELETE
USING (false);