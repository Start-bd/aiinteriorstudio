import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

interface SuspiciousPrompt {
  id: string;
  user_id: string;
  prompt_text: string;
  matched_patterns: string[];
  source: string;
  created_at: string;
  reviewed: boolean;
  ip_address: string | null;
}

interface UserProfile {
  user_id: string;
  display_name: string | null;
  status: string | null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getPatternLabel(pattern: string): string {
  const labels: Record<string, string> = {
    'system_override': 'System Override Attempt',
    'role_injection': 'Role Injection',
    'prompt_leak': 'Prompt Leak Attempt',
    'jailbreak': 'Jailbreak Attempt',
    'ignore_instruction': 'Ignore Instructions',
    'code_injection': 'Code Injection',
    'excessive_special_chars': 'Excessive Special Characters',
  };
  return labels[pattern] || pattern;
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authentication check: only service role or scheduled invocations
  const authHeader = req.headers.get("Authorization");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    if (token !== supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!resendApiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get suspicious prompts from the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: suspiciousPrompts, error: promptsError } = await supabase
      .from("suspicious_prompt_logs")
      .select("*")
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: false });

    if (promptsError) {
      console.error("Error fetching suspicious prompts:", promptsError);
      throw promptsError;
    }

    // If no suspicious activity, send a brief all-clear email
    if (!suspiciousPrompts || suspiciousPrompts.length === 0) {
      const { error: emailError } = await resend.emails.send({
        from: "AI Interior Studio Security <security@interiorofai.com>",
        to: ["security@interiorofai.com"],
        subject: "✅ Daily Security Digest - All Clear",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #22c55e;">Daily Security Digest</h1>
            <p style="color: #666;">No suspicious activity detected in the last 24 hours.</p>
            <p style="color: #999; font-size: 12px;">Report generated: ${new Date().toISOString()}</p>
          </div>
        `,
      });

      if (emailError) {
        console.error("Error sending all-clear email:", emailError);
        throw emailError;
      }

      return new Response(
        JSON.stringify({ success: true, message: "All-clear digest sent", count: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get unique user IDs
    const userIds = [...new Set(suspiciousPrompts.map(p => p.user_id))];

    // Fetch user profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, status")
      .in("user_id", userIds);

    const profileMap = new Map<string, UserProfile>();
    profiles?.forEach(p => profileMap.set(p.user_id, p));

    // Aggregate statistics
    const patternCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};
    const unreviewedCount = suspiciousPrompts.filter(p => !p.reviewed).length;

    suspiciousPrompts.forEach(prompt => {
      // Count patterns
      prompt.matched_patterns.forEach((pattern: string) => {
        patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
      });
      // Count sources
      sourceCounts[prompt.source] = (sourceCounts[prompt.source] || 0) + 1;
      // Count per user
      userCounts[prompt.user_id] = (userCounts[prompt.user_id] || 0) + 1;
    });

    // Find top offenders (users with most suspicious prompts)
    const topOffenders = Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    // Build email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🛡️ Daily Security Digest</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Suspicious Activity Report - Last 24 Hours</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Summary Stats -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #dc2626;">${suspiciousPrompts.length}</div>
              <div style="color: #991b1b; font-size: 14px;">Total Incidents</div>
            </div>
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #d97706;">${unreviewedCount}</div>
              <div style="color: #92400e; font-size: 14px;">Pending Review</div>
            </div>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; font-weight: bold; color: #16a34a;">${userIds.length}</div>
              <div style="color: #166534; font-size: 14px;">Unique Users</div>
            </div>
          </div>

          <!-- Pattern Breakdown -->
          <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Attack Pattern Breakdown</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left; color: #475569;">Pattern Type</th>
                <th style="padding: 12px; text-align: right; color: #475569;">Count</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(patternCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([pattern, count]) => `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px; color: #334155;">${escapeHtml(getPatternLabel(pattern))}</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: #dc2626;">${count}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>

          <!-- Source Breakdown -->
          <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">By Source</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left; color: #475569;">Source</th>
                <th style="padding: 12px; text-align: right; color: #475569;">Count</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(sourceCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px; color: #334155;">${escapeHtml(source)}</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: #0284c7;">${count}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>

          <!-- Top Offenders -->
          <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Top Offenders</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left; color: #475569;">User</th>
                <th style="padding: 12px; text-align: left; color: #475569;">Status</th>
                <th style="padding: 12px; text-align: right; color: #475569;">Incidents</th>
              </tr>
            </thead>
            <tbody>
              ${topOffenders.map(([userId, count]) => {
                const profile = profileMap.get(userId);
                const displayName = profile?.display_name || 'Unknown User';
                const status = profile?.status || 'active';
                const statusColor = status === 'banned' ? '#dc2626' : status === 'suspended' ? '#d97706' : status === 'warned' ? '#eab308' : '#22c55e';
                return `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 12px;">
                      <div style="color: #334155; font-weight: 500;">${escapeHtml(displayName)}</div>
                      <div style="color: #94a3b8; font-size: 12px;">${escapeHtml(userId.substring(0, 8))}...</div>
                    </td>
                    <td style="padding: 12px;">
                      <span style="background: ${statusColor}20; color: ${statusColor}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
                        ${escapeHtml(status.toUpperCase())}
                      </span>
                    </td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: #dc2626;">${count}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <!-- Recent Incidents Preview -->
          <h2 style="color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Recent Incidents (Last 5)</h2>
          ${suspiciousPrompts.slice(0, 5).map(prompt => {
            const profile = profileMap.get(prompt.user_id);
            const displayName = profile?.display_name || 'Unknown';
            return `
              <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 10px; border-radius: 0 8px 8px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <strong style="color: #991b1b;">${escapeHtml(displayName)}</strong>
                  <span style="color: #94a3b8; font-size: 12px;">${new Date(prompt.created_at).toLocaleString()}</span>
                </div>
                <div style="color: #7f1d1d; font-size: 14px; margin-bottom: 8px;">
                  ${prompt.matched_patterns.map((p: string) => `<span style="background: #fee2e2; padding: 2px 6px; border-radius: 4px; margin-right: 4px; font-size: 11px;">${escapeHtml(getPatternLabel(p))}</span>`).join('')}
                </div>
                <div style="color: #374151; font-size: 13px; background: white; padding: 10px; border-radius: 4px; word-break: break-word;">
                  "${escapeHtml(prompt.prompt_text.substring(0, 200))}${prompt.prompt_text.length > 200 ? '...' : ''}"
                </div>
              </div>
            `;
          }).join('')}

          <!-- Action CTA -->
          <div style="background: #1e293b; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
            <p style="margin: 0 0 15px 0;">Review and take action on these incidents in the admin dashboard.</p>
            <a href="https://aiinteriorstudio.lovable.app/admin?tab=security" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              Open Security Dashboard →
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">
            Report generated: ${new Date().toISOString()}<br>
            This is an automated security digest from AI Interior Studio.
          </p>
        </div>
      </div>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "AI Interior Studio Security <security@interiorofai.com>",
      to: ["security@interiorofai.com"],
      subject: `🛡️ Daily Security Digest - ${suspiciousPrompts.length} Incident${suspiciousPrompts.length !== 1 ? 's' : ''} Detected`,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Error sending digest email:", emailError);
      throw emailError;
    }

    console.log(`Daily security digest sent: ${suspiciousPrompts.length} incidents`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Daily security digest sent",
        stats: {
          totalIncidents: suspiciousPrompts.length,
          unreviewedCount,
          uniqueUsers: userIds.length,
          patternCounts,
          sourceCounts
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in daily-security-digest:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate security digest" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
