import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const { userId, promptPreview, matchedPatterns, source, timestamp }: SecurityAlertRequest = await req.json();

    const sourceLabel = source === "image_generation" ? "Image Generation" : "Chat";
    const patternLabels = matchedPatterns.map(getPatternLabel).join(", ");
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
      <div class="value" style="font-family: monospace;">${userId}</div>
      
      <div class="label">Detected At</div>
      <div class="value">${formattedTime}</div>
      
      <div class="label">Matched Patterns</div>
      <div class="patterns" style="margin-bottom: 12px;">
        ${matchedPatterns.map(p => `<span class="pattern-tag">${getPatternLabel(p)}</span>`).join("")}
      </div>
      
      <div class="label">Prompt Preview</div>
      <div class="prompt-preview">${promptPreview}</div>
      
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

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
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
