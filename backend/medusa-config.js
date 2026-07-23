const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env' });
}

const ADMIN_CORS = process.env.MEDUSA_ADMIN_CORS || 'http://localhost:9000,http://localhost:8000';
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:3000';
const DATABASE_URL = process.env.DATABASE_URL;

module.exports = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseType: 'postgres',
    storeCors: STORE_CORS,
    adminCors: ADMIN_CORS,
    jwtSecret: process.env.JWT_SECRET || 'supersecret',
    cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    redisUrl: process.env.REDIS_URL,
  },
  plugins: [
    // PayPal Payment Provider
    {
      resolve: '@medusajs/payment-paypal',
      options: {
        sandbox: process.env.PAYPAL_SANDBOX_CLIENT_ID
          ? {
              clientId: process.env.PAYPAL_SANDBOX_CLIENT_ID,
              clientSecret: process.env.PAYPAL_SANDBOX_CLIENT_SECRET,
            }
          : undefined,
        live: process.env.PAYPAL_LIVE_CLIENT_ID
          ? {
              clientId: process.env.PAYPAL_LIVE_CLIENT_ID,
              clientSecret: process.env.PAYPAL_LIVE_CLIENT_SECRET,
            }
          : undefined,
      },
    },
    // Manual Fulfillment (for CJ Dropshipping override)
    {
      resolve: '@medusajs/fulfillment-manual',
    },
    // Email Notifications via SendGrid
    process.env.SENDGRID_API_KEY && {
      resolve: '@medusajs/notification-sendgrid',
      options: {
        apiKey: process.env.SENDGRID_API_KEY,
        from: process.env.SENDGRID_FROM || 'notifications@autolitterboxpro.com',
      },
    },
  ].filter(Boolean),
  modules: {
    // Custom CJ Dropshipping Fulfillment Provider (registered but using manual as fallback)
    fulfillmentService: {
      resolve: '@medusajs/fulfillment-manual',
    },
  },
};
