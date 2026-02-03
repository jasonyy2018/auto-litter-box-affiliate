import { Metadata } from 'next';
import Link from 'next/link';
import { Tag, Clock, Percent, ExternalLink } from 'lucide-react';
import { getAllProducts, Product } from '@/lib/products';
import { generateMetadata as generateSeoMetadata } from '@/lib/seo';
import { affiliateDisclosure } from '@/lib/affiliate';
import BuyButton from '@/components/BuyButton';
import Rating from '@/components/Rating';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Automatic Litter Box Deals & Coupons 2024',
  description: 'Find the best deals, discounts, and coupon codes for automatic litter boxes. Save on Litter-Robot, PETKIT, CatLink and more.',
  path: '/deals',
});

interface Deal {
  productSlug: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  expires?: string;
  verified: boolean;
}

const currentDeals: Deal[] = [
  {
    productSlug: 'litter-robot-4',
    title: '$50 Off Litter-Robot 4',
    description: 'Save $50 on the Litter-Robot 4 with free shipping. Limited time offer!',
    discount: '$50 OFF',
    expires: 'Jan 31, 2024',
    verified: true,
  },
  {
    productSlug: 'petkit-pura-max',
    title: 'PETKIT Pura Max Sale',
    description: 'Get $50 off the PETKIT Pura Max plus free deodorizer refills.',
    discount: '$50 OFF',
    code: 'PETKIT50',
    expires: 'Feb 15, 2024',
    verified: true,
  },
  {
    productSlug: 'catlink-scooper',
    title: 'CatLink Bundle Deal',
    description: 'Save $50 when you buy the CatLink Scooper with accessories bundle.',
    discount: '$50 OFF',
    expires: 'Ongoing',
    verified: true,
  },
];

function DealCard({ deal, product }: { deal: Deal; product: Product }) {
  return (
    <div className="card p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
      <div className="md:flex gap-6">
        {/* Product Image */}
        <div className="md:w-1/4 flex-shrink-0">
          <Link href={`/reviews/${product.slug}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain bg-white rounded-lg"
            />
          </Link>
        </div>

        {/* Deal Info */}
        <div className="md:w-3/4 mt-4 md:mt-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-500 text-white">
              {deal.discount}
            </span>
            {deal.verified && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                Verified
              </span>
            )}
            {deal.expires && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Expires: {deal.expires}
              </span>
            )}
          </div>

          <Link href={`/reviews/${product.slug}`}>
            <h3 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
              {deal.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 mt-2">{deal.description}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gray-500">{product.name}</span>
            <span className="text-gray-300">|</span>
            <Rating value={product.rating} size="sm" />
          </div>

          {deal.code && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg inline-flex items-center gap-3">
              <span className="text-sm text-gray-600">Use code:</span>
              <code className="font-mono font-bold text-lg text-primary-600">{deal.code}</code>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <BuyButton
              productSlug={product.slug}
              productName={product.name}
              label="Get This Deal"
              size="md"
            />
            <Link
              href={`/reviews/${product.slug}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Read Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const products = getAllProducts();
  const productsMap = products.reduce((acc, p) => ({ ...acc, [p.slug]: p }), {} as Record<string, Product>);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-primary-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium mb-4">
            <Percent className="w-5 h-5 mr-2" />
            Updated Daily
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Automatic Litter Box Deals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the best discounts and coupon codes for top automatic litter boxes. We update this page daily!
          </p>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="affiliate-disclosure">
          {affiliateDisclosure.short}
        </div>
      </div>

      {/* Current Deals */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Current Deals</h2>
          <div className="space-y-6">
            {currentDeals.map((deal, index) => {
              const product = productsMap[deal.productSlug];
              if (!product) return null;
              return <DealCard key={index} deal={deal} product={product} />;
            })}
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-8">Quick Price Comparison</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card p-6 text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-contain mx-auto mb-4"
                />
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-2xl font-bold text-primary-600">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="inline-block mt-2 text-sm text-green-600 font-medium">
                    Save ${product.originalPrice - product.price}
                  </span>
                )}
                <div className="mt-4">
                  <BuyButton productSlug={product.slug} productName={product.name} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Tips */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-8">Tips for Finding the Best Deals</h2>
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-2">Best Times to Buy</h3>
              <p className="text-gray-600">
                The best deals on automatic litter boxes typically occur during Black Friday, 
                Prime Day, and holiday sales. However, we often find exclusive discounts year-round.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-2">Bundle Deals</h3>
              <p className="text-gray-600">
                Many manufacturers offer bundles that include accessories like extra filters, 
                waste bags, or litter. These often provide better value than buying separately.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-2">Subscribe to Newsletters</h3>
              <p className="text-gray-600">
                Signing up for brand newsletters often gets you exclusive discount codes and 
                early access to sales. Litter-Robot and PETKIT both offer subscriber discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-primary-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Deal Alerts
          </h2>
          <p className="text-primary-100 mb-6">
            Subscribe to get notified when we find new deals and discounts on automatic litter boxes.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-300"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
