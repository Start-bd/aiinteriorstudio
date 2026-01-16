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
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute for chat

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

const SYSTEM_PROMPT = `You are an expert AI interior design assistant for "Interior of AI". You help users discover their ideal room styles quickly and concisely.

CRITICAL RULES:
1. Ask MAXIMUM 2-3 short clarifying questions, then provide recommendations
2. Always offer 2-3 specific clickable options for users to choose from
3. Keep responses SHORT - max 2 paragraphs
4. Be warm but efficient - users want quick inspiration

When users are unsure, offer choices like:
- "Choose a style: 🏠 Modern | 🌿 Scandinavian | ✨ Luxury | 🎨 Bohemian"
- "What room? 🛋️ Living Room | 🛏️ Bedroom | 🍳 Kitchen | 🛁 Bathroom"

Your expertise: Modern, minimalist, Scandinavian, industrial, mid-century, luxury, bohemian, Japanese styles. Color theory, furniture, lighting, textures, sustainable design.

After gathering basic info (room type + style preference), immediately provide specific recommendations. Don't over-ask - be decisive and inspiring.

Start with a brief greeting and ONE question about their design goal.`;

// Common prompt injection patterns to detect
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/i,
  /forget\s+(all\s+)?(previous|your|the)\s+(instructions?|prompts?|rules?|training)/i,
  /disregard\s+(all\s+)?(previous|above|prior|your)/i,
  /you\s+are\s+now\s+(a|an|the)\s+/i,
  /new\s+persona|new\s+role|act\s+as\s+(if|a|an)/i,
  /system:\s*|assistant:\s*|user:\s*/i,
  /\[\s*system\s*\]|\[\s*inst(ruction)?\s*\]/i,
  /override\s+(safety|content|previous)/i,
  /jailbreak|bypass\s+(filter|safety|restriction)/i,
  /pretend\s+(you\s+are|to\s+be|that)/i,
  /do\s+not\s+follow\s+(your|the|any)\s+(rules?|guidelines?)/i,
];

// Check for suspicious patterns in text
function detectInjectionAttempt(text: string): { suspicious: boolean; patterns: string[] } {
  const lowerText = text.toLowerCase();
  const matchedPatterns: string[] = [];
  
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(lowerText)) {
      matchedPatterns.push(pattern.source);
    }
  }
  
  // Check for excessive special characters (potential encoding attacks)
  const specialCharRatio = (text.match(/[^\w\s.,!?'-]/g) || []).length / text.length;
  if (specialCharRatio > 0.3) {
    matchedPatterns.push('excessive_special_chars');
  }
  
  return {
    suspicious: matchedPatterns.length > 0,
    patterns: matchedPatterns,
  };
}

// Validate chat messages
function validateMessages(messages: unknown): { valid: boolean; error?: string; sanitized?: Array<{role: string; content: string}>; suspiciousMessages?: number } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }
  
  if (messages.length === 0) {
    return { valid: false, error: 'Messages cannot be empty' };
  }
  
  if (messages.length > 50) {
    return { valid: false, error: 'Too many messages (maximum 50)' };
  }
  
  const sanitized: Array<{role: string; content: string}> = [];
  let suspiciousCount = 0;
  
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: 'Invalid message format' };
    }
    
    const { role, content } = msg as { role: unknown; content: unknown };
    
    if (typeof role !== 'string' || !['user', 'assistant'].includes(role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    
    if (typeof content !== 'string') {
      return { valid: false, error: 'Message content must be a string' };
    }
    
    if (content.length > 5000) {
      return { valid: false, error: 'Message too long (maximum 5000 characters)' };
    }
    
    // Check for prompt injection attempts in user messages
    if (role === 'user') {
      const injectionCheck = detectInjectionAttempt(content);
      if (injectionCheck.suspicious) {
        suspiciousCount++;
        console.warn("SECURITY: Potential prompt injection in chat message:", {
          patterns: injectionCheck.patterns,
          messagePreview: content.substring(0, 100) + '...',
        });
      }
    }
    
    // Sanitize content - remove angle brackets and role markers
    const sanitizedContent = content
      .trim()
      .replace(/[<>]/g, '')
      .replace(/\[\s*(system|inst(ruction)?|user|assistant)\s*\]/gi, '');
    
    sanitized.push({ role, content: sanitizedContent });
  }
  
  return { valid: true, sanitized, suspiciousMessages: suspiciousCount };
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
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const rateLimitResult = await checkRateLimit(supabaseAdmin, user.id, 'interior-design-chat');
      
      if (!rateLimitResult.allowed) {
        console.log("Rate limit exceeded for user:", user.id);
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait a moment before sending more messages.',
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
    
    // Validate and sanitize messages
    const validation = validateMessages(body.messages);
    if (!validation.valid) {
      console.error("Messages validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = validation.sanitized!;
    console.log("Processing chat request with", messages.length, "messages for user:", user.id);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
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
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      }
    );
  }
});
