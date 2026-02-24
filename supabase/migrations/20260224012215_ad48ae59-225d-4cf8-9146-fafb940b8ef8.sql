CREATE OR REPLACE VIEW public.styles_public 
WITH (security_invoker = true)
AS SELECT id, name, display_name, description, thumbnail_url, 
          is_active, is_premium, sort_order, created_at
FROM public.styles;