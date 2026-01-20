import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { csrfMiddleware } from "../_shared/csrf.ts";

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
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
    'Access-Control-Allow-Credentials': 'true',
  };
}

interface AdjustCreditsRequest {
  target_user_id: string;
  operation: "add" | "subtract" | "set";
  amount: number;
  reason?: string;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create client with user's JWT for auth verification
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create service role client for admin operations
    const serviceClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Verify user is an admin using the is_admin function
    const { data: isAdmin, error: roleError } = await serviceClient.rpc("is_admin", {
      _user_id: user.id,
    });

    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // CSRF validation for state-changing requests
    const csrfError = csrfMiddleware(req, user.id, corsHeaders);
    if (csrfError) {
      return csrfError;
    }

    // Parse request body
    const { target_user_id, operation, amount, reason }: AdjustCreditsRequest = await req.json();

    // Validate input
    if (!target_user_id || !operation || amount === undefined || amount < 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["add", "subtract", "set"].includes(operation)) {
      return new Response(
        JSON.stringify({ error: "Invalid operation: must be 'add', 'subtract', or 'set'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get current credits for the target user
    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("credits, display_name")
      .eq("user_id", target_user_id)
      .single();

    if (profileError || !profile) {
      console.error("Profile lookup failed for user:", target_user_id);
      return new Response(
        JSON.stringify({ error: "Unable to complete this operation" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentCredits = profile.credits ?? 0;
    let creditChange: number;
    let newBalance: number;

    // Calculate the credit change based on operation
    switch (operation) {
      case "add":
        creditChange = amount;
        newBalance = currentCredits + amount;
        break;
      case "subtract":
        creditChange = -Math.min(amount, currentCredits); // Don't go below 0
        newBalance = Math.max(0, currentCredits - amount);
        break;
      case "set":
        creditChange = amount - currentCredits;
        newBalance = amount;
        break;
      default:
        creditChange = 0;
        newBalance = currentCredits;
    }

    // Build description for the transaction
    const operationText = operation === "add" ? "Added" : operation === "subtract" ? "Removed" : "Set to";
    const description = reason 
      ? `Admin adjustment: ${operationText} ${Math.abs(creditChange)} credits. Reason: ${reason}`
      : `Admin adjustment: ${operationText} ${Math.abs(creditChange)} credits`;

    // Use the add_credits function via service role (it records the transaction)
    if (creditChange !== 0) {
      const { data: finalBalance, error: creditsError } = await serviceClient.rpc("add_credits", {
        p_user_id: target_user_id,
        p_amount: creditChange,
        p_type: "admin_adjustment",
        p_description: description,
      });

      if (creditsError) {
        console.error("Error adjusting credits:", creditsError);
        return new Response(
          JSON.stringify({ error: "Failed to adjust credits" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      newBalance = finalBalance;
    }

    // Log the admin activity
    await serviceClient.from("admin_activity_logs").insert({
      admin_user_id: user.id,
      target_user_id: target_user_id,
      action_type: "credit_adjustment",
      details: {
        user_name: profile.display_name,
        operation,
        amount,
        from_credits: currentCredits,
        to_credits: newBalance,
        reason: reason || null,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        previous_credits: currentCredits,
        new_credits: newBalance,
        change: creditChange,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in admin-adjust-credits:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
