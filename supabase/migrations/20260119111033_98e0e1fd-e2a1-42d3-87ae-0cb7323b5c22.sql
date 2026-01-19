-- Add user status fields to profiles table for moderation
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS status_reason TEXT,
ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status_updated_by UUID;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.status IS 'User account status: active, warned, suspended, banned';
COMMENT ON COLUMN public.profiles.status_reason IS 'Reason for the current status if not active';
COMMENT ON COLUMN public.profiles.status_updated_at IS 'When the status was last changed';
COMMENT ON COLUMN public.profiles.status_updated_by IS 'Admin who changed the status';

-- Create index for filtering by status
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);