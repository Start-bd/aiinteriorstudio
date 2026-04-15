

# SEO Audit & Fix Plan for interiorofai.com

## Issues Found

From Google Search Console screenshots and code analysis:

### 1. Soft 404 (12 pages)
The `NotFound` component returns HTTP 200 (normal SPA behavior). Google crawls URLs like `/shop` that don't exist, gets a 200 response with minimal content, and flags them as "Soft 404." The fix: add a proper `<meta name="robots" content="noindex">` and a `410` status signal to the NotFound page, plus remove any links/references to non-existent pages like `/shop`.

### 2. Missing Canonical Links (7 pages)
These pages lack `<link rel="canonical">`:
- `/generate`
- `/terms`
- `/privacy`
- `/cookies`
- `/refund`
- `/auth`
- `/dashboard` (also has noindex, which is correct)

The static `index.html` has `<link rel="canonical" href="https://interiorofai.com">` which loads on every route before React hydrates — causing Google to see duplicate canonicals pointing to the homepage.

### 3. Sitemap Contradictions
The sitemap includes `/dashboard` and `/profile`, but both have `<meta name="robots" content="noindex, nofollow">`. This sends conflicting signals to Google. These should be removed from the sitemap.

### 4. Missing `noindex` on Auth Page
`/auth` is a login/signup page — should have `noindex` and not be in the sitemap.

## Plan

### Step 1: Fix `index.html` — Remove static canonical
Remove the hardcoded `<link rel="canonical" href="https://interiorofai.com">` from `index.html`. Each page will set its own canonical via `react-helmet-async`.

### Step 2: Add canonical links to all public pages
Add `<link rel="canonical">` to pages missing them:
- `Generate.tsx` → `https://interiorofai.com/generate`
- `Terms.tsx` → `https://interiorofai.com/terms`
- `PrivacyPolicy.tsx` → `https://interiorofai.com/privacy`
- `CookiePolicy.tsx` → `https://interiorofai.com/cookies`
- `RefundPolicy.tsx` → `https://interiorofai.com/refund`

### Step 3: Add `noindex` + `nofollow` to Auth page
Update `Auth.tsx` Helmet to include `<meta name="robots" content="noindex, nofollow">`.

### Step 4: Fix NotFound page for Soft 404
Update `NotFound.tsx` to include:
- `<meta name="robots" content="noindex">`
- A proper title like "Page Not Found | Interior of AI"
- Helmet meta tags so Google understands this is a dead-end

### Step 5: Clean up sitemap
Remove `/dashboard`, `/profile`, and `/auth` from `sitemap.xml` since they have `noindex` or are private. These pages should not be discoverable by search engines.

### Step 6: Update robots.txt
The `Disallow: /dashboard` and `Disallow: /profile` rules are already present, which is good. Add `Disallow: /auth` to block crawling of the auth page.

### Files to modify
- `index.html` — remove static canonical
- `src/pages/Generate.tsx` — add canonical
- `src/pages/Terms.tsx` — add canonical
- `src/pages/PrivacyPolicy.tsx` — add canonical
- `src/pages/CookiePolicy.tsx` — add canonical
- `src/pages/RefundPolicy.tsx` — add canonical
- `src/pages/Auth.tsx` — add noindex
- `src/pages/NotFound.tsx` — add Helmet with noindex + proper title
- `public/sitemap.xml` — remove /dashboard, /profile, /auth
- `public/robots.txt` — add Disallow /auth

