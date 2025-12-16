import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Pricing configuration
const TIER_PRICES = {
  basic: { monthly: 900, yearly: 8640 }, // in cents
  pro: { monthly: 1900, yearly: 18240 },
  business: { monthly: 4900, yearly: 47040 }
};

const TIER_CREDITS = {
  basic: 50,
  pro: -1, // unlimited
  business: -1 // unlimited
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { mode, tier, billingPeriod, packId, credits, amount } = body;

    // Get or create Stripe customer
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;

      await supabaseClient
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
    }

    const origin = req.headers.get("origin") || "https://aiinteriorstudio.lovable.app";

    // Handle customer portal
    if (mode === "portal") {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/dashboard`,
      });
      return new Response(
        JSON.stringify({ url: portalSession.url }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle subscription checkout
    if (mode === "subscription" && tier) {
      const prices = TIER_PRICES[tier as keyof typeof TIER_PRICES];
      if (!prices) {
        return new Response(
          JSON.stringify({ error: "Invalid tier" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const priceAmount = billingPeriod === "yearly" ? prices.yearly : prices.monthly;
      const interval = billingPeriod === "yearly" ? "year" : "month";

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Interior of AI - ${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`,
                description: `${TIER_CREDITS[tier as keyof typeof TIER_CREDITS] === -1 ? "Unlimited" : TIER_CREDITS[tier as keyof typeof TIER_CREDITS]} generations per month`
              },
              unit_amount: priceAmount,
              recurring: { interval }
            },
            quantity: 1,
          }
        ],
        success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${origin}/pricing?cancelled=true`,
        metadata: {
          user_id: user.id,
          tier,
          billing_period: billingPeriod
        }
      });

      return new Response(
        JSON.stringify({ url: session.url, sessionId: session.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle credit pack purchase
    if (mode === "payment" && packId && credits && amount) {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Interior AI Credits - ${credits} Pack`,
                description: `${credits} generation credits`
              },
              unit_amount: amount * 100 // convert to cents
            },
            quantity: 1,
          }
        ],
        success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${origin}/pricing?cancelled=true`,
        metadata: {
          user_id: user.id,
          pack_id: packId,
          credits: credits.toString()
        }
      });

      return new Response(
        JSON.stringify({ url: session.url, sessionId: session.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
