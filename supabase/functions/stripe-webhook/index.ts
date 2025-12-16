import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const TIER_CREDITS = {
  basic: 50,
  pro: -1,
  business: -1
};

serve(async (req) => {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error("Missing Stripe configuration");
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("No signature provided");
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    console.log(`Received event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        
        if (!userId) {
          console.error("No user_id in session metadata");
          break;
        }

        if (session.mode === "subscription") {
          const tier = session.metadata?.tier;
          const stripeSubscriptionId = session.subscription as string;

          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

          // Create subscription record
          await supabase.from("subscriptions").insert({
            user_id: userId,
            stripe_subscription_id: stripeSubscriptionId,
            tier,
            status: "active",
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });

          // Update profile with tier and credits
          const credits = TIER_CREDITS[tier as keyof typeof TIER_CREDITS] || 0;
          await supabase.from("profiles").update({
            subscription_tier: tier,
            subscription_status: "active",
            credits: credits === -1 ? 999999 : credits // Large number for "unlimited"
          }).eq("user_id", userId);

          // Record payment
          await supabase.from("payments").insert({
            user_id: userId,
            amount: (session.amount_total || 0) / 100,
            currency: "USD",
            payment_method: "stripe",
            payment_type: "subscription",
            stripe_payment_intent_id: session.payment_intent as string,
            status: "succeeded",
            completed_at: new Date().toISOString()
          });

          console.log(`Subscription created for user ${userId}, tier: ${tier}`);
        } else if (session.mode === "payment") {
          // Credit pack purchase
          const credits = parseInt(session.metadata?.credits || "0");
          
          if (credits > 0) {
            // Add credits using the database function
            await supabase.rpc("add_credits", {
              p_user_id: userId,
              p_amount: credits,
              p_type: "purchase",
              p_description: `Purchased ${credits} credits`
            });

            // Record payment
            await supabase.from("payments").insert({
              user_id: userId,
              amount: (session.amount_total || 0) / 100,
              currency: "USD",
              payment_method: "stripe",
              payment_type: "credit_pack",
              stripe_payment_intent_id: session.payment_intent as string,
              status: "succeeded",
              credits_added: credits,
              completed_at: new Date().toISOString()
            });

            console.log(`Credits purchased for user ${userId}: ${credits}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          const status = subscription.status === "active" ? "active" : 
                        subscription.status === "past_due" ? "past_due" : 
                        subscription.cancel_at_period_end ? "cancelled" : "active";

          await supabase.from("subscriptions")
            .update({
              status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscription.id);

          await supabase.from("profiles").update({
            subscription_status: status
          }).eq("user_id", profile.user_id);

          console.log(`Subscription updated for user ${profile.user_id}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await supabase.from("subscriptions")
            .update({
              status: "cancelled",
              cancelled_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscription.id);

          await supabase.from("profiles").update({
            subscription_tier: "free",
            subscription_status: "inactive",
            credits: 3 // Reset to free tier credits
          }).eq("user_id", profile.user_id);

          console.log(`Subscription cancelled for user ${profile.user_id}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await supabase.from("profiles").update({
            subscription_status: "past_due"
          }).eq("user_id", profile.user_id);

          console.log(`Payment failed for user ${profile.user_id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }
});
