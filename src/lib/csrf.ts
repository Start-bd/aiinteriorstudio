/**
 * CSRF Token Utility
 * 
 * Generates and validates session-bound CSRF tokens to protect against
 * Cross-Site Request Forgery attacks on edge function endpoints.
 */

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TIMESTAMP_KEY = 'csrf_timestamp';
const TOKEN_VALIDITY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a cryptographically secure random token
 */
function generateRandomToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create a CSRF token for the current session
 * Token is regenerated if expired or doesn't exist
 */
export function getCsrfToken(): string {
  const existingToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  const timestamp = sessionStorage.getItem(CSRF_TIMESTAMP_KEY);
  
  // Check if token exists and is still valid
  if (existingToken && timestamp) {
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (tokenAge < TOKEN_VALIDITY_MS) {
      return existingToken;
    }
  }
  
  // Generate new token
  const newToken = generateRandomToken();
  sessionStorage.setItem(CSRF_TOKEN_KEY, newToken);
  sessionStorage.setItem(CSRF_TIMESTAMP_KEY, Date.now().toString());
  
  return newToken;
}

/**
 * Refresh the CSRF token (call after sensitive operations or periodically)
 */
export function refreshCsrfToken(): string {
  const newToken = generateRandomToken();
  sessionStorage.setItem(CSRF_TOKEN_KEY, newToken);
  sessionStorage.setItem(CSRF_TIMESTAMP_KEY, Date.now().toString());
  return newToken;
}

/**
 * Clear the CSRF token (call on logout)
 */
export function clearCsrfToken(): void {
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
  sessionStorage.removeItem(CSRF_TIMESTAMP_KEY);
}

/**
 * Get headers including the CSRF token for edge function calls
 */
export function getCsrfHeaders(): Record<string, string> {
  return {
    'X-CSRF-Token': getCsrfToken(),
  };
}
