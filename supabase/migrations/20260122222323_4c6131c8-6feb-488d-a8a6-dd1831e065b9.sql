-- Create function to purge old suspicious prompt logs (30-day retention)
CREATE OR REPLACE FUNCTION public.purge_old_suspicious_logs()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Security: Only allow service role to call this function
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  -- Delete logs older than 30 days
  DELETE FROM public.suspicious_prompt_logs
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$function$;

-- Add comment documenting the retention policy
COMMENT ON TABLE public.suspicious_prompt_logs IS 'Security audit logs for suspicious prompts. Subject to 30-day data retention policy for privacy compliance.';
COMMENT ON FUNCTION public.purge_old_suspicious_logs() IS 'Purges suspicious_prompt_logs older than 30 days. Should be called daily via scheduled edge function.';