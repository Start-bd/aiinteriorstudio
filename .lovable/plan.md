

# SEO Audit, Mobile Optimization & Sitemap Update

## Findings

### Sitemap Issues
1. **Outdated `lastmod` dates** -- All entries show `2026-01-19`, nearly 2 months stale
2. **Missing routes** -- `/contact` page exists but isn't in sitemap; blog posts have old dates
3. **Sitemap URL mismatch** -- robots.txt references `interiorofai.com/sitemap.xml` but the published URL is `aiinteriorstudio.lovable.app`; needs to work for both
4. **No `<image:image>` tags** despite declaring the image namespace -- missed opportunity for image SEO on gallery/blog pages

### Mobile SEO Gaps
5. **No `theme-color` meta tag** -- Browsers/PWA don't get brand color on mobile
6. **No Apple touch icon** -- iOS home screen bookmark shows generic icon
7. **Missing `mobile-web-app-capable` meta** -- No PWA-lite support
8. **Hero section** -- 15 floating particles render on mobile, wasting GPU for elements users barely see on small screens

### Meta & Structured Data
9. **Pricing page** missing `canonical` link
10. **Contact page** missing `canonical` link  
11. **Gallery page** missing `canonical` link and structured data
12. **Blog index** has canonical but blog posts lack `article:published_time` and `article:author` OG tags

---

## Implementation Plan

### 1. Regenerate sitemap.xml with current dates and all routes
- Update all `lastmod` to `2026-03-07`
- Add missing `/contact` route
- Add `<image:image>` entries for key pages (homepage og-image, blog featured images)
- Keep `interiorofai.com` as the canonical domain

### 2. Update robots.txt
- Add `Disallow: /collection/` for shared collection private URLs
- Keep sitemap reference as-is (points to production domain)

### 3. Mobile meta tags in index.html
- Add `<meta name="theme-color" content="#1a1a1a">` 
- Add `<link rel="apple-touch-icon" href="/og-image.jpg">`
- Add `<meta name="mobile-web-app-capable" content="yes">`

### 4. Add canonical links to pages missing them
- **Pricing.tsx**: Add `<link rel="canonical" href="https://interiorofai.com/pricing" />`
- **Contact.tsx**: Add `<link rel="canonical" href="https://interiorofai.com/contact" />`
- **AIGallery.tsx**: Add `<link rel="canonical" href="https://interiorofai.com/gallery" />`
- **BlogPost.tsx**: Add `article:published_time` and `article:author` OG meta tags

### 5. Mobile performance: skip particles on small screens
- In `HeroSection.tsx`, use the `useIsMobile` hook to render 0 particles on mobile (< 768px), saving GPU/paint cycles

### 6. Add structured data to Gallery page
- Add `ImageGallery` schema markup via JSON-LD in AIGallery.tsx

---

### Files to modify:
- `public/sitemap.xml` -- full regeneration
- `public/robots.txt` -- add collection disallow
- `index.html` -- mobile meta tags
- `src/pages/Pricing.tsx` -- canonical link
- `src/pages/Contact.tsx` -- canonical link
- `src/pages/AIGallery.tsx` -- canonical + gallery schema
- `src/pages/BlogPost.tsx` -- article OG meta
- `src/components/HeroSection.tsx` -- skip particles on mobile

