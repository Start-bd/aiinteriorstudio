-- 1. Harden is_admin: only allow self-checks from client roles; service_role may check anyone.
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
SET statement_timeout TO '5s'
AS $function$
BEGIN
  IF auth.role() <> 'service_role' AND (auth.uid() IS NULL OR _user_id IS DISTINCT FROM auth.uid()) THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;

-- 2. has_role is not used by any RLS policy; remove client access entirely.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 3. Newsletter subscribers: explicit least privilege.
REVOKE ALL ON TABLE public.newsletter_subscribers FROM anon, authenticated;
GRANT INSERT ON TABLE public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON TABLE public.newsletter_subscribers TO authenticated;
GRANT ALL ON TABLE public.newsletter_subscribers TO service_role;

DROP POLICY IF EXISTS "Only admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Only admins can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));