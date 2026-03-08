

# Pre-Deployment Audit Report

## Executive Summary

- **Engineering Health Score:** 78/100
- **Production Readiness:** Needs Work
- **One-Paragraph Assessment:** The project demonstrates mature security architecture (RLS, CSRF, prompt injection detection, safe views), well-structured payment processing with server-side price validation, and sensible code organization. However, critical gaps remain: edge functions have no fetch timeouts, database functions lack statement_timeout, several `select("*")` queries on admin pages risk data leaks, and the `security-alert-email` function has overly permissive CORS. Performance is strong on the client side (mobile particle optimization, lazy loading) but edge functions are vulnerable to hanging indefinitely on external API failures.

---

## Top 10 Critical Risks (Ranked by Impact)

1. **No fetch timeouts in edge functions** - Severity: Critical - All edge functions - External API calls (AI gateway, Stripe, Resend) can hang forever, consuming resources
2. **`security-alert-email` has `Access-Control-Allow-Origin: *`** - Severity: High - `supabase/functions/security-alert-email/index.ts:6` - Wildcard CORS on a security-critical function
3. **`daily-security-digest` has `Access-Control-Allow-Origin: *`** - Severity: High - `supabase/functions/daily-security-digest/index.ts:6` - Wildcard CORS plus no authentication check
4. **No `statement_timeout` on database functions** - Severity: High - All DB functions - Runaway queries could lock resources
5. **Dashboard `fetchUserStats` fetches ALL images** - Severity: Medium - `src/pages/Dashboard.tsx:170-173` - Unbounded query grows with user data
6. **`AdminUserDetail` uses `select("*")` on subscriptions table** - Severity: Medium - `src/pages/AdminUserDetail.tsx:218` - Exposes `stripe_subscription_id` to admin client
7. **`send-contact-email` has no rate limiting** - Severity: Medium - `supabase/functions/send-contact-email/index.ts` - Can be abused to send unlimited emails
8. **`EcosystemSection` images missing width/height and lazy loading** - Severity: Low - `src/components/EcosystemSection.tsx:64-68` - CLS impact
9. **`SocialProofSection` images missing width/height and lazy loading** - Severity: Low - `src/components/SocialProofSection.tsx:49-53` - CLS impact
10. **Footer "Careers" and "Press Kit" link to `#`** - Severity: Low - `src/components/Footer.tsx:23-24` - Dead links

---

## Detailed Findings by Section

### Section 1: Repository Structure & Architecture

**Total Issues Found:** 3 | Critical: 0 | High: 0 | Medium: 2 | Low: 1

**Issue 1.1: Dashboard.tsx is 863 lines**
- Severity: Medium
- Location: `src/pages/Dashboard.tsx`
- Impact: Hard to maintain; stats, image grid, filters, collections, pagination all in one file
- Fix: Extract into `DashboardStats`, `ImageGrid`, `DashboardFilters` sub-components

**Issue 1.2: Duplicated CORS + rate-limit code across edge functions**
- Severity: Medium
- Location: All 8 edge functions define identical `allowedOrigins` + `getCorsHeaders`
- Impact: If origins change, must update 8 files. Rate limiting code is copy-pasted across 2 functions.
- Fix: Move to `_shared/cors.ts` and `_shared/rate-limit.ts`

**Issue 1.3: Admin.tsx is 765 lines**
- Severity: Low
- Location: `src/pages/Admin.tsx`
- Fix: Extract stats, user table, activity log into sub-components

---

### Section 2: Performance Optimization

**Total Issues Found:** 4 | Critical: 0 | High: 1 | Medium: 2 | Low: 1

**Issue 2.1: Dashboard `fetchUserStats` fetches ALL user images without limit**
- Severity: High
- Location: `src/pages/Dashboard.tsx:170-173`
- Evidence:
  ```typescript
  const { data: allImages, error } = await supabase
    .from("generated_images")
    .select("created_at, style")
    .eq("user_id", user.id);
  ```
- Impact: A power user with 5000+ images will download all rows just for aggregation stats
- Fix: Use a server-side aggregate (database function or edge function) or add `.limit(1000)` minimum. Better: create a `get_user_stats` RPC.

**Issue 2.2: Images missing width/height causing CLS**
- Severity: Medium
- Location: `src/components/EcosystemSection.tsx:64-68`, `src/components/SocialProofSection.tsx:49-53`
- Impact: Layout shift during image loading affects Core Web Vitals CLS score
- Fix: Add explicit `width` and `height` attributes plus `loading="lazy"` to below-fold images

**Issue 2.3: No code splitting**
- Severity: Medium
- Location: `src/App.tsx` - All routes imported eagerly
- Impact: Initial bundle includes all 19 pages. Admin, Dashboard, Blog pages load even for first-time visitors.
- Fix: Use `React.lazy()` + `Suspense` for non-critical routes (Admin, Dashboard, Blog, Profile, etc.)

**Issue 2.4: ChatBot image missing dimensions**
- Severity: Low
- Location: `src/components/ChatBot.tsx:439-443`
- Fix: Add width/height or aspect-ratio container

---

### Section 3: Security Hardening

**Total Issues Found:** 7 | Critical: 1 | High: 2 | Medium: 3 | Low: 1

**Issue 3.1: No fetch timeouts (AbortController) on ANY external API call in edge functions**
- Severity: Critical
- Location: All edge functions making `fetch()` calls
- Evidence (generate-interior-image/index.ts:411):
  ```typescript
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    // No signal, no timeout
  });
  ```
- Impact: If AI gateway, Stripe API, or Resend API hangs, the edge function runs forever (up to Deno's global timeout), consuming resources and leaving the user in a loading state indefinitely. Under attack, this becomes a resource exhaustion vector.
- Fix: Add AbortController with 30s timeout to every external fetch:
  ```typescript
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  const response = await fetch(url, { ...opts, signal: controller.signal });
  clearTimeout(timeoutId);
  ```

**Issue 3.2: `security-alert-email` uses wildcard CORS**
- Severity: High
- Location: `supabase/functions/security-alert-email/index.ts:5-8`
- Evidence:
  ```typescript
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    // ...
  };
  ```
- Impact: Any origin can invoke this function. While it requires service role key auth, the wildcard CORS is inconsistent with the hardened pattern used in all other functions.
- Fix: Use the same `getCorsHeaders(req)` dynamic origin pattern used in other edge functions

**Issue 3.3: `daily-security-digest` has wildcard CORS and no auth check**
- Severity: High
- Location: `supabase/functions/daily-security-digest/index.ts:6-8`
- Impact: No authentication verification. Anyone who can reach the endpoint can trigger digest generation and read security stats from the response. Uses service role key for DB access.
- Fix: Add JWT verification or service-role-only auth check, and use dynamic CORS

**Issue 3.4: `AdminUserDetail` selects `*` from subscriptions (leaks Stripe IDs)**
- Severity: Medium
- Location: `src/pages/AdminUserDetail.tsx:216-220`
- Evidence:
  ```typescript
  supabase.from("subscriptions").select("*").eq("user_id", profile.id)
  ```
- Impact: Exposes `stripe_subscription_id` and `stripe_price_id` to admin client. While admin RLS allows this, minimizing Stripe ID exposure is the established pattern.
- Fix: Select only needed columns: `id, tier, status, current_period_start, current_period_end, cancel_at_period_end`

**Issue 3.5: `send-contact-email` has no rate limiting**
- Severity: Medium
- Location: `supabase/functions/send-contact-email/index.ts`
- Impact: No auth required, no rate limiting. Can be abused to send unlimited Resend API calls, potentially burning email quota.
- Fix: Add IP-based or session-based rate limiting (e.g., 3 submissions per hour)

**Issue 3.6: No `statement_timeout` on database functions**
- Severity: Medium
- Location: All 8 DB functions (`add_credits`, `deduct_credits`, `purge_old_suspicious_logs`, etc.)
- Impact: A runaway query or lock contention could block the function indefinitely, potentially cascading to table-level locks
- Fix: Add `SET statement_timeout = '5s'` to function definitions via migration

**Issue 3.7: `admin-adjust-credits` has `verify_jwt = false` in config.toml**
- Severity: Low
- Location: `supabase/config.toml:18`
- Impact: JWT verification is handled in the function code itself (lines 52-58), so this is defense-in-depth only. The function does validate auth and admin role. However, `verify_jwt = true` would add an extra layer.
- Fix: Set `verify_jwt = true` in config.toml since the function requires authentication anyway

---

### Section 4: SEO Optimization

**Total Issues Found:** 3 | Critical: 0 | High: 0 | Medium: 1 | Low: 2

**Issue 4.1: Blog posts missing canonical URL**
- Severity: Medium
- Location: `src/pages/BlogPost.tsx:34-55`
- Impact: No `<link rel="canonical">` tag. Google may index multiple URLs for the same content.
- Fix: Add `<link rel="canonical" href={shareUrl} />` to the Helmet block

**Issue 4.2: Dashboard/Profile pages indexed**
- Severity: Low
- Location: `src/pages/Dashboard.tsx`, `src/pages/Profile.tsx`
- Impact: robots.txt blocks `/dashboard` and `/profile` from crawlers, but no `<meta name="robots" content="noindex">` in page Helmet. If these pages get linked externally, they could still get indexed.
- Fix: Add `<meta name="robots" content="noindex, nofollow" />` to Dashboard and Profile Helmet

**Issue 4.3: Footer contains dead links**
- Severity: Low
- Location: `src/components/Footer.tsx:23-24`
- Evidence: `{ label: "Careers", href: "#" }` and `{ label: "Press Kit", href: "#" }`
- Impact: Dead links are a minor negative SEO signal
- Fix: Either create placeholder pages or remove these links

---

### Section 5: Code Quality & Maintainability

**Total Issues Found:** 3 | Critical: 0 | High: 0 | Medium: 2 | Low: 1

**Issue 5.1: `useEffect` missing dependency in Dashboard.tsx**
- Severity: Medium
- Location: `src/pages/Dashboard.tsx:99-103`
- Evidence:
  ```typescript
  useEffect(() => {
    if (user) { fetchUserStats(); }
  }, [user]); // fetchUserStats not in deps
  ```
- Impact: Stale closure risk; ESLint would flag this
- Fix: Wrap `fetchUserStats` in `useCallback` and add to dependency array

**Issue 5.2: Duplicated escapeHtml across 3 edge functions**
- Severity: Medium
- Location: `send-contact-email`, `security-alert-email`, `daily-security-digest`
- Fix: Move to `_shared/html-utils.ts`

**Issue 5.3: `daily-security-digest` uses `error: any` type**
- Severity: Low
- Location: `supabase/functions/daily-security-digest/index.ts:311`
- Fix: Use `error: unknown` with proper type narrowing

---

### Section 6: User Experience & Accessibility

**Total Issues Found:** 2 | Critical: 0 | High: 0 | Medium: 1 | Low: 1

**Issue 6.1: Auth form inputs missing autocomplete attributes**
- Severity: Medium
- Location: `src/pages/Auth.tsx:232-237, 248-253`
- Impact: Password managers may not auto-fill correctly
- Fix: Add `autoComplete="email"`, `autoComplete="current-password"` / `autoComplete="new-password"`

**Issue 6.2: Footer dead "Careers" / "Press Kit" links**
- Severity: Low
- (Same as 4.3)

---

### Section 7: Business Logic & Functionality

**Total Issues Found:** 1 | Critical: 0 | High: 0 | Medium: 1 | Low: 0

**Issue 7.1: Stripe webhook `checkout.session.completed` queries `payments` with wrong `status` value**
- Severity: Medium
- Location: `supabase/functions/stripe-webhook/index.ts:87, 114` vs `supabase/functions/admin-stats/index.ts:97`
- Evidence: Webhook inserts payments with `status: "succeeded"` but admin-stats counts payments with `.eq('status', 'completed')`. These never match.
  ```typescript
  // stripe-webhook inserts:
  status: "succeeded"
  // admin-stats queries:
  .eq('status', 'completed')
  ```
- Impact: Admin dashboard always shows 0 completed payments even when payments exist
- Fix: Align the status values. Either insert as `"completed"` or query for `"succeeded"`

---

## Implementation Plan

### Phase 1: Stop-Ship Fixes (Critical + High)
1. Add AbortController timeouts (30s) to all external fetch calls in edge functions
2. Fix `security-alert-email` and `daily-security-digest` CORS to use dynamic origin pattern
3. Add authentication check to `daily-security-digest`
4. Fix payment status mismatch (`succeeded` vs `completed`)

### Phase 2: Security & Performance (Medium)
5. Add `statement_timeout` to all database functions via migration
6. Add rate limiting to `send-contact-email`
7. Fix `AdminUserDetail` to select specific subscription columns
8. Add code splitting with `React.lazy` for non-critical routes
9. Replace `fetchUserStats` unbounded query with limited/aggregate approach
10. Add `autocomplete` attributes to auth form inputs

### Phase 3: SEO & Quality (Low)
11. Add canonical URL to BlogPost
12. Add `noindex` to Dashboard/Profile
13. Remove or replace dead footer links
14. Add width/height to remaining images
15. Consolidate duplicated code (CORS, escapeHtml) into shared modules

