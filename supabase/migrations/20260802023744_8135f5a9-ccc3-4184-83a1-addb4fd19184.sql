-- 1. styles: allow public browsing of safe columns only, drop SECURITY DEFINER view
CREATE POLICY "Anyone can view active styles"
ON public.styles FOR SELECT
TO anon, authenticated
USING (is_active = true);

GRANT SELECT (id, name, display_name, description, thumbnail_url, is_active, is_premium, sort_order, created_at)
ON public.styles TO anon, authenticated;

ALTER VIEW public.styles_public SET (security_invoker = true);

-- 2. admin_activity_logs: bind admin_user_id to the caller
DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can insert activity logs"
ON public.admin_activity_logs FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()) AND admin_user_id = auth.uid());

-- 3. Stripe webhook idempotency
CREATE TABLE public.processed_webhook_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text NOT NULL UNIQUE,
  event_type text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.processed_webhook_events TO service_role;

ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages webhook events"
ON public.processed_webhook_events FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');