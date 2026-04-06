# AutoLitterBox Pro - Affiliate Website

A modern, SEO-optimized affiliate website for automatic litter box reviews and comparisons built with Next.js 16.

## Features

- **SEO Optimized**: Full metadata, Open Graph, JSON-LD schemas
- **Responsive Design**: Mobile-first with Tailwind CSS
- **MDX Content**: Rich content with React components
- **Affiliate Integration**: Amazon and direct affiliate links with tracking
- **Component Library**: Reusable UI components for product reviews
- **Performance**: Static generation, optimized images

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Content**: MDX with gray-matter
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Project Structure

```
auto-litter-box-affiliate/
├── app/                    # Next.js App Router pages
│   ├── api/                # Backend API Routes
│   │   ├── admin/          # OpenClaw & Admin AI control (Blogs, Products, Orders, Social)
│   │   ├── cj/             # CJ Dropshipping integrations
│   │   └── pinterest/      # Automated social media posting
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Homepage
│   ├── blog/               # SEO & AI Blogs
│   └── shop/               # Products and Checkout
├── components/             # React components
├── prisma/                 # Prisma schema for PostgreSQL DB (Users, Blogs, Orders, Config)
├── lib/                    # Utility functions
├── public/                 # Static assets
│   ├── openclaw/           # OpenClaw LLM agent skills and openapi configs
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

**Copyright © 2026 WSAI. All Rights Reserved.**

This project and its source code are proprietary and confidential to WSAI. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without the express written permission of WSAI. 

See the `LICENSE` file for more details.

## Support

For customized authorization or issues, please contact WSAI official channels.
