import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Allowed origins for CORS - restrict to known domains
const allowedOrigins = [
  'https://interiorofai.com',
  'https://www.interiorofai.com',
  'https://aiinteriorstudio.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.some(allowed => origin === allowed || origin.endsWith('.lovable.app'));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 image generations per minute (more expensive)

async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS);
  
  // Try to upsert the rate limit record
  const { data, error } = await supabase
    .from('rate_limits')
    .upsert(
      {
        user_id: userId,
        endpoint,
        window_start: windowStart.toISOString(),
        request_count: 1,
      },
      {
        onConflict: 'user_id,endpoint,window_start',
        ignoreDuplicates: false,
      }
    )
    .select('request_count')
    .single();

  if (error) {
    // If upsert failed, try to increment existing record
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .eq('window_start', windowStart.toISOString())
      .single();

    if (existing) {
      const newCount = existing.request_count + 1;
      await supabase
        .from('rate_limits')
        .update({ request_count: newCount })
        .eq('user_id', userId)
        .eq('endpoint', endpoint)
        .eq('window_start', windowStart.toISOString());

      return {
        allowed: newCount <= MAX_REQUESTS_PER_WINDOW,
        remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - newCount),
      };
    }
    
    // If no record exists, allow the request (first request in window)
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  const count = data?.request_count || 1;
  return {
    allowed: count <= MAX_REQUESTS_PER_WINDOW,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - count),
  };
}

// Style categories and their keywords
const STYLE_KEYWORDS: Record<string, string[]> = {
  "Modern": ["modern", "contemporary", "sleek", "clean lines", "minimalist modern"],
  "Scandinavian": ["scandinavian", "nordic", "hygge", "scandi", "swedish", "danish", "norwegian"],
  "Industrial": ["industrial", "loft", "exposed brick", "metal", "warehouse", "urban"],
  "Minimalist": ["minimalist", "minimal", "simple", "zen", "sparse", "bare"],
  "Bohemian": ["bohemian", "boho", "eclectic", "colorful", "artistic", "hippie"],
  "Mid-Century": ["mid-century", "midcentury", "retro", "60s", "70s", "vintage modern"],
  "Traditional": ["traditional", "classic", "elegant", "timeless", "antique", "heritage"],
  "Rustic": ["rustic", "farmhouse", "country", "cabin", "wood", "cozy cottage"],
  "Luxury": ["luxury", "luxurious", "opulent", "glamorous", "high-end", "premium", "gold"],
  "Japanese": ["japanese", "japandi", "wabi-sabi", "zen", "tatami", "shoji"],
};

function detectStyle(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return style;
    }
  }
  
  return "Other";
}

// Input validation function
function validatePrompt(prompt: unknown): { valid: boolean; error?: string; sanitized?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt must be a non-empty string' };
  }
  
  const trimmed = prompt.trim();
  if (trimmed.length < 10) {
    return { valid: false, error: 'Prompt too short (minimum 10 characters)' };
  }
  if (trimmed.length > 500) {
    return { valid: false, error: 'Prompt too long (maximum 500 characters)' };
  }
  
  // Sanitize: remove potential injection characters and limit length
  const sanitized = trimmed
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 500);
  
  return { valid: true, sanitized };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing Supabase configuration");
      throw new Error("Server configuration error");
    }

    // Verify the JWT token
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

    // Check rate limit using service role client
    if (SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const rateLimitResult = await checkRateLimit(supabaseAdmin, user.id, 'generate-interior-image');
      
      if (!rateLimitResult.allowed) {
        console.log("Rate limit exceeded for user:", user.id);
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait a moment before generating more images.',
            retryAfter: 60 
          }),
          { 
            status: 429, 
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json",
              "Retry-After": "60"
            } 
          }
        );
      }
      console.log("Rate limit check passed, remaining:", rateLimitResult.remaining);
    }

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body = await req.json();
    
    // Validate and sanitize prompt
    const validation = validatePrompt(body.prompt);
    if (!validation.valid) {
      console.error("Prompt validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = validation.sanitized!;

    // Detect style from prompt
    const detectedStyle = detectStyle(prompt);
    console.log("Detected style:", detectedStyle);

    // SERVER-SIDE CREDIT CHECK AND DEDUCTION (before generating image)
    // This prevents bypassing the credit system by calling the API directly
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing service role key for credit deduction");
      throw new Error("Server configuration error");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // First check if user has a profile with credits
    let { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits, subscription_tier')
      .eq('user_id', user.id)
      .single();
    
    // If profile doesn't exist, create it automatically with default credits
    if (profileError || !profile) {
      console.log("Profile not found, creating one for user:", user.id);
      
      const displayName = user.user_metadata?.display_name || 
                          user.email?.split('@')[0] || 
                          'User';
      const referralCode = crypto.randomUUID().substring(0, 8);
      
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: user.id,
          display_name: displayName,
          credits: 3,
          referral_code: referralCode,
          subscription_tier: 'free',
          subscription_status: 'inactive'
        })
        .select('credits, subscription_tier')
        .single();
      
      if (createError) {
        console.error("Failed to create profile:", createError.message);
        return new Response(
          JSON.stringify({ error: 'Failed to initialize your account. Please try again.' }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      profile = newProfile;
      console.log("Profile created successfully with 3 credits");
    }
    
    console.log("User profile found:", { credits: profile.credits, tier: profile.subscription_tier });
    
    // Check if user has enough credits (unless on pro/business tier)
    if (!['pro', 'business'].includes(profile.subscription_tier || '') && (profile.credits || 0) < 1) {
      console.log("Insufficient credits for user:", user.id);
      return new Response(
        JSON.stringify({ error: 'Insufficient credits. Please purchase more credits or upgrade your subscription.' }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Deduct 1 credit before generating image
    const { data: creditDeducted, error: creditError } = await supabaseAdmin
      .rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: 1,
        p_generation_id: null // Will be linked after generation
      });

    if (creditError) {
      console.error("Credit deduction error:", creditError.message, creditError.details, creditError.hint);
      return new Response(
        JSON.stringify({ error: 'Failed to process credits. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (creditDeducted === false) {
      console.log("Credit deduction returned false for user:", user.id);
      return new Response(
        JSON.stringify({ error: 'Insufficient credits. Please purchase more credits or upgrade your subscription.' }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Credits deducted successfully for user:", user.id);

    // Enhance the prompt for better interior design results
    const enhancedPrompt = `Professional interior design photography: ${prompt}. Ultra high resolution, photorealistic, architectural visualization, beautiful natural lighting, magazine quality interior photography, 8k detailed render.`;

    console.log("Generating image for user:", user.id);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Image generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("AI response received");

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent = data.choices?.[0]?.message?.content || "";

    if (!imageUrl) {
      console.error("No image in response");
      return new Response(JSON.stringify({ error: "No image was generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Image generated successfully, saving to database...");

    // Save the generated image to the database with style
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const { error: dbError } = await supabase
        .from("generated_images")
        .insert({
          prompt: prompt,
          image_url: imageUrl,
          style: detectedStyle,
          user_id: user.id,
        });

      if (dbError) {
        console.error("Failed to save image to database:", dbError);
      } else {
        console.log("Image saved to database with style:", detectedStyle);
      }
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        description: textContent,
        style: detectedStyle,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  }
});
