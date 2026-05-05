import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

// Rate limiting configuration
const EMAIL_RATE_LIMIT_WINDOW_MINUTES = 15; // 15 minute window
const MAX_EMAILS_PER_WINDOW = 5; // Max 5 emails per window
const ATTACK_THRESHOLD = 10; // If more than 10 suspicious prompts in window, send summary instead

interface SecurityAlertRequest {
  userId: string;
  promptPreview: string;
  matchedPatterns: string[];
  source: "image_generation" | "chat";
  timestamp: string;
}

function getPatternLabel(pattern: string): string {
  if (pattern.includes("ignore")) return "Ignore Instructions";
  if (pattern.includes("forget")) return "Forget Training";
  if (pattern.includes("disregard")) return "Disregard Rules";
  if (pattern.includes("you\\s+are\\s+now")) return "Role Override";
  if (pattern.includes("persona|role")) return "Persona Change";
  if (pattern.includes("system:|assistant:")) return "Role Marker Injection";
  if (pattern.includes("override")) return "Override Attempt";
  if (pattern.includes("jailbreak|bypass")) return "Jailbreak Attempt";
  if (pattern.includes("pretend")) return "Pretend Prompt";
  if (pattern.includes("do\\s+not\\s+follow")) return "Rule Bypass";
  if (pattern === "excessive_special_chars") return "Encoding Attack";
  return pattern.substring(0, 30);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate: only server-to-server callers with the service role key may invoke this.
  const authHeader = req.headers.get("Authorization");
  const serviceKeyForAuth = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!authHeader || !serviceKeyForAuth || authHeader.replace("Bearer ", "") !== serviceKeyForAuth) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase configuration missing");
      return new Response(
        JSON.stringify({ error: "Database service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { userId, promptPreview, matchedPatterns, source, timestamp }: SecurityAlertRequest = await req.json();

    // Check rate limit - count recent suspicious prompts
    const windowStart = new Date(Date.now() - EMAIL_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    
    const { count: recentCount, error: countError } = await supabaseAdmin
      .from('suspicious_prompt_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', windowStart);

    if (countError) {
      console.error("Error checking rate limit:", countError.message);
    }

    const suspiciousCount = recentCount || 0;
    console.log(`Rate limit check: ${suspiciousCount} suspicious prompts in last ${EMAIL_RATE_LIMIT_WINDOW_MINUTES} minutes`);

    // If we're under attack (high volume), send a summary email instead of individual ones
    if (suspiciousCount >= ATTACK_THRESHOLD) {
      // Only send summary email once when crossing threshold
      if (suspiciousCount === ATTACK_THRESHOLD) {
        const resend = new Resend(RESEND_API_KEY);
        
        const summaryHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #fef2f2; padding: 20px; border: 1px solid #fecaca; border-top: none; }
    .alert-box { background: #fff; border: 2px solid #dc2626; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .footer { padding: 16px 20px; background: #f3f4f6; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; }
    .cta { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 HIGH ALERT: Coordinated Attack Detected</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <p style="margin: 0; font-size: 18px;"><strong>${suspiciousCount}+ suspicious prompts detected in the last ${EMAIL_RATE_LIMIT_WINDOW_MINUTES} minutes!</strong></p>
        <p style="margin: 8px 0 0 0;">This may indicate a coordinated prompt injection attack. Individual email alerts have been paused to prevent inbox flooding.</p>
      </div>
      
      <p><strong>Recommended actions:</strong></p>
      <ul>
        <li>Review the Security Dashboard immediately</li>
        <li>Check for patterns in user IDs or IP addresses</li>
        <li>Consider temporarily increasing rate limits</li>
        <li>Monitor for unusual API usage patterns</li>
      </ul>
      
      <a href="https://aiinteriorstudio.lovable.app/admin/security" class="cta">Review Security Dashboard NOW →</a>
    </div>
    <div class="footer">
      <p>This is a high-priority automated security alert. Email notifications will resume when attack volume subsides.</p>
    </div>
  </div>
</body>
</html>
        `;

        await resend.emails.send({
          from: "AI Interior Studio <security@interiorofai.com>",
          to: ["support@interiorofai.com"],
          subject: "🚨 HIGH ALERT: Coordinated Attack Detected - Multiple Suspicious Prompts",
          html: summaryHtml,
        });

        console.log("High volume attack alert email sent");
      } else {
        console.log(`Skipping individual email - attack mode active (${suspiciousCount} suspicious prompts)`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        rateLimited: true, 
        message: "Attack mode active - individual emails suppressed",
        suspiciousCount 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if we've sent too many emails recently (simple rate limit)
    if (suspiciousCount > MAX_EMAILS_PER_WINDOW) {
      console.log(`Rate limited: ${suspiciousCount} emails would exceed limit of ${MAX_EMAILS_PER_WINDOW}`);
      return new Response(JSON.stringify({ 
        success: true, 
        rateLimited: true, 
        message: "Email rate limit reached",
        suspiciousCount 
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send individual alert email
    const resend = new Resend(RESEND_API_KEY);
    const sourceLabel = source === "image_generation" ? "Image Generation" : "Chat";
    const formattedTime = new Date(timestamp).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
    .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 14px; color: #111827; margin-bottom: 12px; }
    .patterns { display: flex; flex-wrap: wrap; gap: 8px; }
    .pattern-tag { background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .prompt-preview { background: #fff; border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px; font-family: monospace; font-size: 13px; white-space: pre-wrap; word-break: break-word; }
    .footer { padding: 16px 20px; background: #f3f4f6; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; }
    .cta { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 16px; }
    .rate-info { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 4px; padding: 8px 12px; font-size: 12px; color: #92400e; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Security Alert: Suspicious Prompt Detected</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <p style="margin: 0;"><strong>A potential prompt injection attack has been detected and logged.</strong></p>
      </div>
      
      <div class="label">Source</div>
      <div class="value">${sourceLabel}</div>
      
      <div class="label">User ID</div>
      <div class="value" style="font-family: monospace;">${escapeHtml(userId)}</div>
      
      <div class="label">Detected At</div>
      <div class="value">${formattedTime}</div>
      
      <div class="label">Matched Patterns</div>
      <div class="patterns" style="margin-bottom: 12px;">
        ${matchedPatterns.map(p => `<span class="pattern-tag">${escapeHtml(getPatternLabel(p))}</span>`).join("")}
      </div>
      
      <div class="label">Prompt Preview</div>
      <div class="prompt-preview">${escapeHtml(promptPreview)}</div>
      
      <div class="rate-info">
        📊 Alert ${suspiciousCount + 1} of ${MAX_EMAILS_PER_WINDOW} max in ${EMAIL_RATE_LIMIT_WINDOW_MINUTES}-min window
      </div>
      
      <a href="https://aiinteriorstudio.lovable.app/admin/security" class="cta">Review in Security Dashboard →</a>
    </div>
    <div class="footer">
      <p>This is an automated security alert from AI Interior Studio. The prompt has been sanitized and processed, but logged for your review.</p>
      <p>You're receiving this because you're an admin of the platform.</p>
    </div>
  </div>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "AI Interior Studio <security@interiorofai.com>",
      to: ["support@interiorofai.com"],
      subject: `🚨 Security Alert: Suspicious ${sourceLabel} Prompt Detected`,
      html: emailHtml,
    });

    console.log("Security alert email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse, suspiciousCount: suspiciousCount + 1 }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending security alert email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
