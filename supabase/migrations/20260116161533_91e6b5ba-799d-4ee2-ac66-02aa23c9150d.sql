-- 1. admin_activity_logs: Allow service role to insert logs (for backend operations)
-- The table is already immutable (UPDATE/DELETE blocked), but service role needs INSERT access
CREATE POLICY "Service role can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- 2. user_roles: Add service role policies for system operations
-- Service role needs full access for system-level role management
CREATE POLICY "Service role can manage all roles"
ON public.user_roles
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. user_roles: Prevent admins from granting themselves additional roles (self-privilege escalation)
-- Drop and recreate the admin insert policy with self-grant prevention
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles for other users"
ON public.user_roles
FOR INSERT
WITH CHECK (
  is_admin(auth.uid()) 
  AND user_id != auth.uid()  -- Cannot grant roles to self
);

-- 4. generated_images: Add policy for viewing images in shared collections
-- This allows users to view images that are part of public/shared collections
CREATE POLICY "Anyone can view images in shared collections"
ON public.generated_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.collection_images ci
    JOIN public.collections c ON c.id = ci.collection_id
    WHERE ci.image_id = generated_images.id
    AND c.is_public = true
    AND c.share_token IS NOT NULL
  )
);

-- 5. admin_activity_logs: Add service role SELECT for system monitoring
CREATE POLICY "Service role can view activity logs"
ON public.admin_activity_logs
FOR SELECT
USING (auth.role() = 'service_role');