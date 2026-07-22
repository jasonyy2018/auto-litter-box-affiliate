# Comprehensive Optimization Plan: AutoLitterBox Pro Affiliate Site

## Context
The project is an affiliate marketing site for automatic litter boxes built with Next.js 16. It has substantial gaps between its content layer (MDX files for 3 real products) and its data layer (47 AI-generated placeholder products). The static `lib/products.ts` data is not linked to the real MDX content or affiliate links. Core features like homepage FAQ are non-functional. The shop uses a JSON file as database (incompatible with serverless deployment). Overall, the site structure is solid but the execution has critical gaps that prevent conversion.

The goal: fix all critical issues, complete the site's functionality, and optimize for customer acquisition and conversion.

---

## Phase 1: 🔴 Fix Critical Site-Breaking Issues

### 1.1 Replace AI-Generated Products with Real Products
- **Files:** `lib/products.ts`
- **What:** Remove all 47 generated products. Replace with 3 real products (Litter-Robot 4, PETKIT Pura Max, CatLink Scooper) matching the MDX content and affiliate links.
- **Details:** Use real data from MDX files (specs, features, pros/cons, prices, ratings). Map slugs to match `lib/affiliate.ts` ('litter-robot-4', 'petkit-pura-max', 'catlink-scooper').
- **Why:** The current 47 products are fake — the entire site shows nonsense products. Users can't click through to buy anything real. This is P0.
- **Reuse:** Schema from `lib/products.ts::Product` interface stays the same. Real data from `content/products/*.mdx`.

### 1.2 Fix Homepage FAQ to Use Interactive Component
- **Files:** `app/page.tsx`
- **What:** Replace static FAQ HTML with `<FAQ items={faqs} />` component from `components/FAQ.tsx` (which already supports expand/collapse, JSON-LD schema, and accessibility).
- **Why:** Current FAQ is decorative — plus icons are unclickable, no answers visible.

### 1.3 Add Hero Video Fallback
- **Files:** `app/page.tsx`
- **What:** Add an `<img>` fallback when the video fails to load, using `onError` handler. Replace with a static image from Unsplash.
- **Why:** Missing video file leaves hero section blank.

## Phase 2: 🟠 Conversion-Focused Enhancements

### 2.1 Add Urgency & Social Proof to Homepage
- **Files:** `app/page.tsx`
- **What:**
  - Add a real-time counter showing "X people are viewing this page" (client-side randomized timer)
  - Add "Limited Time Deal" countdown timer to top picks section
  - Add customer testimonial carousel between comparison table and FAQ
  - Add affiliate disclosure banner (reuse from `lib/affiliate.ts`)

### 2.2 Add Conversion CTAs Throughout Site
- **Files:** `components/Footer.tsx`, `components/Header.tsx`
- **What:**
  - Add back-to-top CTA button
  - Add "Subscribe for Deal Alerts" email capture in footer
  - Add sticky mobile bottom bar with "View Top Pick" CTA

### 2.3 Add Breadcrumb Navigation
- **Files:** `components/Breadcrumb.tsx` (new), `app/reviews/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/compare/[slug]/page.tsx`
- **What:** Create a `Breadcrumb` component with JSON-LD schema. Add to review pages, blog posts, comparison pages, product pages.
- **Why:** Breadcrumbs improve SEO ranking signals and user navigation.

### 2.4 Enhance Review Page CTA
- **Files:** `app/reviews/[slug]/page.tsx`
- **What:**
  - Add price comparison with competitor table
  - Add sticky mobile buy bar
  - Add "Compare with Similar Products" section
  - Add review timestamp showing "Updated: July 2026"
- **Reuse:** `BuyButton` component, `ComparisonTable` component

## Phase 3: 🟡 Performance & UX Optimization

### 3.1 Replace `<img>` with Next.js `<Image>`
- **Files:** `components/ProductCard.tsx`, `components/ComparisonTable.tsx`, `app/reviews/[slug]/page.tsx`
- **What:** Replace all `<img>` tags with Next.js `<Image>` component for automatic optimization (lazy loading, responsive sizes, WebP).
- **Why:** Improves LCP, reduces bandwidth, boosts Core Web Vitals score.

### 3.2 Add Accessibility
- **Files:** `styles/globals.css`
- **What:** Add `prefers-reduced-motion` media query to disable animations for users with motion sensitivity.
- **Why:** Accessibility best practice, legal compliance.

### 3.3 Add Page Loading States
- **Files:** `app/shop/checkout/page.tsx`, `app/shop/page.tsx`
- **What:** Review all async data fetching. Add proper loading skeletons and error boundaries.

### 3.4 Fix Image Loading
- **Files:** `app/page.tsx` (homepage)
- **What:** Add explicit width/height to hero video container. Set explicit aspect ratios to prevent layout shift (CLS).

## Phase 4: 🔵 SEO & Content Optimization

### 4.1 Add robots.txt
- **Files:** `app/robots.ts` (new)
- **What:** Create robots.txt route handler. Allow all crawlers, point to sitemap.
- **Why:** Missing robots.txt is a basic SEO gap.

### 4.2 Enhance Sitemap
- **Files:** `app/sitemap.ts`
- **What:** Add all routes: shop, checkout, blog posts from DB, admin routes (disallow in robots), affiliate dashboard, login/register, guide pages.
- **Reuse:** `lib/blogDb.ts::getAllUnifiedBlogs()`

### 4.3 Add JSON-LD Breadcrumbs to All Pages
- **Files:** `lib/seo.ts` (new function `generateBreadcrumbSchema` already exists), various pages
- **What:** Add breadcrumb JSON-LD to review pages, blog pages, comparison pages.
- **Reuse:** `lib/seo.ts::generateBreadcrumbSchema()`

### 4.4 Add More Rich Results
- **Files:** `app/reviews/[slug]/page.tsx`
- **What:** Currently has Product schema. Add Review schema with actual review text, add VideoObject schema if video exists.
- **Reuse:** `lib/seo.ts::generateProductSchema()` already exists and is used.

## Phase 5: 🛠 Infrastructure & Code Quality

### 5.1 Create Real Product Data as JSON
- **Files:** `data/products.json` (new), `lib/products.ts` (refactor)
- **What:** Move static product data to `data/products.json` and load it via `fs.readFileSync`. This makes data editable without touching TypeScript code.
- **Why:** The file is currently 2000+ lines of identical template code. A JSON file is cleaner and cheaper to maintain.

### 5.2 Add Error Boundaries to API Routes
- **Files:** All `app/api/*/route.ts` files
- **What:** Ensure every route has try-catch that returns structured error responses (not just throwing 500). Add logger for debugging.

### 5.3 Add Loading States
- **Files:** `app/shop/checkout/page.tsx`, `app/shop/page.tsx`
- **What:** Ensure all client components handle loading, empty, error, and edge-case states properly.

### 5.4 Add Google Analytics 4
- **Files:** `app/layout.tsx`
- **What:** Add GA4 script tag (optional, based on env). Currently only Matomo exists. Add GA4 for broader analytics.

## Phase 6: 🎨 Visual & Trust Enhancements

### 6.1 Add Trust Badges
- **Files:** `app/shop/checkout/page.tsx`
- **What:** Add SSL badge, money-back guarantee badge, secure payment icons.

### 6.2 Add Affiliate Disclosure
- **Files:** `components/AffiliateDisclosure.tsx` (new)
- **What:** Create a reusable disclosure banner. Add to review pages, comparison pages, blog posts.
- **Reuse:** `lib/affiliate.ts::affiliateDisclosure`

### 6.3 Add Price History / Savings Highlight
- **Files:** `app/reviews/[slug]/page.tsx`, `components/PriceHistory.tsx` (new)
- **What:** Show savings badge with original vs current price. Add "price updated X days ago" label.

---

## Verification

1. Run `npm run build` — must succeed with no errors
2. Visit homepage — see real products (Litter-Robot 4, PETKIT, CatLink) with clickable Buy buttons
3. Click FAQ — accordion works, schema renders in HTML
4. Visit `/reviews/litter-robot-4` — full review page with real data, breadcrumbs, affiliate links
5. Visit `/shop` — products load from database/JSON, pagination works, search works
6. Visit `/blog` — blog posts render from DB with fallback
7. Run `npm run lint` — zero warnings
8. Check `app/sitemap.ts` output — includes all real URLs
9. Check `localhost:3000/robots.txt` — returns valid robots
10. Navigate mobile — sticky bottom bar, cart drawer, mobile menu all work
