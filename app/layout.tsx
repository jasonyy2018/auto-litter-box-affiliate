import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { Header, Footer } from '@/components';
import AuthProvider from '@/components/AuthProvider';
import CartDrawer from '@/components/CartDrawer';
import { CartProvider } from '@/lib/CartContext';
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _paq = window._paq = window._paq || [];
              /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="//matomo.wisdomitc.com/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '6']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `,
          }}
        />
        {/* Pinterest Tag (Conversion Tracking) */}
        {process.env.NEXT_PUBLIC_PINTEREST_TAG_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(e){if(!window.pintrk){window.pintrk=function(){
                window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                n=window.pintrk;n.queue=[],n.version="3.0";var
                t=document.createElement("script");t.async=!0,t.src=e;var
                r=document.getElementsByTagName("script")[0];
                r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
                pintrk('load', '${process.env.NEXT_PUBLIC_PINTEREST_TAG_ID}');
                pintrk('page');
              `,
            }}
          />
        )}
      </head>
      <body className={`${outfit.variable} min-h-screen flex flex-col font-sans antialiased text-text-primary bg-white`} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="grow">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
