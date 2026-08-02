DROP POLICY IF EXISTS "Admins and service role can view styles" ON public.styles;
CREATE POLICY "Admins and service role can view styles"
ON public.styles FOR SELECT
TO authenticated, service_role
USING (auth.role() = 'service_role' OR is_admin(auth.uid()));