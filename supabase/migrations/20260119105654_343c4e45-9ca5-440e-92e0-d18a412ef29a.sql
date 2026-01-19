-- Create table for suspicious prompt logs
CREATE TABLE public.suspicious_prompt_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  prompt_text TEXT NOT NULL,
  matched_patterns TEXT[] NOT NULL,
  source TEXT NOT NULL, -- 'image_generation' or 'chat'
  ip_address TEXT,
  user_agent TEXT,
  reviewed BOOLEAN DEFAULT false,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suspicious_prompt_logs ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can view suspicious prompts
CREATE POLICY "Admins can view suspicious prompts"
ON public.suspicious_prompt_logs
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Service role can insert suspicious prompts"
ON public.suspicious_prompt_logs
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can update suspicious prompts"
ON public.suspicious_prompt_logs
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Service role has full access"
ON public.suspicious_prompt_logs
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Create index for faster queries
CREATE INDEX idx_suspicious_prompts_created_at ON public.suspicious_prompt_logs(created_at DESC);
CREATE INDEX idx_suspicious_prompts_reviewed ON public.suspicious_prompt_logs(reviewed);
CREATE INDEX idx_suspicious_prompts_user_id ON public.suspicious_prompt_logs(user_id);