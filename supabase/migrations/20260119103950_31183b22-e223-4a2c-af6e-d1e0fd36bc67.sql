-- Fix error-level issues: Add explicit anonymous access blocks to sensitive tables

-- 1. Profiles table - Add explicit anonymous block
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;
CREATE POLICY "Block anonymous access to profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Payments table - Add explicit anonymous block  
DROP POLICY IF EXISTS "Block anonymous access to payments" ON public.payments;
CREATE POLICY "Block anonymous access to payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. Subscriptions table - Add explicit anonymous block
DROP POLICY IF EXISTS "Block anonymous access to subscriptions" ON public.subscriptions;
CREATE POLICY "Block anonymous access to subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 4. Credit transactions table - Add explicit anonymous block
DROP POLICY IF EXISTS "Block anonymous access to credit_transactions" ON public.credit_transactions;
CREATE POLICY "Block anonymous access to credit_transactions" 
ON public.credit_transactions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 5. Referrals table - Add explicit anonymous block
DROP POLICY IF EXISTS "Block anonymous access to referrals" ON public.referrals;
CREATE POLICY "Block anonymous access to referrals" 
ON public.referrals 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix warn-level issues: Add explicit anonymous access blocks to other tables

-- 6. Generated images - Update policy to require auth for non-public access
DROP POLICY IF EXISTS "Block anonymous access to private images" ON public.generated_images;
CREATE POLICY "Block anonymous access to private images" 
ON public.generated_images 
FOR SELECT 
USING (
  -- Allow if user is authenticated
  auth.uid() IS NOT NULL
  -- OR if image is featured (public)
  OR is_featured = true
  -- OR if image is in a public collection
  OR EXISTS (
    SELECT 1 FROM public.collection_images ci
    JOIN public.collections c ON c.id = ci.collection_id
    WHERE ci.image_id = generated_images.id
    AND (c.is_public = true OR c.share_token IS NOT NULL)
  )
);

-- 7. Favorites table - Add explicit anonymous block
DROP POLICY IF EXISTS "Block anonymous access to favorites" ON public.favorites;
CREATE POLICY "Block anonymous access to favorites" 
ON public.favorites 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 8. Generation likes table - Add explicit anonymous block
DROP POLICY IF EXISTS "Block anonymous access to generation_likes" ON public.generation_likes;
CREATE POLICY "Block anonymous access to generation_likes" 
ON public.generation_likes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 9. Collections table - Update to explicitly handle anonymous access
DROP POLICY IF EXISTS "Block anonymous access to private collections" ON public.collections;
CREATE POLICY "Allow access to public collections or authenticated users" 
ON public.collections 
FOR SELECT 
USING (
  -- Public collections are accessible to everyone
  is_public = true 
  -- Shared collections are accessible via share token
  OR share_token IS NOT NULL
  -- Authenticated users can access their own collections
  OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

-- 10. Rate limits table - Add explicit anonymous block
DROP POLICY IF EXISTS "Block anonymous access to rate_limits" ON public.rate_limits;
CREATE POLICY "Block anonymous access to rate_limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 11. User roles table - Already requires auth, but tighten to own roles only for non-admins
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    -- Users can see their own roles
    user_id = auth.uid()
    -- Or admins can see all roles
    OR public.is_admin(auth.uid())
  )
);