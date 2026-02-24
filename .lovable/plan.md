
# Complete Website Audit Report

## 1. Security Issues (6 findings from scan)

### Critical (3 items to fix)

**A. AIGallery.tsx queries `generated_images` directly without user filter**
- Line 63-66: `supabase.from("generated_images").select("*")` fetches ALL images (not just featured or user-owned)
- This exposes `user_id` for every image to any authenticated user
- **Fix:** Query `generated_images_public` view for the public gallery (strips `user_id`), and only query `generated_images` with `user_id` filter for user's own images

**B. `styles` table exposes `prompt_template` and `negative_prompt_template`**
- These are proprietary AI prompting strategies readable by anyone
- **Fix:** Create a `styles_public` view that excludes `prompt_template` and `negative_prompt_template`, add RLS policy for the view, and update frontend hooks to query the view instead

**C. `generated_images_public` and `payments_safe` views show as "no RLS policies"**
- These are views with `security_invoker=true` which correctly inherit base table RLS
- The scan flags them but they're secure by design
- **Action:** Mark as ignored in scan results with explanation

### Medium (2 items)

**D. `room_types` table fully public** - This is intentional for UI purposes (read-only config data). Mark as accepted.

**E. `profiles_safe` view flagged** - Already ignored; uses `security_invoker=true`. No change needed.

---

## 2. Code Quality Issues

### A. AIGallery.tsx - Missing pagination
- Fetches ALL images at once with no limit, which will cause performance issues as the database grows
- **Fix:** Add pagination (e.g., 24 items per page) with load-more or page navigation

### B. Unused `FloatingParticle` component in HeroSection.tsx
- Defined at line 7-30 but never used (particles are rendered inline instead)
- **Fix:** Remove the unused component

### C. Dashboard.tsx is 863 lines
- Very large single file mixing stats, image grid, collections, bulk operations
- **Fix:** Consider splitting into sub-components (not blocking, but recommended for future maintainability)

---

## 3. UX/Accessibility Issues

### A. Mobile cookie consent overlaps content
- On mobile (390px), the cookie banner takes up significant screen real estate and pushes stats below fold
- The stats row (2.5M+, 150K+, 431K+) is cut off on mobile

### B. Auth page lacks password reset flow
- No "Forgot Password" link on the sign-in form
- **Fix:** Add a forgot password link that calls `supabase.auth.resetPasswordForEmail()`

### C. Gallery lightbox missing keyboard navigation
- No escape key handler, no arrow key navigation between images
- **Fix:** Add `useEffect` with keyboard event listeners for Escape, ArrowLeft, ArrowRight

---

## 4. SEO Issues

### A. Missing alt text quality
- Gallery images use `image.prompt` as alt text (good)
- But hero section stats icons have no aria-labels

### B. Robots.txt and sitemap look good
- Proper canonical URL, structured data, OG tags all present

---

## 5. Performance Considerations

### A. Preconnect hints are good
- Already has preconnect for Supabase, Stripe, and Google Tag Manager

### B. Gallery images lack width/height attributes
- In AIGallery.tsx, the `<img>` tags don't specify width/height, causing layout shifts
- The static GallerySection.tsx correctly has width/height (line 69-70)

---

## Implementation Plan

### Phase 1: Security Fixes (Priority)

1. **Fix AIGallery.tsx** - Change query from `generated_images` to `generated_images_public` for the public gallery view, preserving the user's own images query for authenticated context
2. **Create `styles_public` view** - SQL migration to create a view excluding prompt templates, update `useStyles` hook to query it
3. **Update scan findings** - Mark intentional patterns as ignored with proper justification

### Phase 2: UX Fixes

4. **Add forgot password** to Auth.tsx
5. **Add keyboard navigation** to gallery lightbox
6. **Add pagination** to AIGallery.tsx (limit 24 per page)

### Phase 3: Code Cleanup

7. Remove unused `FloatingParticle` component
8. Add width/height to gallery images in AIGallery.tsx

---

## Technical Details

### Migration SQL for styles_public view:
```sql
CREATE OR REPLACE VIEW public.styles_public 
WITH (security_invoker = true)
AS SELECT id, name, display_name, description, thumbnail_url, 
          is_active, is_premium, sort_order, created_at
FROM public.styles;
```

### AIGallery query fix:
```typescript
// For public gallery (unauthenticated or browsing)
const { data } = await supabase
  .from("generated_images_public")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(24);
```

### Auth forgot password addition:
```typescript
const handleForgotPassword = async () => {
  if (!email) {
    toast({ title: "Enter your email first", variant: "destructive" });
    return;
  }
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth`,
  });
  toast({ title: "Check your email for a reset link" });
};
```
