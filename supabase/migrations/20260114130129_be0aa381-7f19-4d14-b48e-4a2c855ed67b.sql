-- Fix: Add service role authorization check to increment_generation_stat function
-- This prevents any authenticated user from directly calling the RPC to manipulate stats

CREATE OR REPLACE FUNCTION public.increment_generation_stat(p_generation_id uuid, p_stat_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Security: Only allow service role to call this function
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  CASE p_stat_type
    WHEN 'view' THEN
      UPDATE public.generated_images
      SET views_count = COALESCE(views_count, 0) + 1
      WHERE id = p_generation_id;
    WHEN 'like' THEN
      UPDATE public.generated_images
      SET likes_count = COALESCE(likes_count, 0) + 1
      WHERE id = p_generation_id;
    WHEN 'download' THEN
      UPDATE public.generated_images
      SET downloads_count = COALESCE(downloads_count, 0) + 1
      WHERE id = p_generation_id;
  END CASE;
END;
$function$;