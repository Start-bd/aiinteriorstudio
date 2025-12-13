import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Detect style from prompt
    const detectedStyle = detectStyle(prompt);
    console.log("Detected style:", detectedStyle);

    // Enhance the prompt for better interior design results
    const enhancedPrompt = `Professional interior design photography: ${prompt}. Ultra high resolution, photorealistic, architectural visualization, beautiful natural lighting, magazine quality interior photography, 8k detailed render.`;

    console.log("Generating image with prompt:", enhancedPrompt);

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
      console.error("No image in response:", JSON.stringify(data));
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
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
