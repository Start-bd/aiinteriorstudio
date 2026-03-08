// Shared CORS configuration for all edge functions
const allowedOrigins = [
  'https://interiorofai.com',
  'https://www.interiorofai.com',
  'https://aiinteriorstudio.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080',
];

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.some(
    (allowed) => origin === allowed || origin.endsWith('.lovable.app')
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Credentials': 'true',
  };
}
