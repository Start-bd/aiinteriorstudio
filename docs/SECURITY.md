# Security Documentation

This document outlines the security architecture, Row-Level Security (RLS) policies, and access patterns for the AI Interior Studio platform.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Authentication](#authentication)
3. [Role-Based Access Control](#role-based-access-control)
4. [Row-Level Security Policies](#row-level-security-policies)
5. [Edge Function Security](#edge-function-security)
6. [Payment Security](#payment-security)
7. [AI Prompt Security](#ai-prompt-security)
8. [Audit Logging](#audit-logging)

---

## Architecture Overview

The platform uses a security-first methodology with multiple layers of protection:

- **Frontend**: React with client-side validation
- **Backend**: Supabase with RLS policies
- **Edge Functions**: Server-side validation with JWT verification
- **Database Functions**: SECURITY DEFINER with service_role checks

### Key Security Principles

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Users only access what they need
3. **Server-Side Validation**: Never trust client input
4. **Immutable Audit Trail**: All admin actions are logged

---

## Authentication

### Auth Configuration

- Email/password authentication enabled
- Auto-confirm email signups enabled for development
- Anonymous sign-ups **disabled**

### User Profile Creation

New users automatically get a profile via the `handle_new_user` trigger:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, credits, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    3,  -- Initial free credits
    substring(md5(random()::text || NEW.id::text) from 1 for 8)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Role-Based Access Control

### Role Enum

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
```

### User Roles Table

Roles are stored in a separate `user_roles` table (never in profiles to prevent privilege escalation):

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Reference to auth.users |
| role | app_role | The assigned role |
| granted_by | uuid | Who granted the role |
| created_at | timestamp | When role was assigned |

### Security Functions

#### `is_admin(user_id)`
```sql
CREATE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

#### `has_role(user_id, role)`
```sql
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### Role Management Policies

| Operation | Policy |
|-----------|--------|
| SELECT | Users can view own roles; Admins can view all |
| INSERT | Admins can insert for OTHER users only (prevents self-escalation) |
| UPDATE | Disabled (roles must be deleted and recreated) |
| DELETE | Admins only |

**Critical**: Admins cannot grant roles to themselves (`user_id <> auth.uid()`).

---

## Row-Level Security Policies

### Policy Types

- **RESTRICTIVE**: All policies must pass (AND logic)
- **PERMISSIVE**: Any policy can grant access (OR logic)

This project uses RESTRICTIVE policies for user data isolation.

### Table Policies

#### profiles

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Block anonymous | `auth.uid() IS NOT NULL` |
| SELECT | View own profile | `auth.uid() = user_id` |
| SELECT | Admin view all | `is_admin(auth.uid())` |
| INSERT | Own profile only | `auth.uid() = user_id` |
| UPDATE | Own profile | `auth.uid() = user_id` |
| UPDATE | Admin update any | `is_admin(auth.uid())` |
| DELETE | None | Not allowed |

#### payments

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Block anonymous | `auth.uid() IS NOT NULL` |
| SELECT | View own payments | `auth.uid() = user_id` |
| INSERT | Service role only | `auth.role() = 'service_role'` |
| UPDATE | Service role only | `auth.role() = 'service_role'` |
| DELETE | Service role only | `auth.role() = 'service_role'` |

#### subscriptions

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | View own | `auth.uid() = user_id` |
| INSERT/UPDATE/DELETE | Service role only | `auth.role() = 'service_role'` |

#### credit_transactions

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | View own | `auth.uid() = user_id` |
| ALL | Service role | `auth.role() = 'service_role'` |

#### generated_images

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | View own | `auth.uid() = user_id` |
| SELECT | Featured images | `is_featured = true` |
| SELECT | Shared collections | Image is in public collection with share_token |
| INSERT | Authenticated users | `auth.uid() = user_id` |
| UPDATE | Service role only | `auth.role() = 'service_role'` |
| DELETE | Own images | `auth.uid() = user_id` |

#### collections

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Public collections | `is_public = true` |
| SELECT | Shared via token | `share_token IS NOT NULL` |
| SELECT | Own collections | `auth.uid() = user_id` |
| INSERT/UPDATE/DELETE | Own collections | `auth.uid() = user_id` |

#### favorites, generation_likes

| Operation | Policy | Condition |
|-----------|--------|-----------|
| ALL | Own data only | `auth.uid() = user_id` |

#### rate_limits

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Own limits | `auth.uid() = user_id` |
| ALL | Service role | `auth.role() = 'service_role'` |

#### referrals

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Involved parties | `auth.uid() = referrer_id OR auth.uid() = referred_id` |
| INSERT/UPDATE/DELETE | Service role only | `auth.role() = 'service_role'` |

#### admin_activity_logs

| Operation | Policy | Condition |
|-----------|--------|-----------|
| SELECT | Admins and service role | `is_admin(auth.uid())` |
| INSERT | Admins and service role | `is_admin(auth.uid())` |
| UPDATE | **NEVER** | `false` |
| DELETE | **NEVER** | `false` |

### Public Reference Data

These tables are intentionally public (read-only):

- `styles` - Design style options
- `room_types` - Room type options

---

## Edge Function Security

### JWT Verification

All edge functions require JWT verification except webhooks:

```toml
# supabase/config.toml
[functions.generate-interior-image]
verify_jwt = true

[functions.stripe-webhook]
verify_jwt = false  # Verified via Stripe signature
```

### CORS Configuration

Dynamic CORS validation against trusted origins:

```typescript
const ALLOWED_ORIGINS = [
  'https://aiinteriorstudio.lovable.app',
  'https://id-preview--fb489c3d-6a86-4840-8a00-476f55dba1f8.lovable.app'
];
```

### Error Handling

Generic error messages prevent information leakage:

```typescript
// ❌ Bad - leaks internal details
return new Response(JSON.stringify({ error: error.message }));

// ✅ Good - generic message
return new Response(JSON.stringify({ error: 'An error occurred processing your request' }));
```

---

## Payment Security

### Stripe Integration

1. **Server-side price validation**: Credit pack prices are validated in `stripe-checkout` edge function
2. **Webhook signature verification**: All Stripe webhooks verified via `STRIPE_WEBHOOK_SECRET`
3. **Service role for database updates**: Payment records only modified by service role

### Credit Functions

Both `add_credits` and `deduct_credits` require service role:

```sql
IF auth.role() != 'service_role' THEN
  RAISE EXCEPTION 'Unauthorized: This function can only be called by service role';
END IF;
```

---

## AI Prompt Security

### Prompt Injection Protection

Multi-layered defense against prompt injection attacks:

1. **Keyword Detection**: Blocks known injection patterns
2. **Special Character Monitoring**: Flags excessive special characters
3. **Role Marker Sanitization**: Removes system/assistant/user markers
4. **Suspicious Prompt Logging**: Logs flagged prompts for admin review

```typescript
const INJECTION_PATTERNS = [
  'ignore previous', 'ignore above', 'disregard',
  'new instructions', 'override', 'system prompt',
  'you are now', 'act as', 'pretend to be',
  'jailbreak', 'bypass', 'unlock'
];
```

### Input Validation

- Maximum prompt length: 1000 characters
- HTML/script tag stripping
- Rate limiting per user/endpoint

---

## Audit Logging

### Admin Activity Logs

All admin actions are logged to `admin_activity_logs`:

| Column | Description |
|--------|-------------|
| admin_user_id | Who performed the action |
| action_type | Type of action (e.g., "adjust_credits") |
| target_user_id | Affected user (if applicable) |
| details | JSON with action details |
| created_at | Timestamp |

### Immutability

Logs cannot be modified or deleted:

```sql
CREATE POLICY "No one can update admin logs" 
ON admin_activity_logs FOR UPDATE USING (false);

CREATE POLICY "No one can delete admin logs" 
ON admin_activity_logs FOR DELETE USING (false);
```

---

## Security Checklist

### Before Deployment

- [ ] All tables have RLS enabled
- [ ] Sensitive tables block anonymous access
- [ ] User data isolated with `auth.uid() = user_id`
- [ ] Service role required for financial mutations
- [ ] JWT verification enabled on edge functions
- [ ] Stripe webhook signature verification active
- [ ] Admin self-privilege escalation blocked
- [ ] Audit logs are immutable

### Ongoing Monitoring

- [ ] Review suspicious prompt logs
- [ ] Monitor rate limit violations
- [ ] Audit admin activity logs
- [ ] Run security scans regularly

---

## Contact

For security concerns, contact the development team.

*Last updated: January 2026*
