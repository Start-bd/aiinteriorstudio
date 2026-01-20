-- Move stripe_customer_id to a separate restricted table for enhanced security
-- This prevents even admins from accessing payment provider identifiers directly

-- 1. Create the new restricted table for payment provider identifiers
CREATE TABLE public.user_payment_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enable RLS on the new table
ALTER TABLE public.user_payment_identifiers ENABLE ROW LEVEL SECURITY;

-- 3. Create RESTRICTIVE policies - ONLY service role can access
-- No user or admin access allowed - this is purely for backend operations
CREATE POLICY "Service role can manage payment identifiers"
ON public.user_payment_identifiers
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Block all other access explicitly
CREATE POLICY "Block all non-service access"
ON public.user_payment_identifiers
AS RESTRICTIVE
FOR ALL
USING (auth.role() = 'service_role');

-- 4. Migrate existing data from profiles to the new table
INSERT INTO public.user_payment_identifiers (user_id, stripe_customer_id)
SELECT user_id, stripe_customer_id 
FROM public.profiles 
WHERE stripe_customer_id IS NOT NULL;

-- 5. Create trigger for updated_at
CREATE TRIGGER update_user_payment_identifiers_updated_at
    BEFORE UPDATE ON public.user_payment_identifiers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Add index for fast lookups by stripe_customer_id (used in webhook)
CREATE INDEX idx_user_payment_identifiers_stripe_customer_id 
ON public.user_payment_identifiers(stripe_customer_id);

-- 7. Remove stripe_customer_id from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;

-- 8. Update profiles_safe view (stripe_customer_id is no longer in profiles)
DROP VIEW IF EXISTS public.profiles_safe;

CREATE VIEW public.profiles_safe
WITH (security_invoker = true) AS
SELECT 
    id,
    user_id,
    display_name,
    avatar_url,
    credits,
    total_generations,
    subscription_tier,
    subscription_status,
    referral_code,
    referred_by,
    preferred_language,
    status,
    status_reason,
    status_updated_at,
    status_updated_by,
    created_at,
    updated_at
FROM public.profiles;

COMMENT ON VIEW public.profiles_safe IS 'Safe view of profiles table. Uses security_invoker to respect RLS policies. Payment provider IDs are now stored in a separate restricted table.';

COMMENT ON TABLE public.user_payment_identifiers IS 'Restricted table for payment provider identifiers. ONLY accessible by service_role. Contains stripe_customer_id and potentially future payment provider IDs (bKash, Nagad). No user or admin access permitted to prevent exposure of sensitive payment data.';

COMMENT ON TABLE public.profiles IS 'User profiles. Stripe customer ID has been moved to user_payment_identifiers table for enhanced security isolation.';