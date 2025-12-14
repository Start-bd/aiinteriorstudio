-- Create rate_limits table to track user requests
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index for user + endpoint + window
CREATE UNIQUE INDEX idx_rate_limits_user_endpoint_window 
ON public.rate_limits (user_id, endpoint, window_start);

-- Create index for cleanup queries
CREATE INDEX idx_rate_limits_window_start ON public.rate_limits (window_start);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table (no user access needed)
-- No policies = no access for regular users, only service role can read/write