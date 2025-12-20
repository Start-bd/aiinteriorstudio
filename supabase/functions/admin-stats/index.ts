import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Admin stats request received');
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // First, verify the user's JWT and get user info
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('User authenticated:', user.id);
    
    // Use service role client to check admin status (bypasses RLS)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if user is admin using the is_admin function
    const { data: isAdminResult, error: isAdminError } = await adminClient.rpc('is_admin', {
      _user_id: user.id
    });
    
    if (isAdminError) {
      console.error('Error checking admin status:', isAdminError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify admin status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!isAdminResult) {
      console.error('User is not an admin:', user.id);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Admin verification passed, fetching stats');
    
    // Fetch aggregate statistics using service role (bypasses RLS)
    const [profilesRes, imagesRes, paymentsRes, subsRes] = await Promise.all([
      adminClient.from('profiles').select('id', { count: 'exact', head: true }),
      adminClient.from('generated_images').select('id', { count: 'exact', head: true }),
      adminClient.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      adminClient.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ]);
    
    // Check for any errors
    if (profilesRes.error) console.error('Profiles count error:', profilesRes.error);
    if (imagesRes.error) console.error('Images count error:', imagesRes.error);
    if (paymentsRes.error) console.error('Payments count error:', paymentsRes.error);
    if (subsRes.error) console.error('Subscriptions count error:', subsRes.error);
    
    const stats = {
      totalUsers: profilesRes.count || 0,
      totalGenerations: imagesRes.count || 0,
      totalPayments: paymentsRes.count || 0,
      activeSubscriptions: subsRes.count || 0,
    };
    
    console.log('Stats fetched successfully:', stats);
    
    return new Response(
      JSON.stringify(stats),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error in admin-stats:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
