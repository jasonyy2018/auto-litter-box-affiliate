import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown, Zap } from 'lucide-react';
import '@/styles/globals.css';
import { Header, Footer } from '@/components';
import { siteConfig } from '@/lib/seo';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Best Automatic Litter Box Reviews & Comparisons`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${outfit.variable} min-h-screen flex flex-col font-sans antialiased text-text-primary bg-white`}>
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
