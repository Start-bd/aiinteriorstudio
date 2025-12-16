
-- =============================================
-- PHASE 1: UPDATE PROFILES TABLE
-- =============================================

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS total_generations INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'business')),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'bn'));

-- Generate referral codes for existing users
UPDATE public.profiles 
SET referral_code = substring(md5(random()::text || id::text) from 1 for 8) 
WHERE referral_code IS NULL;

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro', 'business')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'incomplete')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- PAYMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'BDT')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'bkash', 'nagad')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('subscription', 'credit_pack', 'marketplace')),
  transaction_id TEXT,
  stripe_payment_intent_id TEXT,
  bkash_payment_id TEXT,
  nagad_payment_ref TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  credits_added INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- CREDIT TRANSACTIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'generation', 'refund', 'bonus', 'referral')),
  description TEXT,
  related_generation_id UUID REFERENCES public.generated_images(id),
  related_payment_id UUID REFERENCES public.payments(id),
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- STYLES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  prompt_template TEXT NOT NULL,
  negative_prompt_template TEXT,
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default styles
INSERT INTO public.styles (name, display_name, description, prompt_template, negative_prompt_template, sort_order) VALUES
('modern', 'Modern', 'Clean lines, minimal decoration, contemporary furniture', 'modern interior design, clean lines, minimalist, contemporary furniture, neutral colors', 'cluttered, vintage, ornate, traditional', 1),
('luxury', 'Luxury', 'High-end finishes, premium materials, elegant details', 'luxury interior design, high-end finishes, premium materials, elegant, sophisticated, expensive', 'cheap, basic, simple, plain', 2),
('minimalist', 'Minimalist', 'Simple, functional, clutter-free spaces', 'minimalist interior design, simple, clean, functional, clutter-free, scandinavian', 'ornate, decorative, busy, cluttered', 3),
('traditional', 'Traditional', 'Classic furniture, rich colors, ornate details', 'traditional interior design, classic furniture, rich colors, ornate details, timeless', 'modern, contemporary, minimalist', 4),
('industrial', 'Industrial', 'Exposed brick, metal accents, raw materials', 'industrial interior design, exposed brick, metal accents, raw materials, urban loft', 'ornate, traditional, soft, decorative', 5),
('scandinavian', 'Scandinavian', 'Light colors, natural materials, cozy atmosphere', 'scandinavian interior design, light colors, natural materials, cozy, hygge, wooden', 'dark, heavy, ornate', 6),
('bohemian', 'Bohemian', 'Eclectic mix, colorful patterns, global influences', 'bohemian interior design, eclectic, colorful patterns, global influences, artistic', 'minimalist, simple, monochrome', 7),
('coastal', 'Coastal', 'Light blues, natural textures, beach-inspired', 'coastal interior design, light blue, natural textures, beach-inspired, relaxed, airy', 'dark, heavy, urban', 8)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- ROOM TYPES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.room_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Insert room types
INSERT INTO public.room_types (name, display_name, icon, sort_order) VALUES
('living_room', 'Living Room', 'sofa', 1),
('bedroom', 'Bedroom', 'bed', 2),
('kitchen', 'Kitchen', 'chef-hat', 3),
('bathroom', 'Bathroom', 'bath', 4),
('dining_room', 'Dining Room', 'utensils', 5),
('home_office', 'Home Office', 'laptop', 6),
('kids_room', 'Kids Room', 'baby', 7),
('outdoor', 'Outdoor', 'tree-pine', 8)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- GENERATION LIKES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.generation_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  generation_id UUID REFERENCES public.generated_images(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, generation_id)
);

CREATE INDEX IF NOT EXISTS idx_generation_likes_user_id ON public.generation_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_likes_generation_id ON public.generation_likes(generation_id);

ALTER TABLE public.generation_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own likes" ON public.generation_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view likes" ON public.generation_likes FOR SELECT USING (true);

-- =============================================
-- REFERRALS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  credits_earned INTEGER DEFAULT 10,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- =============================================
-- Add likes_count to generated_images if not exists
-- =============================================

ALTER TABLE public.generated_images 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downloads_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS room_type TEXT DEFAULT 'living_room',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- =============================================
-- DATABASE FUNCTIONS
-- =============================================

-- Function to deduct credits and record transaction
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_generation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
  v_subscription_tier TEXT;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to add credits
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_payment_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to increment generation stats
CREATE OR REPLACE FUNCTION public.increment_generation_stat(
  p_generation_id UUID,
  p_stat_type TEXT
)
RETURNS VOID AS $$
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update handle_new_user to include referral code and credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, credits, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    3,
    substring(md5(random()::text || NEW.id::text) from 1 for 8)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
