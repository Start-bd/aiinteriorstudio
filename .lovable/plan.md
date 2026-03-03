

# Master Audit: Bugs and Error Gaps

After a thorough review of the entire codebase, here are the bugs, error gaps, and issues found.

---

## Critical Bugs

### 1. No PASSWORD_RECOVERY event handler in Auth.tsx
The "Forgot password" flow sends a reset email with `redirectTo: /auth`, but when users click the reset link and land back on `/auth`, there is **no handler** for the `PASSWORD_RECOVERY` auth event. The user arrives at the sign-in page with no way to actually set a new password. The `onAuthStateChange` listener in `useAuth.tsx` doesn't detect the `PASSWORD_RECOVERY` event and show a password update form.

**Fix:** Add a `PASSWORD_RECOVERY` event handler in `useAuth` or `Auth.tsx` that detects the event, shows a "Set new password" form, and calls `supabase.auth.updateUser({ password })`.

### 2. Credit deduction without rollback on image generation failure
In `generate-interior-image/index.ts`, credits are deducted **before** the AI image generation call (line 380-401). If the AI gateway returns an error (429, 402, 500) or fails to produce an image, the credit is lost and **never refunded**. The user pays for nothing.

**Fix:** Add a credit refund step (`add_credits` RPC call) in the error/failure branches after the AI gateway call.

### 3. Deprecated `onKeyPress` in ChatBot.tsx
Line 487 uses `onKeyPress` which is deprecated in React and modern browsers. Should be `onKeyDown`.

**Fix:** Replace `onKeyPress` with `onKeyDown` in ChatBot.tsx.

---

## Medium Bugs

### 4. Favorite toggle toast shows wrong state
In `AIGallery.tsx` lines 131-137, after `toggleFavorite` succeeds, it checks `isFavorite(imageId)` for the toast message. But `toggleFavorite` has already updated the state by this point, so the message is **inverted** -- it says "Removed" when you just added, and vice versa.

**Fix:** Capture the `isFavorite` state *before* calling `toggleFavorite`, then use that for the toast.

### 5. `useSubscription` exposes `stripe_subscription_id`
The hook queries `subscriptions` table directly (line 37) and the result includes `stripe_subscription_id` and `stripe_price_id`. These are Stripe-internal identifiers that shouldn't be exposed to the client. Unlike `profiles` which uses `profiles_safe`, subscriptions has no safe view.

**Fix:** Either create a `subscriptions_safe` view excluding Stripe IDs, or explicitly select only needed columns instead of `select('*')`.

### 6. `generated_images_public` view doesn't filter `is_featured`
The `generated_images_public` view (based on the schema) appears to return all images, not just featured ones. The AIGallery queries this view without filtering, meaning it could show non-featured, non-public images if the view definition isn't restrictive. Needs verification of the view's SQL definition.

### 7. Gallery page fetches ALL images without limit
In `AIGallery.tsx` line 91-94, the query to `generated_images_public` has no `.limit()` clause. The pagination is client-side only (slicing the full array). As the database grows, this will fetch thousands of rows unnecessarily.

**Fix:** Add server-side pagination with `.range()` instead of client-side slicing.

---

## Minor Issues

### 8. `handleGenerateClick` in ChatBot uses `setTimeout` hack
Line 284: `setTimeout(() => handleSend(), 100)` to wait for state update. This is a race condition waiting to happen. Should use a ref or `useEffect` pattern instead.

### 9. Auth page navigates immediately on signup without email verification
Line 99: After signup, it navigates to `/` immediately with a success toast. But if email confirmation is required (which it should be per security policy), the user hasn't verified yet and may be confused about why they can't use features.

**Fix:** Show a "Check your email to verify your account" message instead of navigating away.

### 10. Missing `room_type` in AIGenerator generation flow
The `AIGenerator` sends the prompt to the edge function but doesn't include `selectedRoom` in the request body. The edge function detects style from text but `room_type` in the database record defaults to `living_room`. The selected room type is only used to build the prompt text, never stored accurately.

---

## Implementation Plan

### Phase 1: Critical Fixes
1. **Add password recovery handler** -- Detect `PASSWORD_RECOVERY` event in auth flow, show a new-password form, and call `updateUser`
2. **Add credit refund on generation failure** -- In the edge function, call `add_credits` to refund 1 credit if image generation fails after deduction
3. **Replace `onKeyPress` with `onKeyDown`** in ChatBot.tsx

### Phase 2: Medium Fixes
4. **Fix favorite toggle toast inversion** -- Capture state before toggling
5. **Restrict subscription query columns** -- Select only needed fields, excluding Stripe IDs
6. **Add server-side pagination to AIGallery** -- Use `.range()` with count instead of client-side slicing

### Phase 3: Minor Fixes
7. **Fix signup flow** -- Show verification message instead of navigating on signup
8. **Fix ChatBot setTimeout race condition** -- Use ref-based approach
9. **Pass room_type to edge function** -- Store accurate room type in database

### Technical Details

**Password recovery handler (useAuth.tsx):**
```typescript
// In onAuthStateChange callback:
if (event === 'PASSWORD_RECOVERY') {
  // Set a flag that Auth.tsx can use to show password reset form
}
```

**Credit refund (generate-interior-image/index.ts):**
```typescript
// After AI gateway failure:
await supabaseAdmin.rpc('add_credits', {
  p_user_id: user.id,
  p_amount: 1,
  p_type: 'refund',
  p_description: 'Refund for failed image generation'
});
```

**Favorite toast fix (AIGallery.tsx):**
```typescript
const wasFavorite = isFavorite(imageId);
const success = await toggleFavorite(imageId);
if (success) {
  toast({ title: wasFavorite ? "Removed from favorites" : "Added to favorites" });
}
```

