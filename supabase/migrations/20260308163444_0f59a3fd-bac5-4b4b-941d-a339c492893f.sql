
-- Add statement_timeout to all database functions for safety

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout = '5s'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout = '5s'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$function$;

CREATE OR REPLACE FUNCTION public.generate_share_token()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout = '5s'
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_amount integer, p_type text, p_description text DEFAULT NULL::text, p_payment_id uuid DEFAULT NULL::uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout = '5s'
AS $function$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  v_new_balance := COALESCE(v_current_credits, 0) + p_amount;

  UPDATE public.profiles
  SET credits = v_new_balance,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO public.credit_transactions (
    user_id, amount, type, description, related_payment_id, balance_after
  ) VALUES (
    p_user_id, p_amount, p_type, p_description, p_payment_id, v_new_balance
  );

  RETURN v_new_balance;
END;
$function$;

CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id uuid, p_amount integer, p_generation_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout = '5s'
AS $function$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
  v_subscription_tier TEXT;
BEGIN
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  SELECT credits, subscription_tier INTO v_current_credits, v_subscription_tier
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_subscription_tier IN ('pro', 'business') THEN
    INSERT INTO public.credit_transactions (
      user_id, amount, type, description, related_generation_id, balance_after
    ) VALUES (
      p_user_id, 0, 'generation', 'Unlimited plan - no credits deducted', p_generation_id, v_current_credits
    );
    
    UPDATE public.profiles
    SET total_generations = COALESCE(total_generations, 0) + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN TRUE;
  END IF;

  IF v_current_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  v_new_balance := v_current_credits - p_amount;

  UPDATE public.profiles
  SET credits = v_new_balance,
      total_generations = COALESCE(total_generations, 0) + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO public.credit_transactions (
    user_id, amount, type, description, related_generation_id, balance_after
  ) VALUES (
    p_user_id, -p_amount, 'generation', 'Credits used for image generation', p_generation_id, v_new_balance
  );

  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_generation_stat(p_generation_id uuid, p_stat_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout = '5s'
AS $function$
BEGIN
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

CREATE OR REPLACE FUNCTION public.purge_old_suspicious_logs()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
 SET statement_timeout = '10s'
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  DELETE FROM public.suspicious_prompt_logs
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$function$;
