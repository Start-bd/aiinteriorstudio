-- Add service role check to add_credits function for defense-in-depth
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id uuid, p_amount integer, p_type text, p_description text DEFAULT NULL::text, p_payment_id uuid DEFAULT NULL::uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Security: Only allow service role to call this function
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  -- Get current credits with row lock
  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Calculate new balance
  v_new_balance := COALESCE(v_current_credits, 0) + p_amount;

  -- Update user credits
  UPDATE public.profiles
  SET credits = v_new_balance,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    type,
    description,
    related_payment_id,
    balance_after
  ) VALUES (
    p_user_id,
    p_amount,
    p_type,
    p_description,
    p_payment_id,
    v_new_balance
  );

  RETURN v_new_balance;
END;
$function$;

-- Add service role check to deduct_credits function for defense-in-depth
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id uuid, p_amount integer, p_generation_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
  v_subscription_tier TEXT;
BEGIN
  -- Security: Only allow service role to call this function
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
  END IF;

  -- Get current credits and subscription tier with row lock
  SELECT credits, subscription_tier INTO v_current_credits, v_subscription_tier
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Pro and Business tiers have unlimited generations
  IF v_subscription_tier IN ('pro', 'business') THEN
    -- Still record the transaction but don't deduct
    INSERT INTO public.credit_transactions (
      user_id,
      amount,
      type,
      description,
      related_generation_id,
      balance_after
    ) VALUES (
      p_user_id,
      0,
      'generation',
      'Unlimited plan - no credits deducted',
      p_generation_id,
      v_current_credits
    );
    
    -- Increment total generations
    UPDATE public.profiles
    SET total_generations = COALESCE(total_generations, 0) + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN TRUE;
  END IF;

  -- Check if user has enough credits
  IF v_current_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_credits - p_amount;

  -- Update user credits and increment total_generations
  UPDATE public.profiles
  SET credits = v_new_balance,
      total_generations = COALESCE(total_generations, 0) + 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    type,
    description,
    related_generation_id,
    balance_after
  ) VALUES (
    p_user_id,
    -p_amount,
    'generation',
    'Credits used for image generation',
    p_generation_id,
    v_new_balance
  );

  RETURN TRUE;
END;
$function$;