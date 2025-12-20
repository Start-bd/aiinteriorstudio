-- Fix 1: Add RLS policy for admins to update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Also add admin SELECT policy for viewing all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Fix 2: Fix generation_likes visibility - drop the permissive policy if it exists
-- First check if the policy exists and drop it
DO $$
BEGIN
    -- Drop "Anyone can view likes" if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'generation_likes' 
        AND policyname = 'Anyone can view likes'
    ) THEN
        DROP POLICY "Anyone can view likes" ON public.generation_likes;
    END IF;
END $$;

-- The existing "Users can view own likes" policy already restricts to auth.uid() = user_id
-- which is the correct behavior - users should only see their own likes