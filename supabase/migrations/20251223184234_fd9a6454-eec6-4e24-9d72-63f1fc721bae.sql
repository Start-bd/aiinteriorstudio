-- Fix foreign key relationships that incorrectly reference profiles.id instead of profiles.user_id

-- 1) Ensure profiles.user_id is unique (needed for FK targets)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_user_id_key'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 2) credit_transactions.user_id should reference profiles.user_id
ALTER TABLE public.credit_transactions
  DROP CONSTRAINT IF EXISTS credit_transactions_user_id_fkey;

ALTER TABLE public.credit_transactions
  ADD CONSTRAINT credit_transactions_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(user_id)
  ON DELETE CASCADE;

-- 3) generation_likes.user_id should reference profiles.user_id
ALTER TABLE public.generation_likes
  DROP CONSTRAINT IF EXISTS generation_likes_user_id_fkey;

ALTER TABLE public.generation_likes
  ADD CONSTRAINT generation_likes_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(user_id)
  ON DELETE CASCADE;

-- 4) Optional: enforce generated_images.user_id references profiles.user_id (nullable)
-- (Do not add if you expect anonymous/public generations; keeping nullable is fine)
-- If desired later:
-- ALTER TABLE public.generated_images
--   DROP CONSTRAINT IF EXISTS generated_images_user_id_fkey;
-- ALTER TABLE public.generated_images
--   ADD CONSTRAINT generated_images_user_id_fkey
--   FOREIGN KEY (user_id)
--   REFERENCES public.profiles(user_id)
--   ON DELETE SET NULL;
