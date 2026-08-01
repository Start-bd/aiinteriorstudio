-- Remove permissive full-table read policy on styles
DROP POLICY IF EXISTS "Anyone can view active styles" ON public.styles;

CREATE POLICY "Admins and service role can view styles"
ON public.styles
FOR SELECT
USING (auth.role() = 'service_role' OR public.is_admin(auth.uid()));

-- Ensure base table is never readable by public roles
REVOKE SELECT ON public.styles FROM anon, authenticated;
GRANT ALL ON public.styles TO service_role;

-- Recreate public view as definer-based so it can expose only safe columns
DROP VIEW IF EXISTS public.styles_public;

CREATE VIEW public.styles_public
WITH (security_invoker = false) AS
SELECT
  id,
  name,
  display_name,
  description,
  thumbnail_url,
  is_active,
  is_premium,
  sort_order,
  created_at
FROM public.styles
WHERE is_active = true;

ALTER VIEW public.styles_public OWNER TO postgres;

REVOKE ALL ON public.styles_public FROM anon, authenticated;
GRANT SELECT ON public.styles_public TO anon, authenticated;
GRANT ALL ON public.styles_public TO service_role;