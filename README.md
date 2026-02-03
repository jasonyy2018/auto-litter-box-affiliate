# AutoLitterBox Pro - Affiliate Website

A modern, SEO-optimized affiliate website for automatic litter box reviews and comparisons built with Next.js 14.

## Features

- **SEO Optimized**: Full metadata, Open Graph, JSON-LD schemas
- **Responsive Design**: Mobile-first with Tailwind CSS
- **MDX Content**: Rich content with React components
- **Affiliate Integration**: Amazon and direct affiliate links with tracking
- **Component Library**: Reusable UI components for product reviews
- **Performance**: Static generation, optimized images

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: MDX with gray-matter
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Project Structure

```
auto-litter-box-affiliate/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Homepage
│   ├── best/               # Best picks page
│   ├── compare/            # Comparison pages
│   ├── reviews/            # Product review pages
│   ├── guides/             # Buying guides
│   ├── blog/               # Blog articles
│   └── deals/              # Deals and coupons
├── components/             # React components
│   ├── ComparisonTable.tsx # Product comparison table
│   ├── ProductCard.tsx     # Product display card
│   ├── ProsCons.tsx        # Pros/Cons lists
│   ├── Rating.tsx          # Star rating component
│   ├── BuyButton.tsx       # Affiliate CTA button
│   ├── FAQ.tsx             # FAQ with schema
│   └── TOC.tsx             # Table of contents
├── content/                # MDX content files
│   ├── products/           # Product review content
│   ├── compare/            # Comparison articles
│   ├── guides/             # Guide content
│   └── blog/               # Blog posts
├── lib/                    # Utility functions
│   ├── seo.ts              # SEO utilities and schemas
│   ├── products.ts         # Product data and functions
│   └── affiliate.ts        # Affiliate link management
├── public/                 # Static assets
│   └── images/             # Product images
├── styles/
│   └── globals.css         # Global styles
└── next.config.js          # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file:

```env
# Site URL (for sitemap and canonical URLs)
NEXT_PUBLIC_SITE_URL=https://autolitterboxpro.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Content Management

### Adding a New Product

1. Add product data to `lib/products.ts`
2. Create MDX content in `content/products/[slug].mdx`
3. Add product images to `public/images/products/`

### Adding Blog Posts

Create a new file in `content/blog/` with frontmatter:

```mdx
---
title: "Your Post Title"
description: "Post description for SEO"
date: "2024-01-15"
author: "Author Name"
---

# Your Content Here
```

## Affiliate Setup

Edit `lib/affiliate.ts` to configure:

- Amazon Associate tag
- Direct affiliate links
- UTM tracking parameters

## SEO Features

- Automatic sitemap generation (`/sitemap.xml`)
- Robots.txt configuration
- JSON-LD schemas for:
  - Product reviews
  - FAQ pages
  - Breadcrumbs
  - Articles
- Open Graph and Twitter cards
- Canonical URLs

## Customization

### Styling

Edit `tailwind.config.js` to customize:
- Color palette
- Typography
- Spacing

### Components

All components are in `components/` and fully customizable.

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

Build the static site:

```bash
npm run build
```

Deploy the `.next` folder to your hosting provider.

## License

MIT License - See LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue.
