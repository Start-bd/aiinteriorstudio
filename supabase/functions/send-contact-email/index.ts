import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const allowedOrigins = [
  "https://interiorofai.com",
  "https://www.interiorofai.com",
  "https://aiinteriorstudio.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const isAllowed = allowedOrigins.some(
    (allowed) => origin === allowed || origin.endsWith(".lovable.app")
  );

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const subjectLabels: Record<string, string> = {
  general: "General Inquiry",
  support: "Technical Support",
  billing: "Billing & Payments",
  partnership: "Partnership Opportunities",
  enterprise: "Enterprise Solutions",
  feedback: "Feedback & Suggestions",
};

// HTML encode function to prevent XSS in emails
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest =
      await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 255 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Field length exceeded" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const subjectLabel = subjectLabels[subject] || subject;

    // Sanitize user inputs for HTML email
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const safeSubjectLabel = escapeHtml(subjectLabel);

    // Send notification email to support team
    const supportController = new AbortController();
    const supportTimeoutId = setTimeout(() => supportController.abort(), 15000);
    let supportEmailRes: Response;
    try {
      supportEmailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Interior of AI <noreply@interiorofai.com>",
          to: ["support@interiorofai.com"],
          reply_to: email,
          subject: `[Contact Form] ${safeSubjectLabel} - ${safeName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #b8860b;">New Contact Form Submission</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>From:</strong> ${safeName}</p>
                <p><strong>Email:</strong> ${safeEmail}</p>
                <p><strong>Subject:</strong> ${safeSubjectLabel}</p>
              </div>
              <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="margin-top: 0;">Message:</h3>
                <p style="white-space: pre-wrap;">${safeMessage}</p>
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">
                This email was sent from the Interior of AI contact form.
              </p>
            </div>
          `,
        }),
        signal: supportController.signal,
      });
    } catch (fetchErr) {
      clearTimeout(supportTimeoutId);
      const isTimeout = fetchErr instanceof DOMException && fetchErr.name === 'AbortError';
      console.error("Support email fetch failed:", isTimeout ? "timeout" : fetchErr);
      throw new Error("Failed to send support notification");
    }
    clearTimeout(supportTimeoutId);

    if (!supportEmailRes.ok) {
      const errorData = await supportEmailRes.json();
      console.error("Failed to send support email:", errorData);
      throw new Error("Failed to send support notification");
    }

    console.log("Support notification sent successfully");

    // Send confirmation email to the user
    const confirmationEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Interior of AI <noreply@interiorofai.com>",
        to: [email],
        subject: "We received your message - Interior of AI",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #b8860b;">Thank you for contacting us, ${safeName}!</h2>
            <p>We have received your message and our team will get back to you within 24-48 hours.</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Subject:</strong> ${safeSubjectLabel}</p>
              <p><strong>Your message:</strong></p>
              <p style="white-space: pre-wrap; color: #555;">${safeMessage}</p>
            </div>
            <p>In the meantime, feel free to explore our AI interior design tools at <a href="https://interiorofai.com" style="color: #b8860b;">interiorofai.com</a>.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              AvailableView LLC | 30 N Gould St STE R, Sheridan, WY 82801, USA<br>
              <a href="mailto:support@interiorofai.com" style="color: #b8860b;">support@interiorofai.com</a>
            </p>
          </div>
        `,
      }),
    });

    if (!confirmationEmailRes.ok) {
      console.error("Failed to send confirmation email");
    } else {
      console.log("Confirmation email sent successfully");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
