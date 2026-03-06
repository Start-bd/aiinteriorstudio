

# Remaining Action Items - Verification & Fixes

## Verified as Already Fixed

- **room_type storage**: `AIGenerator.tsx` line 101 passes `room_type: selectedRoom || 'living_room'` to the edge function, and the edge function stores it at line 499. Fixed.
- **Credit refund logic**: Fully implemented with `refundCredits()` helper at lines 430-443, called on HTTP errors (line 447), missing image (line 479), and unexpected catch block (lines 520-536). Fixed.
- **ChatBot setTimeout**: Replaced with direct message construction at lines 278-289. Fixed.
- **`generated_images_public` view**: Confirmed via SQL — the view definition includes `WHERE (is_featured = true)`. Only featured images are exposed. No issue.

## Still Needs Fixing (2 items)

### 1. Gallery pagination is still client-side

`AIGallery.tsx` lines 91-94 fetch ALL rows from `generated_images_public` with no `.limit()` or `.range()`. Lines 107-111 then slice the full array client-side. This defeats the purpose of pagination — all data is still downloaded.

**Fix:** Replace with server-side pagination using `.range()` and a count query:
```typescript
const from = (currentPage - 1) * ITEMS_PER_PAGE;
const to = from + ITEMS_PER_PAGE - 1;

const { data, count, error } = await supabase
  .from("generated_images_public")
  .select("*", { count: "exact" })
  .order("created_at", { ascending: false })
  .range(from, to);
```
This requires refactoring `fetchImages` to accept the current page and filter, and re-fetching when page or filter changes. The `totalPages` calculation uses `count` from the query instead of `filteredImages.length`.

### 2. Mobile cookie banner overlap

On 390px viewports, the cookie banner's `p-4` padding and multi-line text consume significant screen space, pushing content below the fold.

**Fix:** Reduce padding and text size on mobile, and cap max height:
```css
/* Change from p-4 to p-3 sm:p-4, text-xs on mobile */
className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 max-h-[40vh] overflow-y-auto bg-background/95 ..."
```
Also make the description text `text-xs sm:text-sm` and stack buttons vertically on very small screens.

## Implementation Plan

1. **Refactor AIGallery to server-side pagination** — Change `fetchImages` to use `.range()` with `{ count: "exact" }`, trigger re-fetch on page/filter change via `useEffect`, remove client-side slicing
2. **Fix mobile cookie banner** — Reduce padding, shrink text, and cap banner height on small screens

